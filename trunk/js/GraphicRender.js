function GraphicRender(context, terrainFunc, overlayFunc, imagesMan, view){
	this.ctx = context;
	this.getTerrainTile = terrainFunc;
	this.getOverlayTile = overlayFunc;
	this.imagesMan = imagesMan;
	this.view = view;
}

GraphicRender.prototype.refresh = function(playerPos){
	//var tile = this.getTile(playerPos.x, playerPos.y).imageTile;
	var left = playerPos.x - Math.floor(this.view.w / 2);
	var top = playerPos.y - Math.floor(this.view.h / 2);
	
	
	var screenTile = {x: 0, y: 0};
	for (var j=top,jlen=top+this.view.h;j<jlen;j++){
		for (var i=left,len=left+this.view.w;i<len;i++){
			for (a=0;a<2;a++){
				var tile;
				if (a==0)
					tile = this.getTerrainTile(i,j);
				else
					tile = this.getOverlayTile(i,j);
					
				if (!tile)
					continue;
				if (!tile.imageTile)
					continue;
				
				var img = tile.imageTile;
				if (tile.itType == 2 && tile.imageTile.image.imageId == "TERRAIN")
					img = {image: this.imagesMan.getImage("TERRAIN_NIGHT"), imgIn: tile.imageTile.imgIn, vImgIn: tile.imageTile.vImgIn};
				
				this.imagesMan.drawImageTile(img, screenTile.x, screenTile.y);
			}
			
			//Draw player
			if (screenTile.x == 12 && screenTile.y == 6){
				var tile = JSRL.tiles.getTile("AT").imageTile;
				this.imagesMan.drawImageTile(tile, screenTile.x, screenTile.y);
			}
			
			screenTile.x++;
		}
		screenTile.x = 0;
		screenTile.y++;
	}
	
};

GraphicRender.prototype.update = function(playerX, playerY){
	this.ctx.fillStyle = "rgb(0,0,0)";
	this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	
	this.refresh({x: playerX, y: playerY});
};

GraphicRender.prototype.term = function(){
	this.strings = [];
};

GraphicRender.prototype.term.prototype.clear = function(){
	this.strings = [];
};

GraphicRender.prototype.term.prototype.putString = function(string, x, y, r, g, b){
	this.strings.push({
		s: string,
		x: x,
		y: y,
		r: r,
		g: g,
		b: b
	});
};
