function Tiles(){
	this.tiles = {};
	this.terrainTiles = {};
	this.AT = new ut.Tile("@", 255, 255, 255);

	//Monsters
	this.addTile("GIANT_ANT", new ut.Tile("A", 255, 255, 255));
	this.addTile("BAT", new ut.Tile("b", 170, 170, 170));
	this.addTile("CENTAUR", new ut.Tile("C", 170, 55, 0));
	this.addTile("DRAGON", new ut.Tile("D", 170, 0, 0));
	this.addTile("FLOATING_EYE", new ut.Tile("e", 0, 170, 170));
	this.addTile("VIOLET_FUNGI", new ut.Tile("F", 255, 55, 255));
	this.addTile("GNOME", new ut.Tile("g", 0, 170, 0));
	this.addTile("HOBGOBLIN", new ut.Tile("H", 170, 170, 170));
	this.addTile("INVISIBLE_STALKER", new ut.Tile("I", 255, 255, 255));
	this.addTile("JACKAL", new ut.Tile("j", 255, 255, 55));
	this.addTile("KOBOLD", new ut.Tile("k", 170, 55, 0));
	this.addTile("LEPRECHAUN", new ut.Tile("l", 0, 170, 0));
	this.addTile("MIMIC", new ut.Tile("m", 170, 0, 0));
	this.addTile("NYMPH", new ut.Tile("n", 55, 55, 255));
	this.addTile("ORC", new ut.Tile("o", 0, 170, 0));
	this.addTile("PURPLE_WORM", new ut.Tile("P", 255, 55, 255));
	this.addTile("QUASIT", new ut.Tile("q", 170, 0, 0));
	this.addTile("RUST_MONSTER", new ut.Tile("R", 55, 255, 55));
	this.addTile("SNAKE", new ut.Tile("s", 0, 170, 0));
	this.addTile("TROLL", new ut.Tile("T", 0, 170, 0));
	this.addTile("UMBER_HULK", new ut.Tile("U", 55, 55, 55));
	this.addTile("VAMPIRE", new ut.Tile("v", 55, 55, 55));
	this.addTile("WRAITH", new ut.Tile("w", 55, 55, 55));
	this.addTile("XORN", new ut.Tile("x", 170, 0, 0));
	this.addTile("YETI", new ut.Tile("Y", 255, 255, 255));
	this.addTile("ZOMBIE", new ut.Tile("z", 170, 55, 0));

	this.addTile("RODNEY", new ut.Tile("☺", 0, 255, 0));

	this.addTile("AT", new ut.Tile("@", 0, 0, 255));
	
	this.addTile("ARNOLD", new ut.Tile("@", 255, 0, 0));
	this.addTile("TOY", new ut.Tile("@", 0, 255, 0));
	this.addTile("LANE", new ut.Tile("@", 0, 0, 255));
	this.addTile("MANGO", new ut.Tile("@", 255, 0, 255));
	
	//Items
	this.addTile("DAGGER", new ut.Tile(")", 255, 255, 255));
	this.addTile("STAFF", new ut.Tile("/", 255, 255, 55));
	this.addTile("LONG_SWORD", new ut.Tile(")", 255, 255, 255));
	this.addTile("MACE", new ut.Tile(")", 255, 255, 255));
	this.addTile("SPEAR", new ut.Tile(")", 255, 255, 255));
	this.addTile("CLAYMORE", new ut.Tile(")", 255, 255, 255));
	
	this.addTile("LEATHER", new ut.Tile("]", 255, 255, 55));
	this.addTile("STUDDED", new ut.Tile("]", 255, 255, 55));
	this.addTile("RING", new ut.Tile("]", 170, 170, 170));
	this.addTile("SCALE", new ut.Tile("]", 170, 255, 170));
	this.addTile("CHAIN", new ut.Tile("]", 170, 170, 170));
	this.addTile("SPLINT", new ut.Tile("]", 55, 255, 255));
	this.addTile("BANDED", new ut.Tile("]", 255, 55, 255));
	this.addTile("PLATE", new ut.Tile("]", 255, 255, 255));
	
	this.addTile("TORCH", new ut.Tile("/", 255, 255, 55));
	this.addTile("LANTERN", new ut.Tile("/", 255, 170, 170));
	
	this.addTile("HEALTH_POTION", new ut.Tile("!", 255, 0, 0));
	this.addTile("EXTRA_HEALTH_POTION", new ut.Tile("!", 0, 255, 0));
	this.addTile("GAIN_STRENGTH_POTION", new ut.Tile("!", 0, 0, 255));
	this.addTile("GAIN_VITALITY_POTION", new ut.Tile("!", 255, 255, 255));
	this.addTile("YENDOR", new ut.Tile("\"", 255, 255, 55));
	
	//Terrain
	this.addTerrainTile("#", new ut.Tile('#', 170, 170, 170), true, true,false);
	this.addTerrainTile(".",  new ut.Tile('.', 170, 170, 170), false, false,false);
	this.addTerrainTile("*", new ut.Tile('#', 255, 0, 0), true, true,false);
	this.addTerrainTile(",",  new ut.Tile('.', 255, 0, 0), false, false,false);
	this.addTerrainTile(">", new ut.Tile('>', 170, 0, 0), false, false, true);
	
	this.addTerrainTile("^", new ut.Tile('.', 0, 170, 0), false, false, false);
	this.addTerrainTile("t", new ut.Tile('T', 170, 55, 0), true, false, false);
	this.addTerrainTile("-", new ut.Tile('*', 170, 55, 0), true, true, false);
	this.addTerrainTile("w", new ut.Tile('~', 0, 0, 255), true, false, false);
}

Tiles.prototype.addTile = function(tileId, tile){
	this.tiles[tileId] = tile;
};

Tiles.prototype.addTerrainTile = function(tileId, utTile, solid, opaque, downstairs){
	var darkTile = new ut.Tile(utTile.getChar());
	darkTile.setColor(0, 0, 170);

	this.terrainTiles[tileId] = {
		tileId: tileId,
		solid: solid,
		opaque: opaque,
		downstairs: downstairs,
		utTile: utTile,
		darkTile: darkTile
	};

	// Add memory tile, shade of Grey
	var memoryTile = utTile.clone();
	memoryTile.setColor(55, 55, 55);
	this.addTile("MEM_"+tileId, memoryTile);	
};

Tiles.prototype.getTile = function(tileId){
	return this.tiles[tileId]; // I know, I know!
};

Tiles.prototype.getTerrainTile = function(tileId){
	return this.terrainTiles[tileId]; // I know, I know!
};

Tiles.prototype.getMemoryTile = function(tileId){
	return this.getTile("MEM_"+tileId);
};
