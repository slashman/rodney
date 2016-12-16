function Enemy(monsterId, name, hp, tileId, damageRoll, doubleSpeed, isRanged){
	this.monsterId = monsterId;
	this.name = name;
	this.hp = hp;
	this.maxhp = hp;
	this.scorePrize = hp;
	this.tileId = tileId;
	this.damageRoll = damageRoll;
	this.aiType = "SIMPLE";
	this.wasHit = false;
	this.doubleSpeed = doubleSpeed;
	this.isRanged = isRanged;
}

Enemy.prototype.enemyAI = function (){
	if (this.aiType === "NETWORK") return; 
	if (this.monsterId === "MIMIC" && !this.wasHit)
		return false;
	if (this.monsterId === "TROLL" && chance(50)){
		if (this.hp < this.maxhp){
			JSRL.ui.showMessage("The "+this.getDescription()+" regenerates");
			this.hp++;
		}
	}
	if (this.monsterId === "VAMPIRE" && chance(80)){
		if (this.hp < this.maxhp){
			JSRL.ui.showMessage("The "+this.getDescription()+" regenerates");
			this.hp++;
		}
	}
	
	var directionToPlayer = this.starePlayer();
	var seeing = JSRL.player.isSeeing(this.position.x, this.position.y);

	if (directionToPlayer == "NONE" ||
			( this.monsterId === "BAT" && chance(80) ) ||
			( this.monsterId === "FLOATING_EYE" && chance(20) ) ||
			( this.monsterId === "INVISIBLE_STALKER" && chance(50) )
		){
		//Wander aimlessly 
    	this.walk(randomDirection());
    	return false
	} else if (this.isRanged && chance(50) && seeing){
		JSRL.ui.launchEnemyProjectile(this, directionToPlayer);
		return true;
	} else {
		var destinationPosition = {x: directionToPlayer.x + this.position.x, y: directionToPlayer.y + this.position.y};
		if (JSRL.dungeon.getMapTile(destinationPosition.x, destinationPosition.y).solid || JSRL.dungeon.getEnemy(destinationPosition.x, destinationPosition.y)){ // There's another monster or a mapcell blocking us
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
		return false;
	}
};

function randomDirection(){
	return {x: rand(-1,1), y: rand(-1,1)};
}

Enemy.prototype.walk = function (direction){
	var destinationPosition = {x: direction.x + this.position.x, y: direction.y + this.position.y};
	JSRL.dungeon.tryMoveEnemyTo(this, destinationPosition);
};

Enemy.prototype.getDescription = function (){
	return this.name;
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
			if (chance(10)){
				JSRL.ui.showMessage("The "+this.getDescription()+" poisons you. You feel weaker!");
				JSRL.player.reduceStrength();
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
				JSRL.ui.showMessage("The "+this.getDescription()+" hypnotizes you with his gaze!");
				JSRL.player.paralize();
			}
		break;
		case "VIOLET_FUNGI":
			if (chance(20) && JSRL.player.paralysisCounter === 0){
				JSRL.ui.showMessage("The "+this.getDescription()+" engulfs you!");
				JSRL.player.paralize();
			}
		break;
		case "NYMPH":
			if (chance(65)){
				if(JSRL.player.inventory.length === 0){
					JSRL.ui.showMessage("The "+this.getDescription()+" steals a kiss from you!");
				} else {
					var item = randomElementOf(JSRL.player.inventory);
					JSRL.ui.showMessage("The "+this.getDescription()+" steals a "+item.name+" from you!");
					if (item === JSRL.player.currentWeapon)
						JSRL.player.currentWeapon = false;
					if (item === JSRL.player.currentArmor)
						JSRL.player.currentArmor = false;
					if (item === JSRL.player.currentAccesory)
						JSRL.player.currentAccesory = false;
					JSRL.player.inventory.removeObject(item);
				}
				if (chance(80)){
					JSRL.ui.showMessage("The "+this.getDescription()+" vanishes");
					JSRL.dungeon.removeEnemy(this);
					return;
				}
			}
		break;
		case "RUST_MONSTER":
			if (JSRL.player.currentArmor && chance(65) && JSRL.player.currentArmor.itemId != "LEATHER"){
				JSRL.ui.showMessage("The "+this.getDescription()+" squirts acid at your "+JSRL.player.currentArmor.name);
				JSRL.player.currentArmor.clash(40);
			} else {
				JSRL.ui.showMessage("The "+this.getDescription()+" licks you");
			} 
		break;
		case "UMBER_HULK":
			if (chance(40) && JSRL.player.confusionCounter === 0){
				JSRL.ui.showMessage("The "+this.getDescription()+" gazes at you. You are confused!");
				JSRL.player.confuse();
			}
		break;
		case "VAMPIRE":
			if (chance(30)){
				JSRL.ui.showMessage("The "+this.getDescription()+" bites you... you feel fragile!");
				JSRL.player.reduceMaxHP();
			}
		break;
		case "WRAITH":
			if (chance(50)){
				JSRL.ui.showMessage("The "+this.getDescription()+" mesmerizes you... you feel fragile!");
				JSRL.player.reduceMaxHP();
			}
		break;
	}
	if (!(this.monsterId === "FLOATING_EYE" 
		|| this.monsterId === "NYMPH"
		|| this.monsterId === "RUST_MONSTER"
			)){
		if (this.isUnique){
			JSRL.ui.showMessage(this.name+" hits you.");
		} else {
			JSRL.ui.showMessage("The "+this.name+" hits you.");
		}
		JSRL.ui.graph.addGraphicEffect("HIT",JSRL.player.position.x,JSRL.player.position.y);
		JSRL.sounds.getSound("SND_SWORD").copyPlay();
		var damage = this.damageRoll.roll();
		if (JSRL.player.hasSkill("PARRY")){
			if (this == JSRL.player.currentTarget){
				JSRL.ui.showMessage("You parry the attack.");
				damage /= 2;
			}
		}
		JSRL.player.damage(damage);
		if (JSRL.player.hasSkill("COUNTER")){
			if (chance(20)){
				JSRL.ui.showMessage("You counter attack.");
				JSRL.player.tryMoving(directionToEnemy);
			}
		} else if(JSRL.player.hasSkill("RIPOSTE")){
			if (JSRL.player.buildUpCounter > 0){
				JSRL.ui.showMessage("You riposte!");
				JSRL.player.attackEnemy(this, false, false, false, directionToEnemy, 4, 1);
			}
		}
	}
	
	if (JSRL.player.hp <= 0){
		if (Rodney.mixPanelEnabled)
			mixpanel.track("Game Over", {"enemy": this.name, "depth": JSRL.dungeon.currentDepth, "score": JSRL.player.score});
		JSRL.player.hp = 0;
		if (this.name === "Rodney"){
			JSRL.ui.showMessage("Rodney says: Begone forever thief!. Press Enter to continue");
		} else {
			JSRL.ui.showMessage("You are dead. Press Enter to continue");
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
	var referencePosition = JSRL.player.position;
	if (!JSRL.player.isSeeing(this.position.x, this.position.y)){
		if (this.lastKnownPlayerPosition)
			referencePosition = this.lastKnownPlayerPosition;
	} else {
		if (!this.lastKnownPlayerPosition)
			this.lastKnownPlayerPosition = {};
		this.lastKnownPlayerPosition.x = JSRL.player.position.x;
		this.lastKnownPlayerPosition.y = JSRL.player.position.y;
	}
	if (distance(this.position.x, this.position.y, referencePosition.x, referencePosition.y) <= sightRange){
		var xDiff = sign(referencePosition.x - this.position.x);
		var yDiff = sign(referencePosition.y - this.position.y);
		return {x: xDiff, y: yDiff};
	} else {
		return "NONE";
	}
};

Enemy.prototype.getTheDescription = function(ucase){
	if (this.isUnique){
		return this.name;
	} else {
		if (ucase)
			return "The "+this.name;
		else
			return "the "+this.name;
	}
};