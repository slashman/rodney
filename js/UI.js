var MAP_WIDTH = 60;
var MAP_HEIGHT = 60;
var FPS = 10;


function UI () {
	this.currentMessage = '';
	this.lastMessage = '';
	this.inkeyBuffer = '';
	this.mode = 'TITLE';
	this.inputEnabled = true;
	this.term = new ut.Viewport(document.getElementById("game"), 80, 25, "canvas");
	this.eng = new ut.Engine(this.term, this.getDisplayedTile, MAP_WIDTH, MAP_HEIGHT);
	this.eng.setShaderFunc(TorchFilter.doLighting);
	this.messageRepeatCounter = 0;
	
	//ut.initInput(this.onKeyDown);
	if (document.addEventListener)
		document.addEventListener("keydown",this.onKeyDown);
	else if (document.attachEvent)
		document.attachEvent("onkeydown", this.onKeyDown);
	window.setInterval(tick, 1000 / FPS);
}


UI.prototype.onKeyDown = function (keyboardEvent) {
	if (window.event)
		keyboardEvent = window.event;
	if (!JSRL.ui.inputEnabled){
		return;
	}
	var key = keyboardEvent.keyCode;
	if (JSRL.ui.mode === 'TITLE'){
		JSRL.ui.enterName(key);
		JSRL.ui.term.render();
	}  else if (JSRL.ui.mode === 'IN_GAME'){
		if (JSRL.player.dead){
			if (keyCodeToChar[key] === "Space"){
				JSRL.ui.mode = 'TITLE';
				Rodney.restartGame();
			}
		} else {
			JSRL.ui.movePlayer(key);
			JSRL.dungeon.dungeonTurn();
			JSRL.ui.tick();
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
		} else if (keyCodeToChar[key] === "Space" || keyCodeToChar[key] === "Enter"){
			JSRL.player.addSkill(JSRL.ui.availableAdvancements[JSRL.ui.menuCursor]);
			JSRL.ui.mode = 'IN_GAME';
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
		} else if (keyCodeToChar[key] === "Space"){
			JSRL.player.useItem(JSRL.player.inventory[JSRL.ui.menuCursor]);
			JSRL.ui.mode = 'IN_GAME';
		} else if (keyCodeToChar[key] === "D"){
			JSRL.player.dropItem(JSRL.player.inventory[JSRL.ui.menuCursor]);
			JSRL.ui.mode = 'IN_GAME';
		} else if (keyCodeToChar[key] === "Escape"){
			JSRL.ui.mode = 'IN_GAME';
		}
		JSRL.ui.drawSelectItem();
	} else if (JSRL.ui.mode === 'SCENE'){
		if (keyCodeToChar[key] === "Enter"){
			JSRL.ui.mode = 'IN_GAME';
		}
	}
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
		if (this.currentMessage.length + 1 + msg.length > 160)
			this.currentMessage = msg;
		else
			this.currentMessage += " " + msg;
	}
	
};

UI.prototype.enterName = function (key){
	this.term.putString("          ", 35, 20, 255, 255, 255);
	if (keyCodeToChar[key] === "Enter"){
		var callback = function(){
			JSRL.ui.term.clear();
			JSRL.ui.mode = 'IN_GAME';
			JSRL.ui.selectAdvancement();
		};
		Rodney.doStartGame(callback);
	} else if (key >= keyCharToCode["A"] && key <= keyCharToCode["Z"]){
		if (this.inkeyBuffer.length < 10){
			this.inkeyBuffer += String.fromCharCode(key);
		}
	} else if (keyCodeToChar[key] === "Backspace"){
		this.inkeyBuffer = this.inkeyBuffer.substring(0, this.inkeyBuffer.length-1);
	}
	this.term.putString(this.inkeyBuffer, 35, 20, 255, 255, 255);
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

UI.prototype.movePlayer = function(key){
	JSRL.player.newTurn();
	if (keyCodeToChar[key] === "Space"){
		JSRL.player.doAction();
		return;
	}
	if (keyCodeToChar[key] === "I"){
		this.selectItem();
		return;
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
	else
		JSRL.player.tryMoving(movedir);
};

UI.prototype.getDisplayedTile = function (x,y){
	return JSRL.dungeon.getDisplayedTile(x,y);
};

UI.prototype.showStats = function (){
	this.term.putString(JSRL.player.name, 1, 9, 255, 0, 0);
	if (JSRL.player.currentWeapon)
		this.term.putString(JSRL.player.currentWeapon.getStatusDescription(), 1, 10, 255, 255, 255);
	if (JSRL.player.currentArmor)
		this.term.putString(JSRL.player.currentArmor.getStatusDescription(), 1, 11, 255, 255, 255);
	if (JSRL.player.currentAccesory)
		this.term.putString(JSRL.player.currentAccesory.getStatusDescription(), 1, 12, 255, 255, 255);
	this.term.putString("Depth: "+JSRL.dungeon.currentDepth, 1, 14, 255, 255, 255);
	this.term.putString("HP: "+JSRL.player.hp, 1, 15, 255, 255, 255);
	this.term.putString("Run: "+JSRL.player.kineticCharge, 1, 16, 255, 255, 255);
	this.term.putString("Rage: "+JSRL.player.rageCounter, 1, 17, 255, 255, 255);
	this.term.putString("Build: "+JSRL.player.buildUpCounter, 1, 18, 255, 255, 255);
	this.term.putString("Strength: "+JSRL.player.strength, 1, 19, 255, 255, 255);
	this.term.putString("Press Space for action (Pick, Stairs, Inventory)", 1, 22, 255, 255, 255);

};

UI.prototype.refresh = function(){
	this.eng.update(JSRL.player.position.x, JSRL.player.position.y);
	this.term.put(JSRL.tiles.AT, this.term.cx, this.term.cy);
	this.showStats();
	this.term.putString(this.currentMessage, 1, 1, 255, 0, 0);
	this.term.render(); // Render
};


UI.prototype.tick = function () {
	if (this.mode === 'IN_GAME'){
		JSRL.player.updateFOV();
		this.refresh();
	} else if (this.mode === 'SELECT_ADVANCEMENT'){
		if (this.currentSkillAnimation && this.currentSkillAnimation.frames){
			var animationFrame = this.currentSkillAnimation.frames[this.currentSkillAnimation.frame];
			for (var i = 0; i < animationFrame.length; i++){
				this.term.putString(animationFrame[i], 20, 4+i, 255, 255, 255);
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
	this.term.clear();
	this.term.putString("R O D N E Y", 20, 5, 255, 255, 0);
	this.term.putString("Please enter your name:", 10, 20, 255, 255, 255);
	this.term.render();
};

var TorchFilter = {
	LIGHT_COLOR: { r: 255, g: 255, b: 0 },
	LIGHT_INTENSITY: 0.7,
	MAX_DIST: 5
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
	if (d >= TorchFilter.MAX_DIST) return tile;
	// We will create a new instance of ut.Tile because the tile
	// passed in might be (and in this case is) a reference to
	// a shared "constant" tile and we don't want the shader to
	// affect all the places where that might be referenced
	var shaded = new ut.Tile(tile.getChar());
	// Calculate a blending factor between light and tile colors
	var f = (1.0 - (d / TorchFilter.MAX_DIST)) * TorchFilter.LIGHT_INTENSITY * anim;
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

UI.prototype.activateItemSelection = function(){
	if (JSRL.player.inventory.length === 0){
		return;
	}
	this.mode = 'SELECT_ITEM';
	this.term.clear();
	this.menuCursor = 0;
	this.term.putString("Select item, press Space to use, [d] to drop", 20, 5, 255, 255, 0);
	for (var i = 0; i < JSRL.player.inventory.length; i++){
		var equipped = '';
		if (JSRL.player.currentWeapon === JSRL.player.inventory[i] ||
			JSRL.player.currentArmor === JSRL.player.inventory[i] ||
			JSRL.player.currentAccesory === JSRL.player.inventory[i]){
			equipped = '(Equiped) ';
		}
		this.term.putString(equipped+JSRL.player.inventory[i].getMenuDescription(), 10, 7+i, 255, 255, 255);
	}
	this.drawSelectItem();
};

UI.prototype.drawSelectItem = function(){
	for (var i = 0; i < JSRL.player.inventory.length; i++){
		if (i === this.menuCursor){
			this.term.putString("(*)", 6, 7+i, 255, 0, 0);
		} else {
			this.term.putString("   ", 6, 7+i, 255, 0, 0);
		};
	};
	this.term.render();
};

UI.prototype.showSkill = function(skill){
	this.currentSkillAnimation = {
		frame: 0,
		tickCounter: 0,
		frames: skill.animation
	};
	this.term.clear();
	this.term.putString(skill.text1, 30, 4, 255, 255, 255);
	if (skill.text2)
		this.term.putString(skill.text2, 20, 11, 255, 255, 255);
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
"  - I... I have failed... the Amulet, must be destroyed!                 ",
"                                                                         ",
" - You must dive deeper into the dungeons of doom, only on its fiery     ",
"   depths it can be unmade... go now!                                    ",
"                                                                         ",
"And then, the brave but careless Rodney passed away.                     "
	             ];
	this.term.clear();
	for (var i = 0; i < scene.length; i++){
		this.term.putString(scene[i], 2, i + 2, 255, 255, 255);
	}
	this.term.render();
};