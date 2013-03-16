function Enemy(monsterId, name, hp, tileId, damageRoll){
	this.monsterId = monsterId;
	this.name = name;
	this.hp = hp;
	this.tileId = tileId;
	this.damageRoll = damageRoll;
	this.aiType = "SIMPLE";
}

Enemy.prototype.enemyAI = function (){
	if (this.aiType === "NETWORK") return; 
	var directionToPlayer = this.starePlayer();
	if (directionToPlayer == "NONE"){
		//Wander aimlessly 
    	this.walk(randomDirection());
    	return;
	} else {
		var destinationPosition = {x: directionToPlayer.x + this.position.x, y: directionToPlayer.y + this.position.y};
		if (this.monsterId === "BAT" && chance(80)){
	    	this.walk(randomDirection());
		} else if (JSRL.dungeon.getMapTile(destinationPosition.x, destinationPosition.y).solid){
	    	this.walk(randomDirection());
		} else {
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
	if (this.isUnique){
		JSRL.ui.showMessage(this.name+" hits you.");
	} else {
		JSRL.ui.showMessage("The "+this.name+" hits you.");
	}
	if (JSRL.player.hasSkill("COUNTER")){
		if (chance(20)){
			JSRL.ui.showMessage("You counter attack.");
			var directionToEnemy = {
				x: this.position.x - JSRL.player.position.x,
				y: this.position.y - JSRL.player.position.y,
			};
			if (directionToEnemy.x > 1) directionToEnemy.x = 1;
			if (directionToEnemy.x < -1) directionToEnemy.x = -1;
			if (directionToEnemy.y > 1) directionToEnemy.y = 1;
			if (directionToEnemy.y < -1) directionToEnemy.y = -1;
			JSRL.player.tryMoving(directionToEnemy);
		}
	}
	if (this.monsterId === "GIANT_ANT"){
		if (chance(65)){
			JSRL.player.reduceStrength();
			JSRL.ui.showMessage("You feel weaker!");
		}
	}
	JSRL.player.damage(this.damageRoll.roll());
	if (JSRL.player.hp <= 0){
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