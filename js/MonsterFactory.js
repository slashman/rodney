function MonsterFactory(){
	this.monsterDefinitions = {};
	this.levelMaps = {};
	this.addMonsterDefinition("GUARD", "Guard", new Roll(2,4,0), 1, 5, new Roll(2,2,1), false, true);
	this.addMonsterDefinition("ELITE_GUARD", "Elite Guard", new Roll(4,4,0), 1, 10, new Roll(2,4,1), false, true);
	this.addMonsterDefinition("WHITE_TROOPER", "Stormtrooper", new Roll(6,4,0), 3, 15, new Roll(3,2,1), false, true);
	this.addMonsterDefinition("BLACK_TROOPER", "Black Trooper", new Roll(8,4,1), 6, 20, new Roll(4,2,1), false, true);
	this.addMonsterDefinition("ELITE_TROOPER", "Elite Trooper", new Roll(10,4,0), 15, 25, new Roll(6,2,1), false, true);
	this.addMonsterDefinition("IMPERIAL_ROBOT_1", "Imperial Robot", new Roll(4,8,0), 10, 20, new Roll(2,8,2), false, false);
	this.addMonsterDefinition("IMPERIAL_ROBOT_2", "Defender", new Roll(8,8,0), 15, 25, new Roll(3,8,2), false, false);
	this.addMonsterDefinition("IMPERIAL_ROBOT_3", "Destroyer", new Roll(10,8,0), 20, 25, new Roll(4,8,2), false, false);
}

MonsterFactory.prototype.addMonsterDefinition = function (monsterId, name, hp, minLevel, maxLevel, damageRoll, doubleSpeed, isRanged){
	this.monsterDefinitions[monsterId] = {
		monsterId: monsterId,
		tileId: monsterId,
		name: name,
		hpRoll: hp,
		damageRoll: damageRoll,
		doubleSpeed: doubleSpeed,
		isRanged: isRanged
	};
	for (var i = minLevel; i <= maxLevel; i++){
		if (!this.levelMaps[i]){
			this.levelMaps[i] = new Array();
		}
		this.levelMaps[i].push(monsterId);
	}
};

MonsterFactory.prototype.getEcosystem = function(depth){
	return this.levelMaps[depth];
};

MonsterFactory.prototype.createMonster = function(monsterId){
	var definition = this.monsterDefinitions[monsterId];
	var hp = definition.hpRoll.roll();
	return new Enemy(
		monsterId,
		definition.name,
		hp,
		definition.tileId,
		definition.damageRoll,
		definition.doubleSpeed,
		definition.isRanged
	);
};

