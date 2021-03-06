function MonsterFactory(){
	this.monsterDefinitions = {};
	this.levelMaps = {};
	this.addMonsterDefinition("GIANT_ANT", "Poisonous Mass", new Roll(2,4,0), 3,12, new Roll(1,6,1), false);
	this.addMonsterDefinition("BAT", "Bat", new Roll(1,8,1), 1, 8, new Roll(1,2,0), false);
	this.addMonsterDefinition("CENTAUR", "Beast", new Roll(4,8,0), 8, 17, new Roll(2,8,2), false);
	this.addMonsterDefinition("DRAGON", "Demon", new Roll(10,8,0), 22, 50, new Roll(4,10,5), false);
	this.addMonsterDefinition("FLOATING_EYE", "Floating Skull", new Roll(1,8,0), 2, 11, new Roll(0,0,0), false);
	this.addMonsterDefinition("VIOLET_FUNGI", "Deadly Flower", new Roll(6,8,0), 15, 24, new Roll(1,6,0), false);
	this.addMonsterDefinition("GNOME", "Gnome", new Roll(1,4,0), 6, 15, new Roll(1,6,1), true);
	this.addMonsterDefinition("HOBGOBLIN", "Hobgoblin", new Roll(2,4,3), 1, 10, new Roll(1,8,2), false);
	this.addMonsterDefinition("INVISIBLE_STALKER", "Invisible Stalker", new Roll(3,8,0), 16, 25, new Roll(2,4,0), false);
	this.addMonsterDefinition("JACKAL", "Jackal", new Roll(1,8,4), 1, 7, new Roll(1,2,0), false);
	this.addMonsterDefinition("KOBOLD", "Lizardman", new Roll(2,4,2), 1, 6, new Roll(1,4,0), false);
	this.addMonsterDefinition("LEPRECHAUN", "Leprechaun", new Roll(3,8,0), 7, 16, new Roll(1,1,0), false);
	this.addMonsterDefinition("MIMIC", "Mimic", new Roll(7,8,0), 19, 50, new Roll(3,4,0), false);
	this.addMonsterDefinition("NYMPH", "Nymph", new Roll(3,4,0), 11, 20, new Roll(0,0,0), false);
	this.addMonsterDefinition("ORC", "Orc", new Roll(2,6,4), 4, 13, new Roll(1,8,1), false);
	this.addMonsterDefinition("GOLEM", "Golem", new Roll(10,6,4), 4, 13, new Roll(1,3,0), false);
	this.addMonsterDefinition("PURPLE_WORM", "Purple Worm", new Roll(15,8,0), 21, 50, new Roll(2,12,4), false);
	this.addMonsterDefinition("QUASIT", "Quasit", new Roll(3,4,0), 10, 19, new Roll(2,4,0), true);
	this.addMonsterDefinition("RUST_MONSTER", "Rust Monster", new Roll(5,8,0), 9, 18, new Roll(0,0,0), false);
	this.addMonsterDefinition("SNAKE", "Snake", new Roll(1,8,2), 1, 9, new Roll(1,3,0), true);
	this.addMonsterDefinition("TROLL", "Giant Wolf", new Roll(6,8,0), 13, 22, new Roll(2,8,3), false);
	this.addMonsterDefinition("UMBER_HULK", "Umber Hulk", new Roll(8,6,0), 18, 50, new Roll(6,4,3), false);
	this.addMonsterDefinition("VAMPIRE", "Witch", new Roll(8,6,0), 20, 50, new Roll(1,10,0), false);
	this.addMonsterDefinition("WRAITH", "Wraith", new Roll(5,6,0), 14, 23, new Roll(1,6,0), false);
	this.addMonsterDefinition("XORN", "Xorn", new Roll(7,8,0), 17, 26, new Roll(4,3,6), false);
	this.addMonsterDefinition("YETI", "Minotaur", new Roll(4,8,0), 12, 21, new Roll(2,6,0), false);
	this.addMonsterDefinition("ZOMBIE", "Zombie", new Roll(2,8,2), 5, 14, new Roll(1,8,0), false);
	
	this.addMonsterDefinition("RODNEY", "Rodney", new Roll(60,3,0), -1, -1, new Roll(3,3,3), false);
	
	this.addMonsterDefinition("ARNOLD", "Arnold", new Roll(5,3,0), -1, -1, new Roll(3,3,3), true);
	this.addMonsterDefinition("TOY", "The Sudopoet", new Roll(10,3,0), -1, -1, new Roll(3,3,3), false);
	this.addMonsterDefinition("LANE", "Jon Lane", new Roll(10,3,0), -1, -1, new Roll(1,3,3), true);
	this.addMonsterDefinition("MANGO", "Captain Mango", new Roll(10,3,0), -1, -1, new Roll(3,3,3), false);
	
	
}

MonsterFactory.prototype.addMonsterDefinition = function (monsterId, name, hp, minLevel, maxLevel, damageRoll, doubleSpeed){
	this.monsterDefinitions[monsterId] = {
		monsterId: monsterId,
		tileId: monsterId,
		name: name,
		hpRoll: hp,
		damageRoll: damageRoll,
		doubleSpeed: doubleSpeed
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
		definition.doubleSpeed
	);
};

