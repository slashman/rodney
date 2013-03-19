/*global JSRL, Rodney */

function Player(name) {
	this.name = name;
	this.hp = 100;
	this.maxhp = 100;
	this.strength = 5;
	this.sightRange = 4;
	this.kineticCharge=0;
	this.rageCounter=0;
	this.buildUpCounter = 0;
	this.paralysisCounter = 0;
	this.confusionCounter = 0;
	this.level = 0;
	this.carryCapacity = 10;
	this.dead = false;
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
	mixpanel.track("Add skill", {"skill": skill.name, "depth": JSRL.dungeon.currentDepth});
	JSRL.ui.showMessage('You learn '+skill.name);
	if (skill.skillId === "ENDURANCE"){
		this.maxhp += 50;
		this.hp += 50;
		if (this.hp > this.maxhp)
			this.hp = this.maxhp;
	} else if (skill.skillId === "DESTRUCTION"){
		this.strength += 5;
	} else if (skill.skillId === "DARK_SIGHT"){
		this.sightRange += 4;
	} else if (skill.skillId === "PACKER"){
		this.carryCapacity += 5;
	} 
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
	var w = 200;
	var h = 200;
	
	//var h = JSRL.ui.term.h;
	//var w = JSRL.ui.term.w;
	this.maskBuffer = new Array(w);
	for (var j = 0; j < w; ++j)
		this.maskBuffer[j] = new Array(h);
};

Player.prototype.remembers = function (	x, y){
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
	var attackMessage = "You hit "+enemy.getTheDescription();
	enemy.wasHit = true;
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
				attackMessage = "You push "+enemy.getTheDescription()+" back";
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
		attackMessage = "You corner "+enemy.getTheDescription();
	} else if (spinSlash){
		damage *= 2;
		attackMessage = "You spin slashing at "+enemy.getTheDescription();
	} else if (slashthru){
		attackMessage = "You slash "+enemy.getTheDescription();
	}
	if (kineticChargeTransferred){
		damage *= 2;
		attackMessage = "You charge against "+enemy.getTheDescription();
		this.kineticCharge = 0;
	} 
	JSRL.ui.showMessage(attackMessage);
	enemy.hp -= damage;
	
	var character = JSRL.tiles.getTile(enemy.tileId).getChar();
	var splashSize = 2;
	if (character === character.toLowerCase())
		splashSize = 1;
	JSRL.dungeon.splashBlood(sumPositions(enemy.position, attackDirection), splashSize);
	
	
	if (enemy.hp <= 0){
		mixpanel.track("Kill Enemy", {"enemy": enemy.name, "depth": JSRL.dungeon.currentDepth});
		this.score += enemy.scorePrize;
		if (enemy.name === "Rodney"){
			JSRL.ui.showMessage("Rodney falls to his knees: Aaaarrgh!!!");
			JSRL.dungeon.addItem(JSRL.itemFactory.createItem("YENDOR"), this.position);
			JSRL.dungeon.changeTile(enemy.position, '>');
			JSRL.ui.showRodneyScene();
		} else if (enemy.monsterId === "ARNOLD"){
			JSRL.ui.showMessage("How dare you, puny @ sign... How dare you!");
			this.deadArnold = true;
			this.checkEndgame();
		} else if (enemy.monsterId === "TOY"){
			JSRL.ui.showMessage("Never would I had thought, that my fate would be decided by one of my creations");
			this.deadToy = true;
			this.checkEndgame();
		} else if (enemy.monsterId === "LANE"){
			JSRL.ui.showMessage("Never underestimate the power of human will!");
			this.deadLane = true;
			this.checkEndgame();
		} else if (enemy.monsterId === "MANGO"){
			JSRL.ui.showMessage("Good job, little pal :)");
			this.deadMango = true;
			this.checkEndgame();
		} else {
			JSRL.ui.showMessage(enemy.getTheDescription()+ " dies");
		}
		JSRL.dungeon.removeEnemy(enemy);
	}
};

Player.prototype.updateFOV = function(){
	// Clear the mask buffer
	for (var j = 0; j < JSRL.dungeon.getHeight(); ++j)
		for (var i = 0; i < JSRL.dungeon.getWidth(); ++i)
			this.maskBuffer[i][j] = false;
	// Populate the mask buffer with fresh data
	var step = Math.PI * 2.0 / 1080;
	for (var a = 0; a < Math.PI * 2; a += step)
		this.shootRay(a);
};

Player.prototype.getSightRange = function(){
	return this.sightRange + (this.currentAccesory && this.currentAccesory.lightBonus ? this.currentAccesory.lightBonus : 0);
};

Player.prototype.shootRay = function (a) {
	var step = 0.3333;
	var maxdist = JSRL.ui.term.cy / step;
	maxdist = this.getSightRange() / step < maxdist ? this.getSightRange() / step : maxdist;
	var dx = Math.cos(a) * step;
	var dy = -Math.sin(a) * step;
	var xx = this.position.x, yy = this.position.y;
	for (var i = 0; i < maxdist; ++i) {
		var testx = Math.round(xx);
		var testy = Math.round(yy);
		// Mark the tile visible
		this.maskBuffer[testx][testy] = true;
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
	//return this.maskBuffer[y - this.maskOrigin.y][x - this.maskOrigin.x];
	return this.maskBuffer[x][y];
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
	} else {
		JSRL.dungeon.splashBlood(this.position, 1);
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
		if (item.isUnique){
			JSRL.ui.showMessage(item.name+" is here");
		} else {
			JSRL.ui.showMessage("There is a "+item.getFloorDescription()+" here");
		}
	}
};

Player.prototype.doAction = function(){
	//If we are on town, then go to the dungeon
	if (JSRL.websocket.onTown){
		JSRL.websocket.quit(false);
		JSRL.dungeon.generateLevel(1);
		JSRL.websocket.abandonTown();
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
		if (item.isUnique)
			JSRL.ui.showMessage("You pick up "+item.name);
		else
			JSRL.ui.showMessage("You pick up a "+item.name);
	} else {
		if (item.isUnique)
			JSRL.ui.showMessage("You can't pick up "+item.name);
		else
			JSRL.ui.showMessage("You can't pick up the "+item.name);
	}
};

Player.prototype.useItem = function (item){
	mixpanel.track("Use Item", {"item": item.name});
	if (item.type === 'WEAPON'){
		this.currentWeapon = item;
		JSRL.ui.showMessage("You wield the "+item.name);
	} else if (item.type === 'ARMOR'){
		this.currentArmor = item;
		JSRL.ui.showMessage("You wear the "+item.name);
	} else if (item.type === 'ACCESORY'){
		this.currentAccesory = item;
		if (item.isUnique)
			JSRL.ui.showMessage("You wear "+item.name);
		else
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
		if (item.isUnique)
			JSRL.ui.showMessage("You can't drop "+item.name+" here");
		else
			JSRL.ui.showMessage("You can't drop the "+item.name+" here");
	} else {
		this.inventory.removeObject(item);
		if (item === this.currentWeapon)
			this.currentWeapon = false;
		if (item === this.currentArmor)
			this.currentArmor = false;
		if (item === this.currentAccesory)
			this.currentAccesory = false;
		JSRL.dungeon.addItem(item, this.position);
	}
	
};

Player.prototype.standFast = function(){
	this.kineticCharge = 0;
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
			JSRL.ui.showMessage("You jump into "+enemy.getTheDescription());
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
	} else 	if (JSRL.dungeon.getMapTile(x, y) == null || JSRL.dungeon.getMapTile(x, y).solid){
		this.rageCounter = 0;
		if (this.hasSkill("BACKFLIP") && this.isRunning(movedir)){
			var landingPosition = {x: movedir.x * -3 + this.position.x, y: movedir.y * -3 + this.position.y};
			var xenemy = JSRL.dungeon.getEnemy(landingPosition.x, landingPosition.y);
			var xtile = JSRL.dungeon.getMapTile(landingPosition.x, landingPosition.y);
			if (!xenemy && !xtile.solid){
				JSRL.ui.showMessage("You backflip!");
				this.kineticCharge = 0;
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
				if (!xenemy && xtile && !xtile.solid){
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
		var addBlood = JSRL.dungeon.hasBlood(this.position) && chance(30);
		this.position.x = x;
		this.position.y = y;
		this.landOn(x, y);
		if (addBlood)
			JSRL.dungeon.addBlood(this.position);
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

Player.prototype.newTurn = function(){
	if (this.currentAccesory && this.currentAccesory.isLightSource){
		this.currentAccesory.spend();
	}
	if (this.paralysisCounter > 0)
		this.paralysisCounter--;
	if (this.confusionCounter > 0)
		this.confusionCounter--;
};

Player.prototype.reduceStrength = function(){
	if (this.strength > 1)
		this.strength--;
};

Player.prototype.paralize = function(){
	this.paralysisCounter = rand(3,6);
};

Player.prototype.confuse = function(){
	this.confusionCounter = rand(15,20);
};

Player.prototype.reduceMaxHP = function(){
	this.maxhp -= rand(3, 5);
	if (this.hp > this.maxhp)
		this.hp = this.maxhp;
};

Player.prototype.recoverHP = function(hp){
	this.hp += hp;
	if (this.hp > this.maxhp)
		this.hp = this.maxhp;
};

Player.prototype.checkEndgame = function(){
	if (this.deadArnold && this.deadToy && this.deadLane &&this.deadMango){
		mixpanel.track("Win Game", {"depth": JSRL.dungeon.currentDepth});
		JSRL.ui.endGame();
	}	
};