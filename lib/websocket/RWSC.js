function RWSC(){
	this.socket = null;
	this.started = false;
	this.key = this.randomKey();
	this.npcs = [];
	this.onTown = false;
	var chatText = document.getElementById("txtChatText");
	if (document.addEventListener){
		chatText.addEventListener("focus", function(e){JSRL.ui.inputEnabled = false;});
		chatText.addEventListener("blur", function(e){JSRL.ui.inputEnabled = true;});
	} else if (document.attachEvent){
		chatText.attachEvent("onfocus", function(e){JSRL.ui.inputEnabled = false;});
		chatText.attachEvent("onblur", function(e){JSRL.ui.inputEnabled = true;});
	}
}

RWSC.prototype.createSocket = function(host) {
    if (window.WebSocket)
        this.socket = new WebSocket(host);
    else if (window.MozWebSocket)
        this.socket = new MozWebSocket(host);
};

RWSC.prototype.init = function(callback, host) {
    try {
        this.createSocket(host);
        this.socket.onopen = function(msg) {
        	if (callback)
        		callback(this.readyState); 
        };
        this.socket.onmessage = function(msg) {
        	var o = JSON.parse(decodeURI(msg.data));
        	
        	switch (o.type){
        		case "createEnemy":
        			if (o.key == JSRL.websocket.key) return;
        			for (var i=0,len=JSRL.websocket.npcs.length;i<len;i++){
        				if (JSRL.websocket.npcs[i].key == o.key){
        					//Update position
        					JSRL.websocket.npcs[i].position = {x: o.x, y: o.y}
        					JSRL.websocket.npcs[i].pId = o.pId;
        					return;
        				}
        			}
        			
        		    var npc = new Enemy(o.name, o.hp, "AT", new Roll(1,1,0));
        		    npc.key = o.key;
        		    npc.aiType = "NETWORK";
        		    npc.pId = o.pId;
        		    JSRL.dungeon.addEnemy(npc, {x: o.x, y: o.y});
        		    
        		    JSRL.websocket.npcs.push(npc);
        		break;
        		
        		case "userConnected":
        			//Inform where i am
        			JSRL.websocket.sendPlayerInfo();
        		break;
        		
        		case "userLogout":
        			for (var i=0,len=JSRL.websocket.npcs.length;i<len;i++){
        				if (JSRL.websocket.npcs[i].pId == o.pId){
        					//Delete the player
        					JSRL.dungeon.removeEnemy(JSRL.websocket.npcs[i]);
        					return;
        				}
        			}
        		break;
        		
        		case "chat":
        			if (o.key == JSRL.websocket.key) return;
        			var br = "";
					if (chatBox.innerHTML.trim() != "") br = "<br />";
					
					chatBox.innerHTML += br + o.msg;
        		break;
        	}
        };
        this.socket.onclose = function(msg) {
        	if (callback)
        		callback(this.readyState);
        };
    }
    catch (ex) {
        console.log(ex);
    }
};

RWSC.prototype.sendPlayerInfo = function(){
	var msg = {
		type: "createEnemy",
		name: JSRL.player.name,
		hp: JSRL.player.hp,
		x: JSRL.player.position.x,
		y: JSRL.player.position.y,
		key: this.key,
		pId: 'pId_x'
	};
	
	this.send(encodeURI(JSON.stringify(msg)));
};


RWSC.prototype.sendMessage = function(){
	if (WS_HOST == "NEIN") return;
	
	var chatBox = document.getElementById("chatBox");
	var chatText = document.getElementById("txtChatText");
	
	var msg = chatText.value.trim();
	if (msg == "") return;
	
	var br = "";
	if (chatBox.innerHTML.trim() != "") br = "<br />";
	
	chatBox.innerHTML += br + "you >> " + msg;
	chatText.value  = "";
	
	chatBox.scrollTop = chatBox.scrollHeight;
	
	//Now send message to everybody else
	var jsonMsg = {type: "chat", msg: JSRL.player.name+" >> "+msg, key: this.key}
	this.send(JSON.stringify(jsonMsg));
};

RWSC.prototype.send = function(msg){
    try {
        this.socket.send(msg);
    } catch (ex) {
        console.log(ex);
    }
};

RWSC.prototype.quit = function() {
    this.socket.close();
    this.socket = null;
    this.onTown = false;
    JSRL.websocket.npcs = [];
    this.started = false;
    JSRL.dungeon.enemies = [];
};

RWSC.prototype.randomKey = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

RWSC.prototype.getConnection = function(){
	var http;
	if (window.XMLHttpRequest)
		http = new XMLHttpRequest();
	else if (window.ActiveXObject)
		http = new ActiveXObject("MICROSOFT.XMLHTTP");
		
	return http;
};

RWSC.prototype.doPost = function(url, params){
	var conexion = this.getConnection();
	conexion.open("POST", url, true);
	conexion.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	conexion.onreadystatechange = function(){
		if (conexion.readyState == 4 && conexion.status == 200){
			var o = JSON.parse(conexion.responseText);
			if (o.status == false){
				alert(o.message);
			}
		}
	};
	conexion.send(params);
};

RWSC.prototype.saveScore = function(){
	var query = "&sessionInfo=" + JSRL.player.sessionInfo +
		"&name=" + JSRL.player.name +
		"&score=" + JSRL.player.score + 
		"&skillPath=" + JSRL.player.skillPath;
		
	this.doPost("classes/service/RodneyService.php", "operation=saveScore"+query);
};
