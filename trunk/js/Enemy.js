function Enemy(monsterId, name, hp, tileId, damageRoll){
	this.monsterId = monsterId;
	this.name = name;
	this.hp = hp;
	this.maxhp = hp;
	this.scorePrize = hp;
	this.tileId = tileId;
	this.damageRoll = damageRoll;
	this.aiType = "SIMPLE";
	this.wasHit = false;
}

Enemy.prototype.enemyAI = function (){
	if (this.aiType === "NETWORK") return; 
	if (this.monsterId === "MIMIC" && !this.wasHit)
		return;
	if (this.monsterId === "TROLL" && chance(50)){
		if (this.hp < this.maxhp){
			JSRL.ui.showMessage("The troll regenerates");
			this.hp++;
		}
	}
	if (this.monsterId === "VAMPIRE" && chance(80)){
		if (this.hp < this.maxhp){
			JSRL.ui.showMessage("The Vampire regenerates");
			this.hp++;
		}
	}
	
	var directionToPlayer = this.starePlayer();
	if (directionToPlayer == "NONE" ||
			( this.monsterId === "BAT" && chance(80) ) ||
			( this.monsterId === "FLOATING_EYE" && chance(20) ) ||
			( this.monsterId === "INVISIBLE_STALKER" && chance(50) )
		){
		//Wander aimlessly 
    	this.walk(randomDirection());
    	return;
	} else {
		var destinationPosition = {x: directionToPlayer.x + this.position.x, y: directionToPlayer.y + this.position.y};
		if (JSRL.dungeon.getMapTile(destinationPosition.x, destinationPosition.y).solid){ // This shouldn't happen much actually, as monsters can't look through walls
	    	this.walk(randomDirection());
		} else if (JSRL.dungeon.getEnemy(destinationPosition.x, destinationPosition.y)){ // There's another monster blocking us
			// Look for alternate paths using an advanced pathfinding mechanism
			var alternateDirections = getAlternateDirections(directionToPlayer);
			var alternatePosition1 = {x: alternateDirections.a1.x + this.position.x, y: alternateDirections.a1.y + this.position.y};
			var alternatePosition2 = {x: alternateDirections.a2.x + this.position.x, y: alternateDirections.a2.y + this.position.y};
			if (JSRL.dungeon.isWalkable(alternatePosition1)){
				this.walk(alternateDirections.a1);
			} else if (JSRL.dungeon.isWalkable(alternatePosition2)){
				this.walk(alternateDirections.a2);
			} else {
				this.walk(randomDirection());
			}
		} else { // There's nothing between the monster and the player, charge ahead
			this.walk(directionToPlayer);
		}
	}
};

function randomDirection(){
	return {x: rand(-1,1), y: rand(-1,1)};
}

Enemy.prototype.walk = function (direction){
	var destinationPosition = {x: direction.x + this.position.x, y: direction.y + this.position.y};
	JSRL.dungeon.tryMoveEnemyTo(this, destinationPosition);
};

Enemy.prototype.attackPlayer = function(){
	if (JSRL.player.dead)
		return;
	var directionToEnemy = {
			x: this.position.x - JSRL.player.position.x,
			y: this.position.y - JSRL.player.position.y,
		};
	if (directionToEnemy.x > 1) directionToEnemy.x = 1;
	if (directionToEnemy.x < -1) directionToEnemy.x = -1;
	if (directionToEnemy.y > 1) directionToEnemy.y = 1;
	if (directionToEnemy.y < -1) directionToEnemy.y = -1;
	var attackDirection = {x: directionToEnemy.x * -1, y: directionToEnemy.y * -1};
	switch (this.monsterId){
		case "GIANT_ANT":
			if (chance(35)){
				JSRL.player.reduceStrength();
				JSRL.ui.showMessage("You feel weaker!");
			}
		break;
		case "DRAGON":
			var destinationPosition = {x: JSRL.player.position.x + attackDirection.x * 2, y:JSRL.player.position.y + attackDirection.y * 2};
			if (JSRL.dungeon.isFree(destinationPosition)){
				attackMessage = "The "+this.getTheDescription()+" pushes you back!";
				JSRL.player.position.x = destinationPosition.x;
				JSRL.player.position.y = destinationPosition.y;
				JSRL.player.landOn(destinationPosition.x, destinationPosition.y);

			}
		break;
		case "FLOATING_EYE":
			if (chance(65) && JSRL.player.paralysisCounter === 0){
				JSRL.player.paralize();
				JSRL.ui.showMessage("The floating eye hypnotizes you with his gaze!");
			}
		break;
		case "VIOLET_FUNGI":
			if (chance(20) && JSRL.player.paralysisCounter === 0){
				JSRL.player.paralize();
				JSRL.ui.showMessage("The violet fungi engulfs you!");
			}
		break;
		case "NYMPH":
			if (chance(65)){
				if(JSRL.player.inventory.length === 0){
					JSRL.ui.showMessage("The nymph steals a kiss from you!");
				} else {
					var item = randomElementOf(JSRL.player.inventory);
					JSRL.ui.showMessage("The nymph steals a "+item.name+" from you!");
					JSRL.player.inventory.removeObject(item);
				}
				if (chance(80)){
					JSRL.ui.showMessage("The nymph vanishes");
					JSRL.dungeon.removeEnemy(this);
					return;
				}
			}
		break;
		case "RUST_MONSTER":
			if (JSRL.player.currentArmor && chance(65) && JSRL.player.currentArmor.itemId != "LEATHER"){
				JSRL.player.currentArmor.clash(40);;
				JSRL.ui.showMessage("The Rust Monster eats your "+JSRL.player.currentArmor.name);
			} else {
				JSRL.ui.showMessage("The Rust Monster licks you");
			} 
		break;
		case "UMBER_HULK":
			if (chance(40) && JSRL.player.confusionCounter === 0){
				JSRL.player.confuse();
				JSRL.ui.showMessage("The Umber Hulk gazes at you. You are confused!");
			}
		break;
		case "VAMPIRE":
			if (chance(30)){
				JSRL.player.reduceMaxHP();
				JSRL.ui.showMessage("The Vampire bits you... you feel fragile!");
			}
		break;
		case "WRAITH":
			if (chance(50)){
				JSRL.player.reduceMaxHP();
				JSRL.ui.showMessage("The Wraith mesmerizes you... you feel fragile!");
			}
		break;
	}
	if (!(this.monsterId === "FLOATING_EYE" 
		|| this.monsterId === "NYMPH"
		|| this.monsterId === "RUST_MONSTER"
			)){
		JSRL.player.damage(this.damageRoll.roll());
		if (this.isUnique){
			JSRL.ui.showMessage(this.name+" hits you.");
		} else {
			JSRL.ui.showMessage("The "+this.name+" hits you.");
		}
		if (JSRL.player.hasSkill("COUNTER")){
			if (chance(20)){
				JSRL.ui.showMessage("You counter attack.");
				JSRL.player.tryMoving(directionToEnemy);
			}
		}
	}
	
	if (JSRL.player.hp <= 0){
		mixpanel.track("Game Over", {"enemy": this.name, "depth": JSRL.dungeon.currentDepth, "score": JSRL.player.score});
		JSRL.player.hp = 0;
		if (this.name === "Rodney"){
			JSRL.ui.showMessage("Rodney says: Begone forever thief!. Press SPACE to continue");
		} else {
			JSRL.ui.showMessage("You are dead. Press SPACE to continue");
		}
		JSRL.player.dead = true;
		
		if (WS_HOST != "NEIN"){
			JSRL.websocket.playerDie();
			JSRL.websocket.saveScore();
		}
	}
};

Enemy.prototype.starePlayer = function(){
	var sightRange = this.sightRange ? this.sightRange : 5;
	if (distance(this.position.x, this.position.y, JSRL.player.position.x, JSRL.player.position.y) <= sightRange){
		var xDiff = sign(JSRL.player.position.x - this.position.x);
		var yDiff = sign(JSRL.player.position.y - this.position.y);
		return {x: xDiff, y: yDiff};
	} else {
		return "NONE";
	}
};

Enemy.prototype.getTheDescription = function(){
	if (this.isUnique){
		return this.name;
	} else {
		return "the "+this.name;
	}
};