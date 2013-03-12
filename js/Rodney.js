/*global ut */
var Rodney = {};

Rodney.initGame = function () {
	JSRL.ui = new UI();
	Rodney.restartGame();
};

Rodney.restartGame = function (){
	JSRL.ui.reset();
};

Rodney.doStartGame = function (){
	JSRL.player = new Player(JSRL.ui.inkeyBuffer);
	JSRL.dungeonGenerator = new FeatureCarveGenerator();
	JSRL.monsterFactory = new MonsterFactory();
	JSRL.itemFactory = new ItemFactory();
	JSRL.dungeon = new Dungeon();
	JSRL.dungeon.generateLevel(1);
	
};