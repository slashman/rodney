var JSRL = new JSRL();

function JSRL(){
	this.player;
	this.dungeon;
	this.dungeonGenerator;
	this.images = new Images({w: 24, h: 24});
	this.sounds = new Sound();
	this.tiles = new Tiles(this.images);
	this.websocket;
	this.isGraphicMode = true;
}