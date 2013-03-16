/*global ut */
var Rodney = {};

//var WS_HOST = "ws://192.168.1.2:12345/echo";
//var WS_HOST = "ws://216.119.144.155:12345/echo";
var WS_HOST = "NEIN";

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
		if (abortConnection)
			return;
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
	if (WS_HOST === "NEIN"){
		JSRL.dungeon.generateLevel(1);
		
		if (onConnect)
			onConnect();
	}else {
		JSRL.websocket.init(callback, WS_HOST);
		/*setTimeout(function(){
			if (JSRL.websocket.onTown){
				return;
			}
			abortConnection = true;
			JSRL.dungeon.generateLevel(1);
			if (onConnect)
				onConnect();
		}, 10*1000);*/
	}
};

var abortConnection = false;
