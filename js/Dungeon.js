function Dungeon(){
	this.enemies = new Array();
	this.items = new Array();
	this.currentDepth = 1; 
}
         
Dungeon.prototype.getMapTile = function (x,y){
	var t = "";
	try { 
		t = this.map[x][y]; 
	}
	catch(err) {
		return null; 
	}
	return JSRL.tiles.getTerrainTile(t);
};

Dungeon.prototype.getHeight = function (x,y){
	return this.map[0].length;
};

Dungeon.prototype.getWidth = function (x,y){
	return this.map.length;
};

Dungeon.prototype.getDisplayedTile = function (x, y) {
	// Terrain
	var t = "";
	try {
		t = this.map[x][y]; 
	} catch(err) {
		return ut.NULLTILE; 
	}
	var ret = false;
	if (JSRL.player.isSeeing(x,y)){
		// Enemies
		var enemy = this.getEnemy(x,y); 
		if (enemy){
			if (enemy.monsterId === "MIMIC" && !enemy.wasHit)
				ret = JSRL.tiles.getTerrainTile(">").utTile;
			else if (enemy.monsterId != "INVISIBLE_STALKER")
				ret = JSRL.tiles.getTile(enemy.tileId);
			else if (JSRL.player.getLightRange() > 0){
				ret = JSRL.tiles.getTerrainTile(t).utTile;
			} else {
				ret = JSRL.tiles.getTerrainTile(t).darkTile;
				ret.itType = 1;
			}
		} else {
			// Items
			var item = this.getItem(x,y); 
			if (item){
				ret = JSRL.tiles.getTile(item.itemId);
			} else {
				// Terrain
				if (JSRL.player.getLightRange() > 0){
					ret = JSRL.tiles.getTerrainTile(t).utTile;
					ret.itType = 0;
				}else{
					ret = JSRL.tiles.getTerrainTile(t).darkTile;
					ret.itType = 1;
				}
			}
		}
	} else if (JSRL.player.remembers(x,y)){
		ret = JSRL.tiles.getMemoryTile(t);
		ret.itType = 2;
	} else 
		ret = ut.NULLTILE;
	if (!ret){
		// console.log("Invalid tile at "+x+","+y);
		return ut.NULLTILE;

	}
	return ret;
};

Dungeon.prototype.getTerrainTile = function (x, y) {
	// Terrain
	var t = "";
	try {
		t = this.map[x][y]; 
	} catch(err) {
		return ut.NULLTILE; 
	}
	var ret = false;
	if (JSRL.player.isSeeing(x,y)){
		if (JSRL.player.getLightRange() > 0){
			if (!JSRL.tiles.getTerrainTile(t)){
				console.log("invalid terrain tile: "+t);
			}
			ret = JSRL.tiles.getTerrainTile(t).utTile;
			ret.itType = 0;
		}else{
			ret = JSRL.tiles.getTerrainTile(t).darkTile;
			ret.itType = 1;
		}
	} else if (JSRL.player.remembers(x,y)){
		ret = JSRL.tiles.getMemoryTile(t);
		ret.itType = 2;
	} else 
		ret = ut.NULLTILE;
	if (!ret){
		// console.log("Invalid tile at "+x+","+y);
		return ut.NULLTILE;

	}
	return ret;
};

Dungeon.prototype.getOverlayTile = function (x, y) {
	// Terrain
	var t = "";
	try {
		t = this.map[x][y]; 
	} catch(err) {
		return ut.NULLTILE; 
	}
	var ret = false;
	if (JSRL.player.isSeeing(x,y)){
		// Enemies
		var enemy = this.getEnemy(x,y); 
		if (enemy){
			if (enemy.monsterId === "MIMIC" && !enemy.wasHit)
				ret = JSRL.tiles.getTerrainTile(">").utTile;
			else if (enemy.monsterId != "INVISIBLE_STALKER"){
				ret = JSRL.tiles.getTile(enemy.tileId);
				ret.imageTile.flipped = enemy.flipped;
			} else
				return ut.NULLTILE; 
		} else {
			// Items
			var item = this.getItem(x,y); 
			if (item){
				ret = JSRL.tiles.getTile(item.itemId);
			} else {
				return ut.NULLTILE; 
			}
		}
	} else 
		ret = ut.NULLTILE;
	if (!ret){
		// console.log("Invalid tile at "+x+","+y);
		return ut.NULLTILE;

	}
	return ret;
};

Dungeon.prototype.addEnemy = function (enemy, place){
	enemy.position = {x: place.x, y: place.y};
	this.enemies.push(enemy);
};

Dungeon.prototype.addItem = function (item, place){
	item.position = {x: place.x, y: place.y};
	this.items.push(item);
};

Dungeon.prototype.getEnemy = function (x, y){
	for (var i = 0; i < this.enemies.length; i++){
		if (this.enemies[i].position.x === x && this.enemies[i].position.y === y)
			return this.enemies[i];
	}
	return false;
};

Dungeon.prototype.isFree = function (position){
	var x = position.x;
	var y = position.y;
	return !this.getEnemy(x, y) && !this.getMapTile(x, y).solid;
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
		//console.log("No tile at "+destinationPosition.x+","+destinationPosition.y);
		return;
	}
	if (tile.solid || 
			this.getEnemy(destinationPosition.x, destinationPosition.y) ){
		// Bump!
	} else {
		if (enemy.position.x != destinationPosition.x){
			enemy.flipped = enemy.position.x < destinationPosition.x;
		}
		enemy.position.x = destinationPosition.x;
		enemy.position.y = destinationPosition.y;
	}
};

Dungeon.prototype.dungeonTurn = function(){
	for (var i = 0; i < this.enemies.length; i++){
		var relayed = this.enemies[i].enemyAI();
		if (!this.enemies[i])
			continue;
		if (this.enemies[i].doubleSpeed){
			var relayed2 = this.enemies[i].enemyAI();
			relayed = relayed || relayed2;
		}
		this.enemies[i].acting = relayed;
	}
	if (JSRL.ui.pendingProjectiles.length > 0){
		JSRL.ui.nextEnemyProjectile()
	}
};

Dungeon.prototype.generateLevel= function(depth){
	if (Rodney.mixPanelEnabled)
		mixpanel.track("Generate Level", {"depth": depth});
	JSRL.itemFactory.setThresholds(depth);
	var generationResults = JSRL.dungeonGenerator.createLevel(depth);
	JSRL.player.position = generationResults.entrancePosition;	
	JSRL.player.updateFOV();
};

Dungeon.prototype.setMap = function(map){
	this.map = map;
	JSRL.player.resetMemoryMap();
	//JSRL.player.resetFOVMasks();
};

Dungeon.prototype.downstairs = function(){
	this.currentDepth++;
	JSRL.ui.showMessage('You climb to floor '+this.currentDepth);
	JSRL.websocket.sendNewDepthMessage();
	this.enemies = new Array();
	this.items = new Array();
	this.generateLevel(this.currentDepth);
	if (this.currentDepth == 20){
		JSRL.ui.showBlueprintsScene();
	} else if (this.currentDepth == 25){
		JSRL.ui.endGame();
	} else if (this.currentDepth % 2 == 1)
		JSRL.ui.selectAdvancement();
};

Dungeon.prototype.createTownLevel = function(){
	var map = [
"--------------------------------------------------------------------------",
"-^^^^^^^^^^t^^^^^^^^^^^^^^^^t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^wwwwwwwwwww------",
"-^t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^www^^^^^-----wwwwwww",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^t^^^^^^^^^^^^^^^^^^^^www^^^^^^-------------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^www^^^^^^^^-------------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^------------",
"-^^^^^^^^^^^^t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^-----------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^^^^----------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^www^^^^^^^^^^^t^^^^^^---------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^wwwwwwwwwww^^^^^^^^^^^^^^^^^^^^^--------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^wwwww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^wwww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^-----",
"-^^^^^^^^^^^^^^^^^^^^^^^www^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^---",
"-^^^^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--",
"-^^^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--",
"-^^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--",
"-^^^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^t^^^^^^^^---",
"-^^^^^^t^^^^^^^^^^^^w^^^^^^t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--------",
"-^^^^^^^^^^^^^^^^^ww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^---------",
"-^^^^^^^^^^^^^^^w^^^^^^^^^^^^^^^^^^^^^^^^^^t^^^^^^^^^^^^^^^^^^^^----------",
"-^^^^^^^^^^^wwwww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^----------",
"-^^^^^^^^wwww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^t^^^^^^^^----------",
"-^^^^^wwww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^t^^^^^^^^^---------",
"-^^^www^^^^^^^^^^^t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^---------",
"-^www^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^--------",
"-ww^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^-------",
"-w^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^-------",
"-^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^t^^^^^^^^^^^^^^^^^^^^^^^^^^^^^----------",
"--------------------------------------------------------------------------"
	];
	
	var search = true;
	var position = null;
	while (search){
		position = {
			x: Math.floor(Math.random()*60),
			y: Math.floor(Math.random()*60)
		};
		
		try{
			var tile = map[position.x][position.y];
			if (tile === "^")
				search = false;
		}catch (err){
			search = true;
		}
	}
	
	JSRL.player.position = position;
	this.setMap(map);
	JSRL.player.updateFOV();
};

Dungeon.prototype.splashBlood = function(position, splashSize){
	this.addBlood(position);
	if (splashSize > 1){
		if (chance(30)) this.addBlood({x: position.x + 1, y: position.y +1});
		if (chance(30)) this.addBlood({x: position.x - 1, y: position.y +1});
		if (chance(30)) this.addBlood({x: position.x + 0, y: position.y +1});
		if (chance(30)) this.addBlood({x: position.x + 1, y: position.y -1});
		if (chance(30)) this.addBlood({x: position.x - 1, y: position.y -1});
		if (chance(30)) this.addBlood({x: position.x + 0, y: position.y -1});
		if (chance(30)) this.addBlood({x: position.x + 1, y: position.y +0});
		if (chance(30)) this.addBlood({x: position.x - 1, y: position.y +0});
	}

};

Dungeon.prototype.addBlood = function(position){
	var tile = this.getMapTile(position.x, position.y);
	/*if (tile.tileId === ".")
		this.changeTile(position, ',');
	else if (tile.tileId === "#")
		this.changeTile(position, '*');*/
};

Dungeon.prototype.hasBlood = function(position){
	var tile = this.getMapTile(position.x, position.y);
	return tile.tileId === "," || tile.tileId === "*";
};

Dungeon.prototype.changeTile = function (position, tile){
	this.map[position.x][position.y] = tile;
};

Dungeon.prototype.getFreePlace = function(){
	while(true){
		var place = {x: 0, y:0};
		place.x = rand(1,this.getWidth()-2);
		place.y = rand(1,this.getHeight()-2);
		var cell = this.getMapTile(place.x, place.y);
		if (cell.solid)
			continue;
		if (cell.downstairs)
			continue;
		var enemy = this.getEnemy(place.x, place.y);
		if (enemy)
			continue;
		var item = this.getItem(place.x, place.y);
		if (item)
			continue;
		return place;	
	}
};

Dungeon.prototype.isWalkable = function(place){
	var cell = this.getMapTile(place.x, place.y);
	if (cell.solid)
		return false;
	var enemy = this.getEnemy(place.x, place.y);
	if (enemy)
		return false;
	return true;
};