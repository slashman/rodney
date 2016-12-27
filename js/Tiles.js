function Tiles(imagesClass){
	this.tiles = {};
	this.terrainTiles = {};
	this.AT = new ut.Tile("@", 255, 255, 255);
	this.AT.imageTile = imagesClass.imageTile("CHARS", 0, 0);

	//Monsters
	this.addTile("GUARD", new ut.Tile("g", 120, 120, 255), imagesClass.imageTile("CHARS", 0, 1));
	this.addTile("ELITE_GUARD", new ut.Tile("g", 255, 120, 120), imagesClass.imageTile("CHARS", 1, 1));
	this.addTile("WHITE_TROOPER", new ut.Tile("t", 255, 255, 255), imagesClass.imageTile("CHARS", 2, 1));
	this.addTile("BLACK_TROOPER", new ut.Tile("t", 120, 120, 120), imagesClass.imageTile("CHARS", 3, 1));
	this.addTile("ELITE_TROOPER", new ut.Tile("t", 255, 0, 0), imagesClass.imageTile("CHARS", 4, 1));
	this.addTile("IMPERIAL_ROBOT_1", new ut.Tile("R", 120, 120, 120), imagesClass.imageTile("CHARS", 5, 1));
	this.addTile("IMPERIAL_ROBOT_2", new ut.Tile("R", 0, 255, 255), imagesClass.imageTile("CHARS", 6, 1));
	this.addTile("IMPERIAL_ROBOT_3", new ut.Tile("R", 255, 0, 0), imagesClass.imageTile("CHARS", 7, 1));

	this.addTile("AT", new ut.Tile("@", 0, 0, 255), imagesClass.imageTile("CHARS", 1, 0));
	
	//Items

	this.addTile("BLASTER_PISTOL", new ut.Tile("{", 255, 255, 0), imagesClass.imageTile("ITEMS", 0, 0));
	this.addTile("HEAVY_BLASTER_PISTOL", new ut.Tile("{", 0, 255, 255), imagesClass.imageTile("ITEMS", 1, 0));
	
	this.addTile("BLASTER_RIFLE", new ut.Tile("}", 255, 255, 0), imagesClass.imageTile("ITEMS", 2, 0));
	this.addTile("HEAVY_BLASTER_RIFLE", new ut.Tile("}", 0, 255, 255), imagesClass.imageTile("ITEMS", 3, 0));	
	this.addTile("LASER_RIFLE", new ut.Tile("}", 0, 255, 0), imagesClass.imageTile("ITEMS", 4, 0));
	
	this.addTile("ENERGY_STAFF", new ut.Tile("/", 120, 120, 120), imagesClass.imageTile("ITEMS", 5, 0));
	this.addTile("LIGHTSABER", new ut.Tile("/", 0, 255, 0), imagesClass.imageTile("ITEMS", 6, 0));

	this.addTile("TROOPER_ARMOR", new ut.Tile("]", 200, 200, 200), imagesClass.imageTile("ITEMS", 0, 1));
	this.addTile("BLACK_TROOPER_ARMOR", new ut.Tile("]", 100, 100, 100), imagesClass.imageTile("ITEMS", 1, 1));


	this.addTile("HEALTH_POTION", new ut.Tile("+", 255, 0, 0), imagesClass.imageTile("ITEMS", 0, 2));
	this.addTile("EXTRA_HEALTH_POTION", new ut.Tile("+", 0, 255, 0), imagesClass.imageTile("ITEMS", 1, 2));
	this.addTile("GAIN_STRENGTH_POTION", new ut.Tile("+", 255, 0, 255), imagesClass.imageTile("ITEMS", 2, 2));
	this.addTile("GAIN_VITALITY_POTION", new ut.Tile("+", 0, 255, 255), imagesClass.imageTile("ITEMS", 3, 2));

	// Projectiles
	this.addTile("P1", new ut.Tile("/", 255, 0, 0), imagesClass.imageTile("ITEMS", 3, 1));
	this.addTile("P2", new ut.Tile("|", 255, 0, 0), imagesClass.imageTile("ITEMS", 3, 1));
	this.addTile("P3", new ut.Tile("\\", 255, 0, 0), imagesClass.imageTile("ITEMS", 3, 1));
	this.addTile("P4", new ut.Tile("-", 255, 0, 0), imagesClass.imageTile("ITEMS", 3, 1));
	this.addTile("HIT", new ut.Tile("*", 255, 0, 0), imagesClass.imageTile("ITEMS", 3, 1));
	
	//Terrain
	this.addTerrainTile("W1", new ut.Tile('#', 170, 170, 170), true, true,false, imagesClass.imageTile("TERRAIN", 0, 0));
	this.addTerrainTile("F1",  new ut.Tile('.', 170, 170, 170), false, false,false, imagesClass.imageTile("TERRAIN", 1, 0));
	this.addTerrainTile("W2", new ut.Tile('#', 170, 170, 170), true, true,false, imagesClass.imageTile("TERRAIN", 0, 1));
	this.addTerrainTile("F2",  new ut.Tile('.', 0, 255, 255), false, false,false, imagesClass.imageTile("TERRAIN", 1, 1));
	this.addTerrainTile("W3", new ut.Tile('#', 100, 100, 255), true, true,false, imagesClass.imageTile("TERRAIN", 0, 2));
	this.addTerrainTile("F3",  new ut.Tile('.', 170, 170, 170), false, false,false, imagesClass.imageTile("TERRAIN", 1, 2));
	this.addTerrainTile("W4", new ut.Tile('#', 100, 100, 255), true, true,false, imagesClass.imageTile("TERRAIN", 0, 3));
	this.addTerrainTile("F4",  new ut.Tile('.', 170, 170, 170), false, false,false, imagesClass.imageTile("TERRAIN", 1, 3));
	this.addTerrainTile("W5", new ut.Tile('#', 120, 120, 255), true, true,false, imagesClass.imageTile("TERRAIN", 	5, 0));
	this.addTerrainTile("F5",  new ut.Tile('.', 170, 170, 170), false, false,false, imagesClass.imageTile("TERRAIN", 6, 0));
	this.addTerrainTile("W6", new ut.Tile('#', 170, 170, 170), true, true,false, imagesClass.imageTile("TERRAIN", 5, 1));
	this.addTerrainTile("F6",  new ut.Tile('.', 70, 70, 70), false, false,false, imagesClass.imageTile("TERRAIN", 6, 1));
	
	this.addTerrainTile(">", new ut.Tile('>', 170, 0, 0), false, false, true, imagesClass.imageTile("TERRAIN", 0, 4));
	
	//Bloody terrain
	this.addTerrainTile("WB", new ut.Tile('#', 255, 0, 0), true, true,false, imagesClass.imageTile("TERRAIN", 0, -3));
	this.addTerrainTile("FB",  new ut.Tile('.', 255, 0, 0), false, false,false, imagesClass.imageTile("TERRAIN", 1, -3));
	
	// Overworld
	this.addTerrainTile("^", new ut.Tile('.', 0, 170, 0), false, false, false, imagesClass.imageTile("TERRAIN", 3, 0));
	this.addTerrainTile("t", new ut.Tile('T', 170, 55, 0), true, false, false, imagesClass.imageTile("TERRAIN", 11, 0));
	this.addTerrainTile("-", new ut.Tile('*', 170, 55, 0), true, true, false, imagesClass.imageTile("TERRAIN", 0, 6));
	this.addTerrainTile("w", new ut.Tile('~', 0, 0, 255), true, false, false, imagesClass.imageTile("TERRAIN", 6, 0));
}

Tiles.prototype.addTile = function(tileId, tile, imageTile){
	this.tiles[tileId] = tile;
	this.tiles[tileId].imageTile = imageTile;
};

Tiles.prototype.addTerrainTile = function(tileId, utTile, solid, opaque, downstairs, imageTile){
	var darkTile = new ut.Tile(utTile.getChar());
	darkTile.setColor(0, 0, 170);

	utTile.imageTile = imageTile;
	darkTile.imageTile = imageTile;
	
	this.terrainTiles[tileId] = {
		tileId: tileId,
		solid: solid,
		opaque: opaque,
		downstairs: downstairs,
		utTile: utTile,
		darkTile: darkTile,
		imageTile: imageTile
	};

	// Add memory tile, shade of Grey
	var memoryTile = utTile.clone();
	memoryTile.setColor(55, 55, 55);
	this.addTile("MEM_"+tileId, memoryTile, imageTile);	
};

Tiles.prototype.getTile = function(tileId){
	return this.tiles[tileId]; // I know, I know!
};

Tiles.prototype.getTerrainTile = function(tileId){
	return this.terrainTiles[tileId]; // I know, I know!
};

Tiles.prototype.getMemoryTile = function(tileId){
	var tile = this.getTile("MEM_"+tileId);
	return tile;
};
