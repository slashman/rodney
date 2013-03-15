/*global JSRL, Rodney */

function Player(name) {
	this.name = name;
	this.hp = 200;
	this.strength = 1;
	this.kineticCharge=0;
	this.level = 0;
	this.carryCapacity = 10;
	this.resetMemoryMap();
	this.dead = false;
	this.resetFOVMasks();
	this.skills = new Array();
	this.inventory = new Array();
	this.currentWeapon;
	this.currentArmor;
	this.currentAccesory;
	this.sessionInfo = "";
	this.skillPath = "";
	this.score = 0;
}

Player.prototype.addSkill = function(skill){
	JSRL.ui.showMessage('You learn '+skill.name);
	this.skills.push(skill.skillId);
};

Player.prototype.resetMemoryMap = function(){
	this.memoryMap = new Array();
};

Player.prototype.hasSkill = function (skillId){
	return this.skills.contains(skillId);
};

Player.prototype.getLearnableSkills = function(){
	var ret = new Array();
	nextSkill: for (var i = 0; i < Skills.skills.length; i++){
		var skill = Skills.skills[i];
		if (this.hasSkill(skill.skillId)){
			//Already knows the skill
			continue;
		}
		if (skill.requirements){
			for (var j = 0; j < skill.requirements.length; j++){
				if (!this.hasSkill(skill.requirements[j])){
					// Doesnt know Obama
					continue nextSkill;
				}
			}
		}
		ret.push(skill);
	}
	return ret;
};

Player.prototype.resetFOVMasks = function(){
	// Init FOV masks
	this.maskBuffer = new Array(JSRL.ui.term.h);
	for (var j = 0; j < JSRL.ui.term.h; ++j)
		this.maskBuffer[j] = new Array(JSRL.ui.term.w);
	this.maskOrigin = { x: 0, y: 0 };
};

Player.prototype.remembers = function (x, y){
	if (!this.memoryMap[x])
		return false;
	return this.memoryMap[x][y];
};

Player.prototype.remember = function (x,y){
	if (!this.memoryMap[x])
		this.memoryMap[x] = new Array();
	this.memoryMap[x][y] = true;
};

Player.prototype.attackEnemy = function(enemy, kineticChargeTransferred, cornered, spinSlash, slashthru, attackDirection){
	if (enemy.aiType === "NETWORK"){
		JSRL.ui.showMessage("You bump into "+enemy.name);
		return;
	}
	var rageBonus = 0;
	if (this.hasSkill("RAGE")){
		this.rageCounter++;
		if (this.rageCounter > 5 && chance(30))
			JSRL.ui.showMessage("You are furious!");
		if (this.rageCounter > 3){
			rageBonus = Math.round(this.rageCounter / 2);
		}
	}
	var attackMessage = "You hit the "+enemy.name;

	var buildupBonus = 0;
	if (this.hasSkill("BUILDUP")){
		if (this.buildUpCounter > 0)
			buildupBonus = Math.round(this.buildUpCounter);
		if (buildupBonus > 4)
			buildupBonus = 4;
	}
	
	if (this.hasSkill("BASH") && !cornered){
		if (chance(20)){
			//Check if there's an enemy behind
			var destinationPosition = {x: enemy.position.x + attackDirection.x * 2, y:enemy.position.y + attackDirection.y * 2};
			var anotherEnemy = JSRL.dungeon.getEnemy(destinationPosition.x, destinationPosition.y);
			if (!anotherEnemy){
				JSRL.dungeon.tryMoveEnemyTo(enemy, destinationPosition);
				attackMessage = "You push the "+enemy.name+" back";
			}
		}
	}
	
	var damage = this.strength;
	damage += rageBonus;
	damage += buildupBonus;
	
	if (this.currentWeapon){
		damage += this.currentWeapon.damageRoll.roll();
		this.currentWeapon.clash(damage);
	}
	
	if (cornered){
		damage *= 2;
		attackMessage = "You corner the "+enemy.name;
	} else if (spinSlash){
		damage *= 2;
		attackMessage = "You spin slashing at the "+enemy.name;
	} else if (slashthru){
		attackMessage = "You slash the "+enemy.name;
	}
	if (kineticChargeTransferred){
		damage *= 2;
		attackMessage = "You charge against the "+enemy.name;
		this.kineticCharge = 0;
	} 
	JSRL.ui.showMessage(attackMessage);
	enemy.hp -= damage;
	
	if (enemy.hp <= 0){
		JSRL.ui.showMessage("The "+enemy.name+ " dies");
		JSRL.dungeon.removeEnemy(enemy);
	}
};

Player.prototype.updateFOV = function(){
	// Clear the mask buffer
	for (var j = 0; j < JSRL.ui.term.h; ++j)
		for (var i = 0; i < JSRL.ui.term.w; ++i)
			this.maskBuffer[j][i] = false;
	// Update buffer info
	this.maskOrigin.x = this.position.x - JSRL.ui.term.cx;
	this.maskOrigin.y = this.position.y - JSRL.ui.term.cy;
	// Populate the mask buffer with fresh data
	var step = Math.PI * 2.0 / 1080;
	for (var a = 0; a < Math.PI * 2; a += step)
		this.shootRay(a);
};

Player.prototype.shootRay = function (a) {
	var step = 0.3333;
	var maxdist = JSRL.ui.term.cy / step;
	var dx = Math.cos(a) * step;
	var dy = -Math.sin(a) * step;
	var xx = this.position.x, yy = this.position.y;
	for (var i = 0; i < maxdist; ++i) {
		var testx = Math.round(xx);
		var testy = Math.round(yy);
		// Mark the tile visible
		this.maskBuffer[testy - this.maskOrigin.y][testx - this.maskOrigin.x] = true;
		this.remember(testx, testy);
		// If wall is encountered, terminate ray
		try { 
			//if (JSRL.ui.eng.tileFunc(testx, testy).getChar() !== ".")
			if (JSRL.dungeon.getMapTile(testx, testy).opaque)
				return;
		} catch(err) {
			return; 
		}
		// Advance the beam according to the step variables
		xx += dx; yy += dy;
	}
};

Player.prototype.isSeeing = function (x,y){
	return this.maskBuffer[y - this.maskOrigin.y][x - this.maskOrigin.x];
};

Player.prototype.damage = function(damage){
	if (this.currentArmor){
		this.currentArmor.clash(damage);
		damage -= this.currentArmor.protectionValue;
	}
	if (damage < 0)
		damage = 0;
	if (damage === 0){
		JSRL.ui.showMessage("You shrug off the attack");
	}
	this.hp -= damage;
};

Player.prototype.landOn = function (x, y){
	var tile = JSRL.dungeon.getMapTile(x, y);
	if (tile.downstairs){
		JSRL.ui.showMessage("There is a stairway going down here");
	}
	var item = JSRL.dungeon.getItem(x, y);
	if (item){
		JSRL.ui.showMessage("There is a "+item.name+" here");
	}
};

Player.prototype.doAction = function(){
	//If we are on town, then go to the dungeon
	if (JSRL.websocket.onTown){
		JSRL.websocket.quit();
		JSRL.dungeon.generateLevel(1);
		JSRL.player.resetFOVMasks();
		JSRL.player.resetMemoryMap();
		return;
	}
	this.kineticCharge = 0;
	this.rageCounter = 0;
	var tile = JSRL.dungeon.getMapTile(this.position.x, this.position.y);
	if (tile.downstairs){
		JSRL.dungeon.downstairs();
		return;
	}
	var item = JSRL.dungeon.getItem(this.position.x, this.position.y);
	if (item){
		this.tryPick(item);
		return;
	}
	if (JSRL.player.inventory.length === 0){
		JSRL.ui.showMessage('Nothing to do here..');
	} else {
		JSRL.ui.activateItemSelection();
	}
};

Player.prototype.tryPick = function (item){
	if (this.inventory.length < this.carryCapacity-1){
		this.inventory.push(item);
		JSRL.dungeon.removeItem(item);
		JSRL.ui.showMessage("You pick up a "+item.name);
	} else {
		JSRL.ui.showMessage("You can't pick up the "+item.name);
	}
};

Player.prototype.useItem = function (item){
	if (item.type === 'WEAPON'){
		this.currentWeapon = item;
		JSRL.ui.showMessage("You wield the "+item.name);
	} else if (item.type === 'ARMOR'){
		this.currentArmor = item;
		JSRL.ui.showMessage("You wear the "+item.name);
	} else if (item.type === 'ACCESORY'){
		this.currentAccesory = item;
		JSRL.ui.showMessage("You wear the "+item.name);
	} else if (item.use){
		item.use();
	} else {
		JSRL.ui.showMessage("You find no use for the "+item.name);
	}
};

Player.prototype.dropItem = function (item){
	var itemOnDungeon = JSRL.dungeon.getItem(this.position.x, this.position.y);
	if (itemOnDungeon){
		JSRL.ui.showMessage("You can't drop the "+item.name+" here");
	} else {
		this.inventory.removeObject(item);
		JSRL.dungeon.addItem(item, this.position);
	}
	
};

Player.prototype.standFast = function(){
	if (this.hasSkill("BUILDUP")){
		this.buildUpCounter++;
		JSRL.ui.showMessage("You stand fast building up!");
	} else {
		JSRL.ui.showMessage("You stand alert");
	}
};

Player.prototype.tryMoving = function (movedir){
	var moved = false;
	var x = this.position.x + movedir.x;
	var y = this.position.y + movedir.y;
	
	var enemy = JSRL.dungeon.getEnemy(x, y);

	//Check for enemies in jump range #ASSAULT
	if (!enemy && this.hasSkill("ASSAULT") && this.isRunning(movedir) ){
		var xx = x + movedir.x;
		var yy = y + movedir.y;
		var xenemy = JSRL.dungeon.getEnemy(xx, yy);
		if (xenemy){
			enemy = xenemy;
			JSRL.ui.showMessage("You jump into the "+enemy.name);
		}
		this.position.x = x;
		this.position.y = y;
		this.landOn(x, y);
		moved = true;
	}
	if (enemy){
		var kineticChargeTransferred = false;
		// Verify if kineticCharge is transferred #CHARGE
		if (this.hasSkill("CHARGE"))
			kineticChargeTransferred = this.isRunning(movedir);
		// Check if there's a solid cell behind the enemy #CORNER
		var cornered = false;
		if (this.hasSkill("CORNER")){
			var behindCell = JSRL.dungeon.getMapTile(x+movedir.x, y+movedir.y);
			cornered = behindCell && behindCell.solid;
		}
		// Check if spinslashing #SPIN
		var spinSlash = false;
		if (this.hasSkill("SPIN")){
			spinSlash = this.lastAttackDir && oppositeDirection(movedir, this.lastAttackDir);
		}
		// Bump into enemy!
		this.attackEnemy(enemy, kineticChargeTransferred, cornered, spinSlash, false, movedir);
		
		if (this.hasSkill("SWEEP")){
			//Check for the other enemies
			var landingPosition1;
			var landingPosition2;

			if (movedir.x === 0){
				landingPosition1 = {x: x - 1, y: y};
				landingPosition2 = {x: x + 1, y: y};
			} else if (movedir.y === 0){
				landingPosition1 = {x: x, y: y - 1};
				landingPosition2 = {x: x, y: y + 1};
			} else {
				//  x+
				//  +@
				landingPosition1 = {x: x - movedir.x, y: y};
				landingPosition2 = {x: x, y: y - movedir.y};
			}
			console.log(x+","+y);
			console.log(landingPosition1);
			console.log(landingPosition2);
			var xenemy = JSRL.dungeon.getEnemy(landingPosition1.x, landingPosition1.y);
			if (xenemy){
				this.attackEnemy(xenemy, false, false, false, false, movedir);
			}
			xenemy = JSRL.dungeon.getEnemy(landingPosition2.x, landingPosition2.y);
			if (xenemy){
				this.attackEnemy(xenemy, false, false, false, false, movedir);
			}

		}
		
		this.lastAttackDir = movedir;
		this.buildUpCounter = 0;
		moved = false;
	} else 	if (JSRL.dungeon.getMapTile(x, y).solid){
		this.rageCounter = 0;
		if (this.hasSkill("BACKFLIP") && this.isRunning(movedir)){
			var landingPosition = {x: movedir.x * -3 + this.position.x, y: movedir.y * -3 + this.position.y};
			var xenemy = JSRL.dungeon.getEnemy(landingPosition.x, landingPosition.y);
			var xtile = JSRL.dungeon.getMapTile(landingPosition.x, landingPosition.y);
			if (!xenemy && !xtile.solid){
				JSRL.ui.showMessage("You backflip!");
				this.position.x = landingPosition.x;
				this.position.y = landingPosition.y;
				this.landOn(landingPosition.x, landingPosition.y);
				moved = true;
			} else {
				// Bump!
				moved = false;
			}
		} else if (this.hasSkill("WALLJUMP")){
			if (movedir.x === 0 || movedir.y === 0){
				moved = false;
			} else {
				var landingPosition1 = {x: movedir.x * -1 + x, y: movedir.y + y};
				var xenemy = JSRL.dungeon.getEnemy(landingPosition1.x, landingPosition1.y);
				var xtile = JSRL.dungeon.getMapTile(landingPosition1.x, landingPosition1.y);
				if (!xenemy && !xtile.solid){
					JSRL.ui.showMessage("You jump on the wall!");
					this.position.x = landingPosition1.x;
					this.position.y = landingPosition1.y;
					this.landOn(landingPosition1.x, landingPosition1.y);
					moved = true;
				} else {
					var landingPosition2 = {x: movedir.x + x, y: movedir.y * -1 + y};
					xenemy = JSRL.dungeon.getEnemy(landingPosition2.x, landingPosition2.y);
					xtile = JSRL.dungeon.getMapTile(landingPosition2.x, landingPosition2.y);
					if (!xenemy && !xtile.solid){
						JSRL.ui.showMessage("You jump on the wall!");
						this.position.x = landingPosition2.x;
						this.position.y = landingPosition2.y;
						this.landOn(landingPosition2.x, landingPosition2.y);
						moved = true;
					} else {
						moved = false;
					}
				}
			}
		} else {
			// Bump!
			moved = false;
		}
	} else {
		this.rageCounter = 0;
		// Check if slashing through #SLASH #BACKSLASH
		if (this.hasSkill("SLASH") || this.hasSkill("BACKSLASH")){
			this.trySlash(movedir);
		}
		this.position.x = x;
		this.position.y = y;
		this.landOn(x, y);
		moved = true;
	}
	// Check for kineticCharge #CHARGE
	if (moved){
		if (this.lastMovedir && sameGeneralDirection(movedir, this.lastMovedir)){
			this.kineticCharge++;
		} else {
			this.kineticCharge=0;
		}
		this.lastMovedir = movedir;
		this.buildUpCounter = 0;
	} else {
		this.kineticCharge=0;
	}
	
	if (moved && JSRL.websocket.onTown)
		JSRL.websocket.sendPlayerInfo();
};

var directionCycle = [
                      {x: 1, y: 0},
                      {x: 1, y: -1},
                      {x: 0, y: -1},
                      {x: -1, y: -1},
                      {x: -1, y: 0},
                      {x: -1, y: 1},
                      {x: 0, y: 1},
                      {x: 1, y: 1}
                      ];

Player.prototype.trySlash = function(movedir){
	if (movedir.x === 0 && movedir.y === 0)
		return;
	var once = !this.hasSkill("BACKSLASH");
	var index = 0;
	while (true){
		if (directionCycle[index].x === movedir.x && directionCycle[index].y === movedir.y){
			break;
		}
		index++;
	}
	var index1 = index - 1;
	if (index1 === -1)
		index1 = directionCycle.length - 1;
	var index2 = index + 1;
	if (index2 === directionCycle.length)
		index2 = 0;
	var m1= JSRL.dungeon.getEnemy(this.position.x + directionCycle[index1].x, this.position.y + directionCycle[index1].y);
	var m2= JSRL.dungeon.getEnemy(this.position.x + directionCycle[index2].x, this.position.y + directionCycle[index2].y);
	if (m1){
		this.attackEnemy(m1, false, false, false, true, directionCycle[index1]);
	} 
	if (!m1 || !once){
		if (m2)
			this.attackEnemy(m2, false, false, false, true, directionCycle[index2]);
	}
};

function sameGeneralDirection(direction1, direction2){
	 return  (direction1.x == direction2.x && Math.abs(direction1.y - direction2.y) < 2) || 
     (direction1.y == direction2.y && Math.abs(direction1.x - direction2.x) < 2);
}

function oppositeDirection(direction1, direction2){
	return direction1.x * -1 === direction2.x && direction1.y * -1 === direction2.y;  
}

Player.prototype.isRunning = function(movedir){
	return this.kineticCharge > 1 && sameGeneralDirection(movedir, this.lastMovedir);
};