var JSRL = new JSRL();

function JSRL(){
	this.player;
	this.dungeon;
	this.dungeonGenerator;
	this.images = new Images({w: 32, h: 32});
	this.sounds = new Sound();
	this.tiles = new Tiles(this.images);
	this.websocket;
	this.isGraphicMode = false;
}