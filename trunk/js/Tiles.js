function Tiles(imagesClass){
	this.tiles = {};
	this.terrainTiles = {};
	this.AT = new ut.Tile("@", 255, 255, 255);
	this.AT.imageTile = imagesClass.imageTile("CHARS", 2, 0);

	//Monsters
	this.addTile("GIANT_ANT", new ut.Tile("P", 255, 255, 255), imagesClass.imageTile("MONSTERS32", 1, 2));
	this.addTile("BAT", new ut.Tile("b", 170, 170, 170), imagesClass.imageTile("MONSTERS32", 7, 2));
	this.addTile("CENTAUR", new ut.Tile("B", 170, 55, 0), imagesClass.imageTile("MONSTERS48", 1, 0));
	this.addTile("DRAGON", new ut.Tile("D", 170, 0, 0), imagesClass.imageTile("MONSTERS48", 5, 0));
	this.addTile("FLOATING_EYE", new ut.Tile("s", 0, 170, 170), imagesClass.imageTile("MONSTERS32", 1, 5));
	this.addTile("VIOLET_FUNGI", new ut.Tile("F", 255, 55, 255), imagesClass.imageTile("MONSTERS48", 3, 3));
	this.addTile("GNOME", new ut.Tile("g", 0, 170, 0), imagesClass.imageTile("MONSTERS32", 9, 6));
	this.addTile("HOBGOBLIN", new ut.Tile("H", 170, 170, 170), imagesClass.imageTile("MONSTERS32", 0, 1));
	this.addTile("INVISIBLE_STALKER", new ut.Tile("I", 255, 255, 255));
	this.addTile("JACKAL", new ut.Tile("j", 255, 255, 55), imagesClass.imageTile("MONSTERS32", 7, 8));
	this.addTile("KOBOLD", new ut.Tile("l", 170, 55, 0), imagesClass.imageTile("MONSTERS32", 6, 4));
	this.addTile("LEPRECHAUN", new ut.Tile("l", 0, 170, 0), imagesClass.imageTile("MONSTERS32", 9, 7));
	this.addTile("MIMIC", new ut.Tile("m", 170, 0, 0), imagesClass.imageTile("MONSTERS48", 1, 1));
	this.addTile("NYMPH", new ut.Tile("n", 55, 55, 255), imagesClass.imageTile("MONSTERS32", 4, 3));
	this.addTile("ORC", new ut.Tile("o", 0, 170, 0), imagesClass.imageTile("MONSTERS32", 5, 1));
	this.addTile("PURPLE_WORM", new ut.Tile("P", 255, 55, 255), imagesClass.imageTile("MONSTERS48", 2, 3));
	this.addTile("QUASIT", new ut.Tile("q", 170, 0, 0), imagesClass.imageTile("MONSTERS32", 5, 4));
	this.addTile("RUST_MONSTER", new ut.Tile("R", 55, 255, 55), imagesClass.imageTile("MONSTERS48", 2, 2));
	this.addTile("SNAKE", new ut.Tile("s", 0, 170, 0), imagesClass.imageTile("MONSTERS32", 0, 8));
	this.addTile("TROLL", new ut.Tile("W", 0, 170, 0), imagesClass.imageTile("MONSTERS48", 6, 0));
	this.addTile("UMBER_HULK", new ut.Tile("U", 55, 55, 55), imagesClass.imageTile("MONSTERS48", 0, 2));
	this.addTile("VAMPIRE", new ut.Tile("w", 255, 55, 55), imagesClass.imageTile("MONSTERS32", 6, 3));
	this.addTile("WRAITH", new ut.Tile("w", 55, 55, 55), imagesClass.imageTile("MONSTERS32", 3, 2));
	this.addTile("XORN", new ut.Tile("x", 170, 0, 0), imagesClass.imageTile("MONSTERS48", 3, 2));
	this.addTile("YETI", new ut.Tile("m", 255, 255, 255), imagesClass.imageTile("MONSTERS32", 6, 5));
	this.addTile("ZOMBIE", new ut.Tile("z", 170, 55, 0), imagesClass.imageTile("MONSTERS32", 2, 1));

	this.addTile("RODNEY", new ut.Tile("☺", 0, 255, 0), imagesClass.imageTile("CHARS", 2, 0));

	this.addTile("AT", new ut.Tile("@", 0, 0, 255), imagesClass.imageTile("CHARS", 0, 2));
	
	this.addTile("ARNOLD", new ut.Tile("@", 255, 0, 0), imagesClass.imageTile("CHARS", 0, 0));
	this.addTile("TOY", new ut.Tile("@", 0, 255, 0), imagesClass.imageTile("CHARS", 0, 4));
	this.addTile("LANE", new ut.Tile("@", 0, 0, 255), imagesClass.imageTile("CHARS", 0, 1));
	this.addTile("MANGO", new ut.Tile("@", 255, 0, 255), imagesClass.imageTile("CHARS", 2, 2));
	
	//Items
	this.addTile("DAGGER", new ut.Tile(")", 255, 255, 255), imagesClass.imageTile("ITEMS", 1, 10));
	this.addTile("STAFF", new ut.Tile("/", 255, 255, 55), imagesClass.imageTile("ITEMS", 0, 14));
	this.addTile("LONG_SWORD", new ut.Tile(")", 255, 255, 255), imagesClass.imageTile("ITEMS", 0, 21));
	this.addTile("MACE", new ut.Tile(")", 255, 255, 255), imagesClass.imageTile("ITEMS", 1, 12));
	this.addTile("SPEAR", new ut.Tile(")", 255, 255, 255), imagesClass.imageTile("ITEMS", 0, 17));
	this.addTile("CLAYMORE", new ut.Tile(")", 255, 255, 255), imagesClass.imageTile("ITEMS", 8, 18));
	
	this.addTile("LEATHER", new ut.Tile("]", 255, 255, 55), imagesClass.imageTile("ITEMS", 1, 7));
	this.addTile("STUDDED", new ut.Tile("]", 255, 255, 55), imagesClass.imageTile("ITEMS", 2, 7));
	this.addTile("RING", new ut.Tile("]", 170, 170, 170), imagesClass.imageTile("ITEMS", 0, 7));
	this.addTile("SCALE", new ut.Tile("]", 170, 255, 170), imagesClass.imageTile("ITEMS", 8, 7));
	this.addTile("CHAIN", new ut.Tile("]", 170, 170, 170), imagesClass.imageTile("ITEMS", 8, 7));
	this.addTile("SPLINT", new ut.Tile("]", 55, 255, 255), imagesClass.imageTile("ITEMS", 7, 7));
	this.addTile("BANDED", new ut.Tile("]", 255, 55, 255), imagesClass.imageTile("ITEMS", 5, 7));
	this.addTile("PLATE", new ut.Tile("]", 255, 255, 255), imagesClass.imageTile("ITEMS", 6, 7));
	
	this.addTile("TORCH", new ut.Tile("/", 255, 255, 55), imagesClass.imageTile("ITEMS", 2, 2));
	this.addTile("LANTERN", new ut.Tile("/", 255, 170, 170), imagesClass.imageTile("ITEMS", 2, 2));
	
	this.addTile("HEALTH_POTION", new ut.Tile("!", 255, 0, 0), imagesClass.imageTile("ITEMS", 8, 2));
	this.addTile("EXTRA_HEALTH_POTION", new ut.Tile("!", 0, 255, 0), imagesClass.imageTile("ITEMS", 8, 0));
	this.addTile("GAIN_STRENGTH_POTION", new ut.Tile("!", 0, 0, 255), imagesClass.imageTile("ITEMS", 4, 1));
	this.addTile("GAIN_VITALITY_POTION", new ut.Tile("!", 255, 255, 255), imagesClass.imageTile("ITEMS", 3, 1));
	this.addTile("YENDOR", new ut.Tile("\"", 255, 255, 55), imagesClass.imageTile("ITEMS", 5, 1));
	
	//Terrain
	this.addTerrainTile("#", new ut.Tile('#', 170, 170, 170), true, true,false, imagesClass.imageTile("TERRAIN", 0, 3));
	this.addTerrainTile(".",  new ut.Tile('.', 170, 170, 170), false, false,false, imagesClass.imageTile("TERRAIN", 1, 3));
	this.addTerrainTile("*", new ut.Tile('#', 255, 0, 0), true, true,false, imagesClass.imageTile("TERRAIN", 0, -3));
	this.addTerrainTile(",",  new ut.Tile('.', 255, 0, 0), false, false,false, imagesClass.imageTile("TERRAIN", 1, -3));
	this.addTerrainTile(">", new ut.Tile('>', 170, 0, 0), false, false, true, imagesClass.imageTile("TERRAIN", 4, 3));
	
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
