function GraphicRender(context, terrainFunc, overlayFunc, imagesMan, view, tileSize, font){
	this.ctx = context;
	this.getTerrainTile = terrainFunc;
	this.getOverlayTile = overlayFunc;
	this.imagesMan = imagesMan;
	this.view = view;
	this.textBuffer = [];
	this.tileSize = tileSize;
	this.font = font;
	this.textEffects = [];
	this.currentView = {x: 0, y: 0};
}

GraphicRender.prototype.refresh = function(playerPos){
	//var tile = this.getTile(playerPos.x, playerPos.y).imageTile;
	var left = playerPos.x - Math.floor(this.view.w / 2);
	var top = playerPos.y - Math.floor(this.view.h / 2);
	this.currentView = {x: left, y: top};
	
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
			if (screenTile.x == Math.floor(this.view.w / 2) && screenTile.y == Math.floor(this.view.h / 2)){
				var tile = JSRL.tiles.getTile("AT").imageTile;
				this.imagesMan.drawImageTile(tile, screenTile.x, screenTile.y);
			}
			
			screenTile.x++;
		}
		screenTile.x = 0;
		screenTile.y++;
	}
	
};

GraphicRender.prototype.drawTextBuffer = function(){
	for (var i=0,len=this.textBuffer.length;i<len;i++){
		var t = this.textBuffer[i];
		
		this.ctx.font = this.font.replace("XX",t.size);
		this.ctx.fillStyle = t.color;
		
		var text = t.text.split("\n");
		var init = (text.length >= 3)? text.length - 3 : 0;
		for (var j=init,jlen=text.length;j<jlen;j++){
			this.ctx.fillText(text[j], t.x*this.tileSize.w, t.y*t.size+((j-init)*t.size));
		}
	}
	
	this.clearTextBuffer();
};

GraphicRender.prototype.drawTextEffectsBuffer = function(){
	for (var i=0,len=this.textEffects.length;i<len;i++){
		var t = this.textEffects[i];
		if (!t)
			continue;
		t.life--;
		t.y -= 2;
		var rel = (t.life / t.mLife).toPrecision(2);
		var col = "rgba("+t.color.substring(t.color.indexOf("(")+1,t.color.indexOf(")"))+","+rel+")"; 

		this.ctx.font = this.font.replace("XX",t.size);
		this.ctx.fillStyle = col;		
		this.ctx.fillText(t.text, t.x, t.y);
		
		if (t.life <= 0){
			this.textEffects.splice(i,1);
			i--;
		}
	}
};

GraphicRender.prototype.update = function(playerX, playerY){
	this.ctx.fillStyle = "rgb(0,0,0)";
	this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	
	this.refresh({x: playerX, y: playerY});
	this.drawTextBuffer();
	this.drawTextEffectsBuffer();
};

GraphicRender.prototype.addText = function(text, color, fontSize, maxWidth, x, y, measure){
	if (measure){
		text = this.formatText(text, fontSize, maxWidth);
	}
	
	this.textBuffer.push({
		text: text,
		color: color,
		size: fontSize,
		x: x,
		y: y
	});
	
	return text;
};

GraphicRender.prototype.clearTextBuffer = function(){
	this.textBuffer = [];
};

GraphicRender.prototype.formatText = function(text, fontSize, maxWidth){
	if (text.trim() == "")
		return text;
		
	this.ctx.font = this.font.replace("XX",fontSize);
	
	var ret = "";
	var line = "";
	var width = this.ctx.measureText(text).width;
	
	if (width <= maxWidth){
		return text;
	}
	
	var words = text.split(" ");
	line = words[0];
	for (var i=1,len=words.length;i<len;i++){
		width = this.ctx.measureText(line+" "+words[i]).width
		if (width < maxWidth){
			line += " "+words[i];
		}else{
			if (ret != "")
				ret += "\n";
			ret += line;
			line = words[i];
		}
	}
	ret += "\n"+line;
	
	return ret;
};

GraphicRender.prototype.addTextEffect = function(text, fontSize, color, x, y, life){
	if (text.trim() == "")
		return;
		
	this.textEffects.push({
		text: text,
		fontSize: fontSize,
		color: color,
		x: (x - this.currentView.x) * this.tileSize.w,
		y: (y - this.currentView.y) * this.tileSize.h,
		life: life,
		mLife: life
	});
};
