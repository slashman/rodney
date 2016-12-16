var MAP_WIDTH = 100;
var MAP_HEIGHT = 100;
var FPS = 10;


function UI () {
	this.currentMessage = '';
	this.lastMessage = '';
	this.inkeyBuffer = '';
	this.pressedKey = null;
	this.mode = 'TITLE';
	this.inputEnabled = true;
	this.term = new ut.Viewport(document.getElementById("game"), 80, 25, "canvas");
	this.eng = new ut.Engine(this.term, this.getDisplayedTile, MAP_WIDTH, MAP_HEIGHT);
	this.eng.setShaderFunc(TorchFilter.doLighting);
	this.graph = new GraphicRender(this.eng.viewport.renderer.ctx2, this.getTerrainTile, this.getOverlayTile, JSRL.images, {w: 24, h: 12}, {w: 32, h: 32},'XXpx "Fondamento"');
	this.messageRepeatCounter = 0;
	this.textBox = new TextBox(10, 78, {x: 1, y: 1});
	this.keyboardPollingDelay = 10;
	this.pendingProjectiles = [];
	//ut.initInput(this.onKeyDown);
	if (document.addEventListener)
		document.addEventListener("keydown",this.onKeyDown);
	else if (document.attachEvent)
		document.attachEvent("onkeydown", this.onKeyDown);
	window.setInterval(tick, 1000 / FPS);
	window.setTimeout(this.pollKeyboard, this.keyboardPollingDelay);
}

var keyLock = false;
UI.prototype.onKeyDown = function (keyboardEvent) {
	if (keyLock)
		return;
	keyLock = true;
	if (!JSRL.ui.inputEnabled){
		keyLock = false;
		return;
	}
	if (window.event)
		keyboardEvent = window.event;
	var keyCode = keyCodeToChar[keyboardEvent.keyCode];
	if (keyCode === "Left" || keyCode === "Right" || keyCode === "Up" || keyCode === "Down" || keyCode === "Space"){
		if (keyboardEvent.preventDefault) 
			keyboardEvent.preventDefault();
		else {
			keyboardEvent.returnValue = false; // IEs
			event.returnValue = false; // IE8
		}
	}	
	if (keyCode === "Ctrl" || keyCode === "Shift" || keyCode === "Alt" || keyCode === "Tab"){
		//Yawn
		keyLock = false;
	} else{
		JSRL.ui.pressedKey = keyboardEvent.keyCode; 
	}
};

UI.prototype.pollKeyboard = function (keyboardEvent) {
	if (JSRL.ui.pressedKey == null){
		window.setTimeout(JSRL.ui.pollKeyboard, JSRL.ui.keyboardPollingDelay);
		return;
	}
	var key = JSRL.ui.pressedKey;
	JSRL.ui.pressedKey = null; 
	if (JSRL.ui.mode === 'TITLE'){
		JSRL.ui.enterName(key);
		JSRL.ui.term.render();
	}  else if (JSRL.ui.mode === 'IN_GAME'){
		// Check if an enemy still acting
		for (var i = 0; i < JSRL.dungeon.enemies.length; i++){
			if (JSRL.dungeon.enemies[i].acting){
				window.setTimeout(JSRL.ui.pollKeyboard, JSRL.ui.keyboardPollingDelay);
				keyLock = false;
				return;
			}
		}
		if (JSRL.player.dead){
			if (keyCodeToChar[key] === "Enter"){
				JSRL.ui.keyboardPollingDelay = 10;
				JSRL.ui.mode = 'TITLE';
				Rodney.restartGame();
			}
		} else {
			var acted = JSRL.ui.movePlayer(key);
			if (acted) {
				JSRL.dungeon.dungeonTurn();
				JSRL.ui.tick();
			}
		}
	} else if (JSRL.ui.mode === 'SELECT_ADVANCEMENT'){
		if (isUp(key)){
			JSRL.ui.menuCursor--;
			if (JSRL.ui.menuCursor < 0)
				JSRL.ui.menuCursor = 0;
			JSRL.ui.showSkill(JSRL.ui.availableAdvancements[JSRL.ui.menuCursor]);
		} else if (isDown(key)){
			JSRL.ui.menuCursor++;
			if (JSRL.ui.menuCursor > JSRL.ui.availableAdvancements.length-1){
				JSRL.ui.menuCursor = JSRL.ui.availableAdvancements.length-1;
			}
			JSRL.ui.showSkill(JSRL.ui.availableAdvancements[JSRL.ui.menuCursor]);
		} else if (keyCodeToChar[key] === "Space" || keyCodeToChar[key] === "Enter" || keyCodeToChar[key] === "V"){
			JSRL.player.addSkill(JSRL.ui.availableAdvancements[JSRL.ui.menuCursor]);
			JSRL.ui.mode = 'IN_GAME';
			var effects = [ "boxin", "circlein", "random" ];
			var effect = effects[Math.floor(Math.random()*effects.length)];
			JSRL.ui.eng.setTileFunc(JSRL.ui.getDisplayedTile, effect, 1000);
		}
	} else if (JSRL.ui.mode === 'SELECT_ITEM'){
		if (isUp(key)){
			JSRL.ui.menuCursor--;
			if (JSRL.ui.menuCursor < 0)
				JSRL.ui.menuCursor = 0;
		} else if (isDown(key)){
			JSRL.ui.menuCursor++;
			if (JSRL.ui.menuCursor > JSRL.player.inventory.length-1){
				JSRL.ui.menuCursor = JSRL.player.inventory.length-1;
			}
		} else if (keyCodeToChar[key] === "Space" || keyCodeToChar[key] === "Enter" || keyCodeToChar[key] === "V"){
			var acted = JSRL.player.useItem(JSRL.player.inventory[JSRL.ui.menuCursor]);
			if (acted){
				JSRL.dungeon.dungeonTurn();
				JSRL.ui.tick();
			}
			JSRL.ui.mode = 'IN_GAME';
			
		} else if (keyCodeToChar[key] === "D"){
			var acted = JSRL.player.dropItem(JSRL.player.inventory[JSRL.ui.menuCursor]);
			if (acted){
				JSRL.dungeon.dungeonTurn();
				JSRL.ui.tick();
			}
			JSRL.ui.mode = 'IN_GAME';
		} else if (keyCodeToChar[key] === "Esc"){
			JSRL.ui.mode = 'IN_GAME';
		}
		JSRL.ui.drawSelectItem();
	} else if (JSRL.ui.mode === 'SELECT_DIRECTION'){
		if (keyCodeToChar[key] === "Esc"){
			JSRL.ui.showMessage("Cancelled.");
		} else {
			JSRL.ui.selectDirection(key);
		}
	} else if (JSRL.ui.mode === 'SCENE'){
		if (keyCodeToChar[key] === "Space" || keyCodeToChar[key] === "Enter" || keyCodeToChar[key] === "V"){
			JSRL.ui.mode = 'IN_GAME';
		}
	} else if (JSRL.ui.mode === 'END_SCENE'){
		if (keyCodeToChar[key] === "Space" || keyCodeToChar[key] === "Enter" || keyCodeToChar[key] === "V"){
			JSRL.player.dead = true;
			
			if (WS_HOST != "NEIN"){
				JSRL.websocket.playerDie();
				JSRL.websocket.saveScore();
			}
			JSRL.ui.mode = 'TITLE';
			Rodney.restartGame();
			
		}
	}
	window.setTimeout(JSRL.ui.pollKeyboard, JSRL.ui.keyboardPollingDelay);
	keyLock = false;
};



UI.prototype.showMessage = function (msg){
	
	if (this.lastMessage === msg){
		this.messageRepeatCounter++;
		if (this.messageRepeatCounter === 1){
			if (this.currentMessage.length + 1 + "(x2)".length > 160)
				this.currentMessage = this.lastMessage +"(x2)";
			else
				this.currentMessage += "(x2)";
		} else {
			var messageRepeatCounterLength = (""+this.messageRepeatCounter).length;
			this.currentMessage = this.currentMessage.substring(0, this.currentMessage.length - messageRepeatCounterLength - 1);
			this.currentMessage += (this.messageRepeatCounter+1)+")";
		};
	} else {
		this.messageRepeatCounter = 0;
		this.lastMessage = msg;
		msg = msg + ".";
		if (JSRL.isGraphicMode){
			this.currentMessage += " " + msg;
			return;
		}
		
		if (this.currentMessage.length + 1 + msg.length > 160)
			this.currentMessage = msg;
		else
			this.currentMessage += " " + msg;
	}
	
};

UI.prototype.enterName = function (key){
	if (keyCodeToChar[key] === "Enter" && this.inkeyBuffer.length > 0){
		var callback = function(){
			showVirtualKeyboard();
			JSRL.ui.inputEnabled = true;
			JSRL.ui.keyboardPollingDelay = 100;
			JSRL.ui.selectAdvancement();
		};
		JSRL.ui.inputEnabled = false;
		Rodney.doStartGame(callback);
	} else if (key >= keyCharToCode["A"] && key <= keyCharToCode["Z"]){
		if (this.inkeyBuffer.length < 10){
			this.inkeyBuffer += String.fromCharCode(key);
		}
	} else if (keyCodeToChar[key] === "Backspace"){
		this.inkeyBuffer = this.inkeyBuffer.substring(0, this.inkeyBuffer.length-1);
	}
	this.term.putString("           ", 25, 24, 255, 255, 255);
	this.term.render();
	this.term.putString(this.inkeyBuffer+"_", 25, 24, 255, 255, 255);
			
};

function isUp(key){
	return keyCodeToChar[key] === "Numpad 8" || keyCodeToChar[key] === "Up" || keyCodeToChar[key] === "K" || keyCodeToChar[key] === "W";
}

function isDown(key){
	return keyCodeToChar[key] === "Numpad 2" || keyCodeToChar[key] === "Down" || keyCodeToChar[key] === "J" || keyCodeToChar[key] === "X";
}

function isLeft(key){
	return keyCodeToChar[key] === "Numpad 4" || keyCodeToChar[key] === "Left" || keyCodeToChar[key] === "H" || keyCodeToChar[key] === "A";
}

function isRight(key){
	return keyCodeToChar[key] === "Numpad 6" || keyCodeToChar[key] === "Right" || keyCodeToChar[key] === "L" || keyCodeToChar[key] === "D";
}

function isUpRight(key){
	return keyCodeToChar[key] === "Numpad 9" || keyCodeToChar[key] === "E";
}

function isDownRight(key){
	return keyCodeToChar[key] === "Numpad 3" || keyCodeToChar[key] === "C";
}

function isUpLeft(key){
	return keyCodeToChar[key] === "Numpad 7" || keyCodeToChar[key] === "Q";
}

function isDownLeft(key){
	return keyCodeToChar[key] === "Numpad 1" || keyCodeToChar[key] === "Z";
}

function getMovementVector(key){
	var movedir = { x: 0, y: 0 }; // Movement vector
	if (isLeft(key)) movedir.x = -1;
	else if (isRight(key)) movedir.x = 1;
	else if (isUp(key)) movedir.y = -1;
	else if (isDown(key)) movedir.y = 1;
	else if (isDownLeft(key)) { movedir.x = -1; movedir.y = 1;}
	else if (isDownRight(key)) { movedir.x = 1; movedir.y = 1;}
	else if (isUpLeft(key)) { movedir.x = -1; movedir.y = -1;}
	else if (isUpRight(key)) { movedir.x = 1; movedir.y = -1;}
	return movedir;
}

UI.prototype.movePlayer = function(key){
	JSRL.player.newTurn();
	if (JSRL.player.paralysisCounter > 0){
		this.showMessage("You can't move!");
		return true;
	}

	if (keyCodeToChar[key] === "Space" || keyCodeToChar[key] === "V"){
		return JSRL.player.doAction();
	}
	if (keyCodeToChar[key] === "Enter"){
		this.tryTarget();
		return false;
	}
	if (keyCodeToChar[key] === "I"){
		this.selectItem();
		return false;
	}
		
	var movedir = { x: 0, y: 0 }; // Movement vector
	if (isLeft(key)) movedir.x = -1;
	else if (isRight(key)) movedir.x = 1;
	else if (isUp(key)) movedir.y = -1;
	else if (isDown(key)) movedir.y = 1;
	else if (isDownLeft(key)) { movedir.x = -1; movedir.y = 1;}
	else if (isDownRight(key)) { movedir.x = 1; movedir.y = 1;}
	else if (isUpLeft(key)) { movedir.x = -1; movedir.y = -1;}
	else if (isUpRight(key)) { movedir.x = 1; movedir.y = -1;}
	if (movedir.x === 0 && movedir.y === 0) 
		JSRL.player.standFast();
	else {
		if (JSRL.player.confusionCounter > 0 && chance(50))
			movedir = randomDirection();
		JSRL.player.tryMoving(movedir);
	}
	JSRL.player.updateFOV();
	return true;
};

UI.prototype.getDisplayedTile = function (x,y){
	return JSRL.dungeon.getDisplayedTile(x,y);
};

UI.prototype.getTerrainTile = function (x,y){
	return JSRL.dungeon.getTerrainTile(x,y);
};

UI.prototype.getOverlayTile = function(x, y){
	return JSRL.dungeon.getOverlayTile(x, y);
};

UI.prototype.showStats = function (){
	this.term.putString(JSRL.player.name, 1, 4, 120, 120, 255);
	if (JSRL.player.currentWeapon)
		this.term.putString(JSRL.player.currentWeapon.getStatusDescription(), 1, 5, 255, 255, 255);
	if (JSRL.player.currentArmor)
		this.term.putString(JSRL.player.currentArmor.getStatusDescription(), 1, 6, 255, 255, 255);
	if (JSRL.player.currentAccesory)
		this.term.putString(JSRL.player.currentAccesory.getStatusDescription(), 1, 7, 255, 255, 255);
	this.term.putString("Floor    "+JSRL.dungeon.currentDepth, 1, 9, 255, 255, 255);
	var percentage = JSRL.player.hp / JSRL.player.maxhp;
	this.term.putString("HP       "+JSRL.player.hp+"/"+JSRL.player.maxhp, 1, 10, 255, Math.round(255*percentage), Math.round(255*percentage));
	
	this.term.putString("Force    "+JSRL.player.strength, 1, 11, 255, 255, 255);
	
	if (JSRL.player.kineticCharge>0)
		this.term.putString("Running", 1, 13, 255, 255, 255);
	
	//this.term.putString("Rage: "+JSRL.player.rageCounter, 1, 17, 255, 255, 255);
	//this.term.putString("Build: "+JSRL.player.buildUpCounter, 1, 18, 255, 255, 255);
	
	var yy = 0;
	var xx = 60;
	for (var i = 0; i < JSRL.player.skills.length; i++){
		this.term.putString(JSRL.player.skills[i].name, xx, 4+yy, 255, 255, 255);
		yy++;
		if (yy > 15){
			yy = 0;
			xx += 10;
		}
	}
	
	this.term.putString("Spacebar to Pick up, Use Stairs or Show Inventory. Enter to fire", 1, 22, 255, 255, 255);

};

UI.prototype.showGraphicStats = function (){
	this.graph.addText(JSRL.player.name, "rgb(255,0,0)", 20, 500, 1, 7);
	if (JSRL.player.currentWeapon)
		this.graph.addText(JSRL.player.currentWeapon.getStatusDescription(), "rgb(255,255,255)", 20, 500, 1, 8);
	if (JSRL.player.currentArmor)
		this.graph.addText(JSRL.player.currentArmor.getStatusDescription(), "rgb(255,255,255)", 20, 500, 1, 9);
	if (JSRL.player.currentAccesory)
		this.graph.addText(JSRL.player.currentAccesory.getStatusDescription(), "rgb(255,255,255)", 20, 500, 1, 10);
	this.graph.addText("Level    "+JSRL.dungeon.currentDepth, "rgb(255,255,255)", 20, 500, 1, 12);
	var percentage = JSRL.player.hp / JSRL.player.maxhp;
	this.graph.addText("HP       "+JSRL.player.hp+"/"+JSRL.player.maxhp, "rgb(255,"+Math.round(255*percentage)+","+Math.round(255*percentage)+")", 20, 500, 1, 13);
	
	this.graph.addText("Strength "+JSRL.player.strength, "rgb(255,255,255)", 20, 500, 1, 14);
	
	if (JSRL.player.kineticCharge>0)
		this.graph.addText("Running", "rgb(255,255,255)", 20, 500, 1, 16);
	
	var yy = 0;
	var xx = 17;
	for (var i = 0; i < JSRL.player.skills.length; i++){
		this.graph.addText(JSRL.player.skills[i].name, "rgb(255,255,255)", 20, 500, xx, 4+yy);
		yy++;
		if (yy > 12){
			yy = 0;
			xx += 4;
		}
	}
	
	this.graph.addText("Press Space for action (Pick, Stairs, Inventory)", "rgb(255,255,255)", 20, 500, 3, 18);
};

UI.prototype.graphicRefresh = function(){
	var temptText = this.graph.addText(this.currentMessage, "rgb(255,255,255)", 20, 760, 1, 1, true).split("\n");
	if (temptText.length >= 3){
		var init = temptText.length - 3;
		this.currentMessage = temptText[init];
		for (var i=init+1,len=temptText.length;i<len;i++){
			this.currentMessage += " " + temptText[i]; 
		}
	}
	
	this.showGraphicStats();
	this.graph.update(JSRL.player.position.x, JSRL.player.position.y);
	
};

UI.prototype.refresh = function(){
	this.eng.update(JSRL.player.position.x, JSRL.player.position.y);
	this.term.put(JSRL.tiles.AT, this.term.cx, this.term.cy);
	this.showStats();
	this.textBox.setText(this.currentMessage);
	this.textBox.draw();
	this.term.render(); // Render
};


UI.prototype.tick = function () {
	if (this.mode === 'IN_GAME'){
		if (JSRL.isGraphicMode)
			this.graphicRefresh();
		else
			this.refresh();
	} else if (this.mode === 'SELECT_ADVANCEMENT'){
		if (this.currentSkillAnimation && this.currentSkillAnimation.frames){
			var animationFrame = this.currentSkillAnimation.frames[this.currentSkillAnimation.frame];
			for (var i = 0; i < animationFrame.length; i++){
				if (this.currentSkillAnimation.hasActions && i == animationFrame.length - 1){
					this.term.putString(animationFrame[i], 20, 4+i, 255, 255, 255);
				} else {
					for (var j = 0; j < animationFrame[i].length; j++){
						var color = [255, 255, 255];
						var char = animationFrame[i].charAt(j);
						if (char === '#')
							color = [170, 170, 170];
						else if (char === '.')
							color = [170, 170, 170];
						else if (char === '@')
							color = [255, 255, 255];
						else if (char === 'j')
							color = [255, 255, 55];
						else if (char === '%')
							color = [255, 255, 55];
						else if (char === '!')
							color = [255, 0, 0];
						else if (char === '*')
							color = [255, 0, 0];
						else if (char === '-'){
							char = '.';
							color = [0, 0, 170];
						} else if (char === 'D') {
							char = '#';
							color = [0, 0, 170];
						} 
						this.term.putString(char, 20+j, 4+i, color[0], color[1], color[2]);
					}
				}
			}
			this.currentSkillAnimation.tickCounter++;
			var delay = FPS;
			if (this.currentSkillAnimation.frame === this.currentSkillAnimation.frames.length-1)
				delay *= 4;
			if (this.currentSkillAnimation.tickCounter > delay){
				this.currentSkillAnimation.tickCounter = 0;
				this.currentSkillAnimation.frame ++;
				if (this.currentSkillAnimation.frame > this.currentSkillAnimation.frames.length-1){
					this.currentSkillAnimation.frame = 0;
				}
			}
		}
		this.term.putString("Select a skill", 2, 2, 255, 255, 0);
		for (var i = 0; i < this.availableAdvancements.length; i++){
			this.term.putString(this.availableAdvancements[i].name, 5, 4+i, 255, 255, 255);
			if (i === this.menuCursor){
				this.term.putString("(*)", 2, 4+i, 255, 0, 0);
			} else {
				this.term.putString("   ", 2, 4+i, 255, 0, 0);
			};
		}
		this.term.render();
	}
};

UI.prototype.reset = function(){
	this.currentMessage = '';
	this.inkeyBuffer = '';
	this.showTitleScreen();
};

UI.prototype.showTitleScreen = function(){
	this.mode = 'TITLE';
	showNameEnter();
	this.term.clear();
	this.term.putString("/===============\\", 30, 1, 120, 120, 255);
	this.term.putString("| ROGUElike ONE |", 30, 2, 120, 120, 255);
	this.term.putString("\\===============/", 30, 3, 120, 120, 255);
	this.term.putString("by Slashware Interactive", 26, 4, 255, 255, 255);
	this.term.putString("Your name?", 10, 24, 120, 120, 255);
	this.term.putString("_", 25, 24, 255, 255, 255);

	
	var scene = [
"A long time ago, in a galaxy far away...",
"                                                                         ",
"All of your life you have lived running in the shadows                   ",
"                                                                         ",
"Your father, a weapons engineer from the empire, abandoned you years ago,",
"claimed back by the empire from his self imposed retirement to work on a ",
"secret project.",
"                                                                         ",
"The rebel alliance has managed to get a hold on you, and fate has made it",
"possible for you to obtain a message from him. ",
"                                                                         ",
"The Empire is creating the deadliest weapon that has ever existed, and   ",
"the only way to stop them is to exploit a single weakness your father has",
"included on its design.",
"                                                                         ",
"With only a small squad supporting you, you embark to Scarif in a quest  ",
"to obtain the blueprints of this evil machine and save the galaxy."
	             ];
	for (var i = 0; i < scene.length; i++){
		this.term.putString(scene[i], 2, i + 6, 255, 255, 255);
	}
	
	this.term.render();
};

var TorchFilter = {
	LIGHT_COLOR: { r: 255, g: 255, b: 0 },
	LIGHT_INTENSITY: 0.9
};

// Based on an implementation by UnicodeTiles.js
//Shades the tile according to distance from player,
// giving a kind of torch effect
TorchFilter.doLighting = function (tile, x, y, time) {
	// Calculate a pulsating animation value from the time
	var anim = time / 1000.0;
	anim = Math.abs(anim - Math.floor(anim) - 0.5) + 0.5;
	var d = distance(JSRL.player.position.x, JSRL.player.position.y, x, y);
	// No shading if the tile is too far away from the player's "torch"
	if (d >= JSRL.player.getLightRange()) return tile;
	// No shading if the player has no torch
	if (!JSRL.player.currentAccesory || !JSRL.player.currentAccesory.lightBonus) return tile;
	// We will create a new instance of ut.Tile because the tile
	// passed in might be (and in this case is) a reference to
	// a shared "constant" tile and we don't want the shader to
	// affect all the places where that might be referenced
	var shaded = new ut.Tile(tile.getChar());
	// Calculate a blending factor between light and tile colors
	var f = (1.0 - (d / JSRL.player.getLightRange())) * TorchFilter.LIGHT_INTENSITY * anim;
	// Do the blending
	shaded.r = Math.round(blend(TorchFilter.LIGHT_COLOR.r, tile.r, f));
	shaded.g = Math.round(blend(TorchFilter.LIGHT_COLOR.g, tile.g, f));
	shaded.b = Math.round(blend(TorchFilter.LIGHT_COLOR.b, tile.b, f));
	return shaded;
};

function tick(){
	JSRL.ui.tick();
}

UI.prototype.selectAdvancement = function(){
	this.availableAdvancements = JSRL.player.getLearnableSkills();
	if (this.availableAdvancements.length === 0)
		return;
	if (this.availableAdvancements.length === 1){
		JSRL.player.addSkill(this.availableAdvancements[0]);
		return;
	}
	this.mode = 'SELECT_ADVANCEMENT';
	this.menuCursor = 0;
	this.term.clear();
	this.showSkill(this.availableAdvancements[this.menuCursor]);
};

UI.prototype.selectItem = function(){
	JSRL.player.kineticCharge = 0;
	if (JSRL.player.inventory.length === 0){
		this.showMessage("You have no items");
		return;
	}
	this.activateItemSelection();
};

UI.prototype.tryTarget = function(){
	if (!JSRL.player.currentWeapon || !JSRL.player.currentWeapon.isRanged){
		this.showMessage("You don't have a ranged weapon");
		return;
	}
	this.mode = 'SELECT_DIRECTION';
	this.showMessage("Press a direction to fire");
	this.textBox.setText(this.currentMessage);
	this.textBox.draw();
	this.term.render(); // Render

}

UI.prototype.selectDirection = function(key){
	var movedir = getMovementVector(key);
	if (movedir.x === 0 && movedir.y === 0){
		return;
	}
	this.mode = 'NO_INPUT';
	this.projectilePosition = {x: JSRL.player.position.x, y: JSRL.player.position.y};
	var projectile;
	if (movedir.x === 0){
		projectile = 'P2';
	} else if (movedir.y === 0){
		projectile = 'P4';
	} else if (movedir.x === 1){
		if (movedir.y === 1){
			projectile = 'P3';
		} else {
			projectile = 'P1';
		}
	} else {
		if (movedir.y === 1){
			projectile = 'P1'
		} else {
			projectile = 'P3';
		}
	} 

	this.projectileIcon = JSRL.tiles.getTile(projectile);
	this.hitIcon = JSRL.tiles.getTile('HIT');
	this.playerProjectile = true;
	JSRL.sounds.getSound("SND_LASER").copyPlay();
	this.fireAnimation(movedir);
}

UI.prototype.launchEnemyProjectile = function(source, movedir){
	this.pendingProjectiles.push({source: source, movedir: movedir});
}

UI.prototype._doLaunchEnemyProjectile = function(source, movedir){
	this.projectilePosition = {x: source.position.x, y: source.position.y};
	var projectile;
	if (movedir.x === 0){
		projectile = 'P2';
	} else if (movedir.y === 0){
		projectile = 'P4';
	} else if (movedir.x === 1){
		if (movedir.y === 1){
			projectile = 'P3';
		} else {
			projectile = 'P1';
		}
	} else {
		if (movedir.y === 1){
			projectile = 'P1'
		} else {
			projectile = 'P3';
		}
	} 
	this.projectileEnemy = source;
	this.projectileIcon = JSRL.tiles.getTile(projectile);
	this.hitIcon = JSRL.tiles.getTile('HIT');
	this.playerProjectile = false;
	JSRL.sounds.getSound("SND_LASER").copyPlay();
	this.fireAnimation(movedir);
}

UI.prototype.hitEnemy = function(enemy, dir){
	JSRL.player.attackEnemy(enemy, false, false, false, dir, false, 1);
}

UI.prototype.nextEnemyProjectile = function(){
	if (this.pendingProjectiles.length > 0){
		var nextProjectile = this.pendingProjectiles.pop();
		this._doLaunchEnemyProjectile(nextProjectile.source, nextProjectile.movedir);
	} else {
		this.mode = 'IN_GAME';
	}

}

UI.prototype.fireAnimation = function(dir){
	if (this.savedTile){
		var xpos = this.term.cx + (this.projectilePosition.x - JSRL.player.position.x);
		var ypos = this.term.cy + (this.projectilePosition.y - JSRL.player.position.y);
		this.term.put(this.savedTile, xpos, ypos);
	}

	this.projectilePosition.x += dir.x;
	this.projectilePosition.y += dir.y;
	var xpos = this.term.cx + (this.projectilePosition.x - JSRL.player.position.x);
	var ypos = this.term.cy + (this.projectilePosition.y - JSRL.player.position.y);
	var cell = JSRL.dungeon.getMapTile(this.projectilePosition.x, this.projectilePosition.y);
	if (cell.solid){
		if (this.playerProjectile)
			this.mode = 'IN_GAME';
		else {
			this.projectileEnemy.acting = false;
			this.nextEnemyProjectile();
		}
		this.savedTile = false;
		return;
	}

	if (this.projectilePosition.x === JSRL.player.position.x && this.projectilePosition.y === JSRL.player.position.y){
		this.projectileEnemy.attackPlayer();
		this.projectileEnemy.acting = false;
		this.nextEnemyProjectile();
		return;
	}
	var enemy = JSRL.dungeon.getEnemy(this.projectilePosition.x, this.projectilePosition.y);
	if (enemy && this.playerProjectile){
		this.term.put(this.hitIcon, xpos, ypos);
		this.term.render(); // Render
		window.setTimeout(function(){
			JSRL.ui.hitEnemy(enemy, dir);
			JSRL.ui.mode = 'IN_GAME';
			JSRL.ui.savedTile = false;
		}, 100);
		return;
	}
	if (JSRL.player.maskBuffer[this.projectilePosition.x][this.projectilePosition.y]){
		this.savedTile = this.term.get(xpos, ypos);
		this.term.put(this.projectileIcon, xpos, ypos);
		this.term.render(); // Render
	} else {
		this.savedTile = false;
		this.term.render(); // Render
	}
	window.setTimeout(function(){
		JSRL.ui.fireAnimation(dir);
	}, 50);
}


UI.prototype.activateItemSelection = function(){
	if (JSRL.player.inventory.length === 0){
		return;
	}
	this.mode = 'SELECT_ITEM';
	this.term.clear();
	this.menuCursor = 0;
	this.term.putString("Select item, press Space to use, [d] to drop", 20, 1, 255, 255, 0);
	var itemType = '';
	for (var i = 0; i < JSRL.player.inventory.length; i++){
		var item = JSRL.player.inventory[i];
		var equipped = '';
		if (JSRL.player.currentWeapon ===  item ||
			JSRL.player.currentArmor === item ||
			JSRL.player.currentAccesory === item){
			equipped = '(Equiped) ';
		}
		if (itemType != item.type){
			itemType = item.type;
			this.term.putString(item.getTypeDescription(), 1, 3+i, 255, 0, 0);
		}
		this.term.putString(equipped+item.getMenuDescription(), 10, 3+i, 255, 255, 255);
	}
	this.drawSelectItem();
};

UI.prototype.drawSelectItem = function(){
	for (var i = 0; i < JSRL.player.inventory.length; i++){
		if (i === this.menuCursor){
			this.term.putString(">", 9, 3+i, 255, 0, 0);
		} else {
			this.term.putString(" ", 9, 3+i, 255, 0, 0);
		};
	};
	this.term.render();
};

UI.prototype.showSkill = function(skill){
	this.currentSkillAnimation = {
		frame: 0,
		tickCounter: 0,
		frames: skill.animation,
		hasActions: skill.hasActions
	};
	this.term.clear();
	this.term.putString(skill.text1, 30, 4, 255, 255, 255);
	if (skill.text2) this.term.putString(skill.text2, 30, 6, 255, 255, 255);
};


UI.prototype.showRodneyScene = function(){
	JSRL.ui.mode = 'SCENE';
	var scene = [
"Finally beaten, Rodney falls to his knees holding the Amulet of Yendor on",
"his hands.                                                               ",
"                                                                         ",
"  - How! me, beaten by a mere mortal... I am a god!                      ",
"                                                                         ",
"But then, the evil grin on Rodney's face fades away; the fierce look on  ",
"his eyes is replaced with a numb shadow.                                 ",
"                                                                         ",
"  - It's over... but it can't be helped... the amulet will bring this    ",
"    world into ultimate destruction!                                     ",
"                                                                         ",
"The only way to destroy it is to vanquish its forgers. Good luck!        ",
"                                                                         ",
"And with this, the brave but careless Rodney passed away.                ",
"                                                                         ",
"                                            [space to continue]         "
	             ];
	this.term.clear();
	for (var i = 0; i < scene.length; i++){
		this.term.putString(scene[i], 2, i + 2, 255, 255, 255);
	}
	this.term.render();
};

UI.prototype.showBlueprintsScene = function(){
	JSRL.ui.mode = 'SCENE';
	var scene = [
"You stand in the main console of the Imperial Archive",
"                                                                         ",
"You manage to acquire the blueprints of the deadly weapon...             ",
"                                                                         ",
"  ...the \"Death Star\"",
"                                                                         ",
"Now, you gotta find a way to transmit this information to the rebels     ",
"                                                                         ",
"                                            [space to continue]         "
	             ];
	this.term.clear();
	for (var i = 0; i < scene.length; i++){
		this.term.putString(scene[i], 2, i + 2, 255, 255, 255);
	}
	this.term.render();
};



UI.prototype.endGame = function(){
	JSRL.ui.mode = 'END_SCENE';
	var scene = [
"With you last energies, you manage to use the tower antenna to transmit  ",
"the Death Star blueprints to the rebels mothership orbiting the planet...",
"                                                                         ",
"Will it reach someone? Will they manage to use it for good?              ",
"                                                                         ",
"A ray of pure energy hits the planet. As your body is consumed in        ",
"the blast, you rest assured that you have brought hope to the galaxy.    ",
"                                                                         ",
"                                                                         ",
"                                                                         ",
"                                                                         ",
"            THE END                                                      ",
"                                                                         ",
"                                               [space to restart]        ",
"                                                                         ",
	             ];
	this.term.clear();
	for (var i = 0; i < scene.length; i++){
		this.term.putString(scene[i], 2, i + 2, 255, 255, 255);
	}
	this.term.render();
};