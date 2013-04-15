var JSRL = new JSRL();

function JSRL(){
	this.player;
	this.dungeon;
	this.dungeonGenerator;
	this.images = new Images({w: 64, h: 64});
	this.tiles = new Tiles(this.images);
	this.websocket;
}