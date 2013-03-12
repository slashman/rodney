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
}

Player.prototype.addSkill = function(skill){
	JSRL.ui.showMessage('You learn '+skill.name);
	JSRL.ui.showLearnedSkill(skill);
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
	for (var i = 0; i < Skills.skills.length; i++){
		var skill = Skills.skills[i];
		if (this.hasSkill(skill.skillId)){
			//Already knows the skill
			continue;
		}
		if (skill.requirements){
			for (var j = 0; j < skill.requirements.length; j++){
				if (!this.skills.contains(skill.requirements[j])){
					// Doesnt know Obama
					continue;
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

Player.prototype.attackEnemy = function(enemy, kineticChargeTransferred, cornered, spinSlash){
	var damage = this.strength;
	if (this.currentWeapon){
		damage += this.currentWeapon.damageRoll.roll();
		this.currentWeapon.clash(damage);
	}
	var attackMessage = "You hit the "+enemy.name;
	if (cornered){
		damage *= 2;
		attackMessage = "You corner the "+enemy.name;
	} else if (spinSlash){
		damage *= 2;
		attackMessage = "You spin slashing at the "+enemy.name;
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
	this.kineticCharge = 0;
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

Player.prototype.tryMoving = function (movedir){
	var moved = false;
	var x = this.position.x + movedir.x;
	var y = this.position.y + movedir.y;
	
	var enemy = JSRL.dungeon.getEnemy(x, y);
	if (enemy){
		var kineticChargeTransferred = false;
		// Verify if kineticCharge is transferred #CHARGE
		if (this.hasSkill("CHARGE"))
			kineticChargeTransferred = this.kineticCharge > 1 && sameGeneralDirection(movedir, this.lastMovedir);
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
		this.attackEnemy(enemy, kineticChargeTransferred, cornered, spinSlash);
		this.lastAttackDir = movedir;
		moved = false;
	} else 	if (JSRL.dungeon.getMapTile(x, y).solid){
		// Bump!
		moved = false;
	} else {
		// Check if slashing through 
		this.position.x = x;
		this.position.y = y;
		this.landOn(x, y);
		moved = true;
	}
	// Check for kineticCharge #CHARGE
	if (this.hasSkill("CHARGE") && moved){
		if (this.lastMovedir && sameGeneralDirection(movedir, this.lastMovedir)){
			this.kineticCharge++;
		} else {
			this.kineticCharge=0;
		}
		this.lastMovedir = movedir;
	} else {
		this.kineticCharge=0;
	}
};

function sameGeneralDirection(direction1, direction2){
	 return  (direction1.x == direction2.x && Math.abs(direction1.y - direction2.y) < 2) || 
     (direction1.y == direction2.y && Math.abs(direction1.x - direction2.x) < 2);
}

function oppositeDirection(direction1, direction2){
	return direction1.x * -1 === direction2.x && direction1.y * -1 === direction2.y;  
}