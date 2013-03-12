function Tiles(){
	this.tiles = {};
	this.terrainTiles = {};
	this.AT = new ut.Tile("@", 255, 255, 255);

	//Monsters
	this.addTile("GIANT_ANT", new ut.Tile("A", 255, 255, 255));
	this.addTile("BAT", new ut.Tile("B", 255, 255, 255));
	this.addTile("CENTAUR", new ut.Tile("C", 255, 255, 255));
	this.addTile("DRAGON", new ut.Tile("D", 255, 255, 255));
	this.addTile("FLOATING_EYE", new ut.Tile("E", 255, 255, 255));
	this.addTile("VIOLET_FUNGI", new ut.Tile("F", 255, 255, 255));
	this.addTile("GNOME", new ut.Tile("G", 255, 255, 255));
	this.addTile("HOBGOBLIN", new ut.Tile("H", 255, 255, 255));
	this.addTile("INVISIBLE_STALKER", new ut.Tile("I", 255, 255, 255));
	this.addTile("JACKAL", new ut.Tile("J", 255, 255, 255));
	this.addTile("KOBOLD", new ut.Tile("K", 255, 255, 255));
	this.addTile("LEPRECHAUN", new ut.Tile("L", 255, 255, 255));
	this.addTile("MIMIC", new ut.Tile("M", 255, 255, 255));
	this.addTile("NYMPH", new ut.Tile("N", 255, 255, 255));
	this.addTile("ORC", new ut.Tile("O", 255, 255, 255));
	this.addTile("PURPLE_WORM", new ut.Tile("P", 255, 255, 255));
	this.addTile("QUASIT", new ut.Tile("Q", 255, 255, 255));
	this.addTile("RUST_MONSTER", new ut.Tile("R", 255, 255, 255));
	this.addTile("SNAKE", new ut.Tile("S", 255, 255, 255));
	this.addTile("TROLL", new ut.Tile("T", 255, 255, 255));
	this.addTile("UMBER_HULK", new ut.Tile("U", 255, 255, 255));
	this.addTile("VAMPIRE", new ut.Tile("V", 255, 255, 255));
	this.addTile("WRAITH", new ut.Tile("W", 255, 255, 255));
	this.addTile("XORN", new ut.Tile("X", 255, 255, 255));
	this.addTile("YETI", new ut.Tile("Y", 255, 255, 255));
	this.addTile("ZOMBIE", new ut.Tile("Z", 255, 255, 255));
	
	this.addTile("AT", new ut.Tile("@", 255, 255, 255));
	
	//Items
	this.addTile("DAGGER", new ut.Tile(")", 255, 255, 255));
	this.addTile("LEATHER", new ut.Tile("]", 255, 255, 255));
	
	
	//Terrain
	this.addTerrainTile("#", new ut.Tile('#', 100, 100, 100), true, true,false);
	this.addTerrainTile(".",  new ut.Tile('.', 50, 50, 50), false, false,false);
	this.addTerrainTile(">", new ut.Tile('>', 0, 255, 0), false, false, true);
}

Tiles.prototype.addTile = function(tileId, tile){
	this.tiles[tileId] = tile;
};

Tiles.prototype.addTerrainTile = function(tileId, utTile, solid, opaque, downstairs){
	this.terrainTiles[tileId] = {
		solid: solid,
		opaque: opaque,
		downstairs: downstairs,
		utTile: utTile
	};

	// Add memory tile, shade of Red
	var memoryTile = utTile.clone();
	memoryTile.setColor(utTile.getColorJSON().r, 0, 0);
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
