function Images(mapScale){
	this.images = {};
	this.mapScale = mapScale;
	
	this.addImage("TERRAIN", this.loadImage("img/terrain.png", {imgNum: 10, vImgNum: 5, offsetL: 12, offsetT: 24}));
	this.addImage("TERRAIN_DARK", this.loadImage("img/terrain_dark.png", {imgNum: 10, vImgNum: 5, offsetL: 12, offsetT: 24}));
	this.addImage("CHARS", this.loadImage("img/chars.png", {imgNum: 10, vImgNum: 10, offsetL: 12, offsetT: 12}));
	this.addImage("ITEMS", this.loadImage("img/items.png", {imgNum: 10, vImgNum: 10, offsetL: 8, offsetT: 8}));
	this.addImage("EFFECTS", this.loadImage("img/effects.png", {imgNum: 4, vImgNum: 4, offsetL: 12, offsetT: 12}));
	this.addImage("HIT", this.loadImage("img/hit.gif", {imgNum: 2, vImgNum: 1, offsetL: 16, offsetT: 16}));
}

Images.prototype.addImage = function(imageId, img){
	this.images[imageId] = img;
	this.images[imageId].imageId = imageId;
};

Images.prototype.loadImage = function(path, params){
	if (!params) params = new Object();
	if (!params.imgNum) params.imgNum = 1;
	if (!params.vImgNum) params.vImgNum = 1;
	if (!params.offsetL) params.offsetL = 0;
	if (!params.offsetT) params.offsetT = 0;
	if (!params.centered) params.centered = false;
	
	var img = new Image();
	img.src = path;
	img.imgNum = params.imgNum;
	img.vImgNum = params.vImgNum;
	img.centered = params.centered;
	img.loaded = false;
	
	if (params.centered === false){
		img.offsetL = params.offsetL;
		img.offsetT = params.offsetT;
	}
	
	img.onload = function(){
		this.imgWidth = Math.floor(this.width / this.imgNum);
		this.imgHeight = Math.floor(this.height / this.vImgNum);
		this.loaded = true;
		
		if (this.centered === true){
			this.offsetL = Math.floor(this.imgWidth / 2);
			this.offsetT = Math.floor(this.imgHeight / 2);
		}
	};
	
	return img;
};

Images.prototype.getImage = function(imageId){
	return this.images[imageId];
};

Images.prototype.drawImage = function(image, imgIn, vImgIn, x, y){
	if (!(image instanceof Image))
		image = this.getImage(image);
	
	if (image == null)
		return;
		
	x = x * this.mapScale.w - image.offsetL + this.mapScale.w / 2;
	y = y * this.mapScale.h - image.offsetT + this.mapScale.h / 2;

	var ctx = JSRL.ui.eng.viewport.renderer.ctx2;
	
	var x1 = imgIn * image.imgWidth;
	var y1 = Math.abs(vImgIn) * image.imgHeight;
	
	ctx.save();
	ctx.drawImage(image, 
		x1, y1, image.imgWidth, image.imgHeight,
		x, y, image.imgWidth, image.imgHeight);
	ctx.restore();
};

Images.prototype.drawImageFinely = function(imageTile, x, y){
	if (!(imageTile.image instanceof Image))
		imageTile.image = this.getImage(imageTile.image);
	var image = imageTile.image;
	
	if (image == null)
		return;
	
	x = x - image.offsetL;
	y = y - image.offsetT;

	var ctx = JSRL.ui.eng.viewport.renderer.ctx2;
	
	var x1 = imageTile.imgIn * image.imgWidth;
	var y1 = Math.abs(imageTile.vImgIn) * image.imgHeight;
	
	ctx.save();
	ctx.drawImage(image, 
		x1, y1, image.imgWidth, image.imgHeight,
		x, y, image.imgWidth, image.imgHeight);
	ctx.restore();
};

Images.prototype.drawFogTile = function(x, y){
	x = x * this.mapScale.w;
	y = y * this.mapScale.h;
	
	var ctx = JSRL.ui.eng.viewport.renderer.ctx2;
	ctx.fillStyle = "rgba(0,0,0,0.5)";
	ctx.fillRect(x,y,this.mapScale.w,this.mapScale.h);
};

Images.prototype.drawImageTile = function(imageTile, x, y){
	this.drawImage(imageTile.image, imageTile.imgIn, imageTile.vImgIn, x, y);
};

Images.prototype.imageTile = function(imageId, left, top){
	var imageTile = {
		image: this.getImage(imageId),
		imgIn: left,
		vImgIn: top
	};
	
	return imageTile;
};
