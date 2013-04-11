function MonsterFactory(){
	this.monsterDefinitions = {};
	this.levelMaps = {};
	this.addMonsterDefinition("GIANT_ANT", "Giant Ant", new Roll(2,4,0), 3,12, new Roll(1,6,1));
	this.addMonsterDefinition("BAT", "Bat", new Roll(1,8,1), 1, 8, new Roll(1,2,0));
	this.addMonsterDefinition("CENTAUR", "Centaur", new Roll(4,8,0), 8, 17, new Roll(2,8,2));
	this.addMonsterDefinition("DRAGON", "Dragon", new Roll(10,8,0), 22, 50, new Roll(4,10,5));
	this.addMonsterDefinition("FLOATING_EYE", "Floating Eye", new Roll(1,8,0), 2, 11, new Roll(0,0,0));
	this.addMonsterDefinition("VIOLET_FUNGI", "Violet Fungi", new Roll(6,8,0), 15, 24, new Roll(1,6,0));
	this.addMonsterDefinition("GNOME", "Gnome", new Roll(1,8,2), 6, 15, new Roll(1,6,1));
	this.addMonsterDefinition("HOBGOBLIN", "Hobgoblin", new Roll(2,4,1), 1, 10, new Roll(1,8,2));
	this.addMonsterDefinition("INVISIBLE_STALKER", "Invisible Stalker", new Roll(6,8,0), 16, 25, new Roll(4,4,0));
	this.addMonsterDefinition("JACKAL", "Jackal", new Roll(1,8,2), 1, 7, new Roll(1,2,0));
	this.addMonsterDefinition("KOBOLD", "Kobold", new Roll(2,4,2), 1, 6, new Roll(1,4,0));
	this.addMonsterDefinition("LEPRECHAUN", "Leprechaun", new Roll(3,8,0), 7, 16, new Roll(1,1,0));
	this.addMonsterDefinition("MIMIC", "Mimic", new Roll(7,8,0), 19, 50, new Roll(3,4,0));
	this.addMonsterDefinition("NYMPH", "Nymph", new Roll(3,4,0), 11, 20, new Roll(0,0,0));
	this.addMonsterDefinition("ORC", "Orc", new Roll(2,6,2), 4, 13, new Roll(1,8,1));
	this.addMonsterDefinition("PURPLE_WORM", "Purple Worm", new Roll(15,8,0), 21, 50, new Roll(2,12,4));
	this.addMonsterDefinition("QUASIT", "Quasit", new Roll(3,8,0), 10, 19, new Roll(2,4,0));
	this.addMonsterDefinition("RUST_MONSTER", "Rust Monster", new Roll(5,8,0), 9, 18, new Roll(0,0,0));
	this.addMonsterDefinition("SNAKE", "Snake", new Roll(1,8,0), 1, 9, new Roll(1,3,0));
	this.addMonsterDefinition("TROLL", "Troll", new Roll(6,8,0), 13, 22, new Roll(2,8,3));
	this.addMonsterDefinition("UMBER_HULK", "Umber Hulk", new Roll(8,6,0), 18, 50, new Roll(6,4,3));
	this.addMonsterDefinition("VAMPIRE", "Vampire", new Roll(8,6,0), 20, 50, new Roll(1,10,0));
	this.addMonsterDefinition("WRAITH", "Wraith", new Roll(5,6,0), 14, 23, new Roll(1,6,0));
	this.addMonsterDefinition("XORN", "Xorn", new Roll(7,8,0), 17, 26, new Roll(4,3,6));
	this.addMonsterDefinition("YETI", "Yeti", new Roll(4,8,0), 12, 21, new Roll(2,6,0));
	this.addMonsterDefinition("ZOMBIE", "Zombie", new Roll(2,8,0), 5, 14, new Roll(1,8,0));
	
	this.addMonsterDefinition("RODNEY", "Rodney", new Roll(60,3,0), -1, -1, new Roll(3,3,3));
	
	this.addMonsterDefinition("ARNOLD", "Arnold", new Roll(10,3,0), -1, -1, new Roll(3,3,3));
	this.addMonsterDefinition("TOY", "The Sudopoet", new Roll(10,3,0), -1, -1, new Roll(3,3,3));
	this.addMonsterDefinition("LANE", "Jon Lane", new Roll(10,3,0), -1, -1, new Roll(3,3,3));
	this.addMonsterDefinition("MANGO", "Captain Mango", new Roll(10,3,0), -1, -1, new Roll(3,3,3));
	
	
}

MonsterFactory.prototype.addMonsterDefinition = function (monsterId, name, hp, minLevel, maxLevel, damageRoll){
	this.monsterDefinitions[monsterId] = {
		monsterId: monsterId,
		tileId: monsterId,
		name: name,
		hpRoll: hp,
		damageRoll: damageRoll
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
		definition.damageRoll
	);
};

