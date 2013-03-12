function Dungeon(){
	this.enemies = new Array();
	this.items = new Array();
	this.currentDepth = 1; 
}
         
Dungeon.prototype.getMapTile = function (x,y){
	var t = "";
	try { 
		t = this.map[y][x]; 
	}
	catch(err) {
		return null; 
	}
	return JSRL.tiles.getTerrainTile(t);
};

Dungeon.prototype.getDisplayedTile = function (x, y) {
	// Terrain
	var t = "";
	try {
		t = this.map[y][x]; 
	} catch(err) {
		return ut.NULLTILE; 
	}
	
	if (JSRL.player.isSeeing(x,y)){
		// Enemies
		var enemy = this.getEnemy(x,y); 
		if (enemy){
			return JSRL.tiles.getTile(enemy.tileId);
		}
		// Items
		var item = this.getItem(x,y); 
		if (item){
			return JSRL.tiles.getTile(item.itemId);
		}
		// Terrain
		return JSRL.tiles.getTerrainTile(t).utTile;
	} else if (JSRL.player.remembers(x,y)){
		return JSRL.tiles.getMemoryTile(t);
	} else 
		return ut.NULLTILE;
};

Dungeon.prototype.addEnemy = function (enemy, place){
	this.enemies.push(enemy);
	enemy.position = {x: place.x, y: place.y};
};

Dungeon.prototype.addItem = function (item, place){
	this.items.push(item);
	item.position = {x: place.x, y: place.y};
};

Dungeon.prototype.getEnemy = function (x, y){
	for (var i = 0; i < this.enemies.length; i++){
		if (this.enemies[i].position.x === x && this.enemies[i].position.y === y)
			return this.enemies[i];
	}
	return false;
};

Dungeon.prototype.getItem = function (x, y){
	for (var i = 0; i < this.items.length; i++){
		if (this.items[i].position.x === x && this.items[i].position.y === y)
			return this.items[i];
	}
	return false;
};

Dungeon.prototype.removeEnemy = function(enemy){
	this.enemies.removeObject(enemy);
};

Dungeon.prototype.removeItem = function(item){
	this.items.removeObject(item);
};

Dungeon.prototype.tryMoveEnemyTo = function (enemy, destinationPosition){
	if (JSRL.player.position.x === destinationPosition.x && JSRL.player.position.y === destinationPosition.y){
		// Bump into player!
		enemy.attackPlayer();
		return;
	}
	var tile = this.getMapTile(destinationPosition.x, destinationPosition.y);
	if (!tile){
		console.log("No tile at "+destinationPosition.x+","+destinationPosition.y);
	}
	if (tile.solid || 
			this.getEnemy(destinationPosition.x, destinationPosition.y) ){
		// Bump!
	} else {
		enemy.position.x = destinationPosition.x;
		enemy.position.y = destinationPosition.y;
	}
};

Dungeon.prototype.dungeonTurn = function(){
	for (var i = 0; i < this.enemies.length; i++){
		this.enemies[i].enemyAI();
	}
};

Dungeon.prototype.generateLevel= function(depth){
	var generationResults = JSRL.dungeonGenerator.createLevel(depth);
	JSRL.player.position = generationResults.entrancePosition;
	this.map = generationResults.map;
};

Dungeon.prototype.downstairs = function(){
	this.currentDepth++;
	JSRL.ui.showMessage('You descend into level '+this.currentDepth);
	this.enemies = new Array();
	this.generateLevel(this.currentDepth);
	JSRL.player.resetFOVMasks();
	JSRL.player.resetMemoryMap();
	JSRL.ui.selectAdvancement();
};

Dungeon.prototype.createTownLevel = function(){
	var map = [
		"############################################################",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"#..........................................................#",
		"############################################################"
	];
	
	var search = true;
	var position = null;
	while (search){
		position = {
			x: Math.floor(Math.random()*60),
			y: Math.floor(Math.random()*60)
		};
		
		try{
			var tile = map[position.y][position.x];
			if (tile != "#")
				search = false;
		}catch (err){
			search = true;
		}
	}
	
	JSRL.player.position = position;
	this.map = map;
};
