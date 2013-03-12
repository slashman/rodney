/*global ut */
var Rodney = {};

Rodney.initGame = function () {
	JSRL.ui = new UI();
	Rodney.restartGame();
};

Rodney.restartGame = function (){
	JSRL.ui.reset();
};

Rodney.doStartGame = function (onConnect){
	JSRL.player = new Player(JSRL.ui.inkeyBuffer);
	JSRL.dungeonGenerator = new FeatureCarveGenerator();
	JSRL.monsterFactory = new MonsterFactory();
	JSRL.itemFactory = new ItemFactory();
	JSRL.dungeon = new Dungeon();
	
	//Attempt to connect to the websocket server
	JSRL.websocket = new RWSC();
	var callback = function(status){
		if (JSRL.websocket.started) return;
		
		if (status == 1){
			JSRL.websocket.onTown = true;
			JSRL.dungeon.createTownLevel();
			JSRL.websocket.sendPlayerInfo();
		}else if (status == 3)	
			JSRL.dungeon.generateLevel(1);
			
		JSRL.websocket.started = true;
		
		//Continue the game to the next room
		if (onConnect)
			onConnect();
	};
	
	JSRL.websocket.init(callback);
};