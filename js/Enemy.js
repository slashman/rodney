function Enemy(name, hp, tileId, damageRoll){
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
		var distanceToPlayer = distance(this.position, JSRL.player.position);
		//Decide if will attack the player or walk to him
		if (this.rangedAttacks != null && chance(50)){
			//Will try to attack the player
			if (this.playerInRange()){
				//Try
				for (var i = 0; i < this.rangedAttacks.length; i++){
					var ra = rangedAttacks[i];
					if (distanceToPlayer <= ra.range)
						if (chance(ra.frequency)){
							this.fire(ra, directionToPlayer);
							return;
						}
				}
			}
		}
		// Couldnt attack the player, move to him
		var destinationPosition = {x: directionToPlayer.x + this.position.x, y: directionToPlayer.y + this.position.y};
		if (JSRL.dungeon.getMapTile(destinationPosition.x, destinationPosition.y).solid){
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
	JSRL.ui.showMessage("The "+this.name+" hits you.");
	JSRL.player.damage(this.damageRoll.roll());
	if (JSRL.player.hp <= 0){
		JSRL.player.hp = 0;
		JSRL.ui.showMessage("You are dead. Press SPACE to continue");
		JSRL.player.dead = true;
		
		if (WS_HOST != "NEIN")
			JSRL.websocket.saveScore();
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