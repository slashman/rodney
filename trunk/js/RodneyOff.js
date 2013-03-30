/*global ut */
var Rodney = {};

var WS_HOST = "NEIN";

Rodney.initGame = function () {
	JSRL.ui = new UI();
	Rodney.restartGame();
};

Rodney.restartGame = function (){
	mixpanel.track("New Game");
	JSRL.ui.reset();
};

Rodney.doStartGame = function (onConnect){
	JSRL.itemFactory = new ItemFactory();
	JSRL.player = new Player(JSRL.ui.inkeyBuffer);
	JSRL.dungeonGenerator = new FeatureCarveGenerator();
	JSRL.monsterFactory = new MonsterFactory();
	JSRL.dungeon = new Dungeon();
	
	//Attempt to connect to the websocket server
	JSRL.websocket = new RWSC();
	var callback = function(status){
		if (JSRL.websocket.started) return;
		if (abortConnection)
			return;
		if (status == 1){
			mixpanel.track("Enter Town");
			JSRL.websocket.onTown = true;
			JSRL.dungeon.createTownLevel();
			JSRL.ui.showMessage("You are in the entrance to the Dungeons of Doom, look for another adventurers or press space to enter.");
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
