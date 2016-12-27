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

function resizeCanvas() {

    var canvas = document.getElementsByTagName("canvas")[0];
    if (!canvas)
    	return;
    var canvasRatio = canvas.height / canvas.width;
    var windowRatio = window.innerHeight / window.innerWidth;
    var width;
    var height;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

window.addEventListener('resize', resizeCanvas, false);