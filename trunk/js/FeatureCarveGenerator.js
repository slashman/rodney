function FeatureCarveGenerator(){
	DungeonGenerator.call(this);
	this.preLevel;
	this.mask;
	this.preLevelB;
	this.maskB;
	this.hotspots = new Array();
	this.corridorTip;
	this.startingPosition;
}
FeatureCarveGenerator.prototype = new DungeonGenerator();
FeatureCarveGenerator.prototype.constructor = FeatureCarveGenerator;

FeatureCarveGenerator.prototype.createLevel = function (depth){
	var rodneyLevel = false;
	if (depth > 25 && chance(80) && !JSRL.player.rodneyGenerated){
		rodneyLevel = true;
	}
	var addExit = !rodneyLevel;
	var map = this.generateLevel(9, '#', '.', '.', 60, 60, addExit);
	if (rodneyLevel){
		var rodney = JSRL.monsterFactory.createMonster("RODNEY");
		rodney.isUnique = true;
		JSRL.dungeon.addEnemy(rodney, this.getFreePlace());
		JSRL.player.rodneyGenerated = true;
	}
	this.addCritters(depth);
	this.addItems(depth);
	return { entrancePosition: this.startingPosition, map: map };
};

FeatureCarveGenerator.prototype.addCritters = function(depth){
	var crits = rand(5,10) + depth * 2;
	var ecosystem = JSRL.monsterFactory.getEcosystem(depth);
	for (var i = 0; i < crits; i++){
		var enemyId = randomElementOf(ecosystem);
		JSRL.dungeon.addEnemy(JSRL.monsterFactory.createMonster(enemyId), this.getFreePlace());
	}
};

FeatureCarveGenerator.prototype.addItems = function(depth){
	var crits = rand(5,10);
	for (var i = 0; i < crits; i++){
		// JSRL.dungeon.addItem(JSRL.itemFactory.createItem("DAGGER"), this.getFreePlace());
		// JSRL.dungeon.addItem(JSRL.itemFactory.createItem("LEATHER"), this.getFreePlace());
		JSRL.dungeon.addItem(JSRL.itemFactory.createItem("TORCH"), this.getFreePlace());

	}
};

FeatureCarveGenerator.prototype.getFreePlace = function(){
	while(true){
		var place = {x: 0, y:0};
		place.x = rand(1,this.getLevelWidth()-2);
		place.y = rand(1,this.getLevelHeight()-2);
		if (this.isExitPlaceable(place)){
			return place;
		}
	}
};


FeatureCarveGenerator.prototype.save = function(){
	for (var i = 0; i < this.mask.length; i++){
		this.maskB[i]=this.mask[i].slice();
		this.preLevelB[i]=this.preLevel[i].slice();
	};
};
	
FeatureCarveGenerator.prototype.rollBack = function (){
	for (var i = 0; i < this.mask.length; i++){
		this.mask[i]=this.maskB[i].slice();
		this.preLevel[i]=this.preLevelB[i].slice();
	};
};

FeatureCarveGenerator.prototype.generateLevel = function (numberOfRooms, solidCellTile, floorTile, corridorTile, xdim, ydim, addExit) {
	var pendingRooms = numberOfRooms;
	this.preLevel = new Array(xdim);
	this.mask = new Array(xdim);
	this.preLevelB = new Array(xdim);
	this.maskB = new Array(xdim);
	
	var ret;
	var checked = false;
	var placed = false;
	var i = 0;
	go: while (!checked) {
		this.hotspots.length = 0;
		//Fill the level with solid element
		for (var x = 0; x < xdim; x++){
			for (var y = 0; y < ydim; y++){
				if (!this.preLevel[x]){
					this.preLevel[x] = new Array();
					this.mask[x] = new Array();
				}
				this.preLevel[x][y] = solidCellTile;
				this.mask[x][y] = false;
			};
		}
			
		//Dig out a single room or a feature in the center of the map
		var pos = {x: this.getLevelWidth() / 2, y: this.getLevelHeight() / 2};
		var direction = 0;
		var finished = false;
			
		while (!placed){
 			direction = randomElementOf(DIRECTIONS);
 			var randomWidth = rand(5, 10);
 			var randomHeight = rand(5, 10);
			if (this.carveRoom(pos, direction, solidCellTile, floorTile, randomWidth, randomHeight)){
				pendingRooms--;
				if (pendingRooms === 0){
					finished = true;
					checked = true;
				}
				placed = true;
			} else {
				i++;
				if (i > 50){
	 				i = 0;
	 				//continue go;
	 				return;
	 			}
			}
		}
			
		placed = false;
		this.save();
		var letsRollBack = false;
		while (!finished){
			pos = randomElementOf(this.hotspots);
			// Try to make a branch (corridor + room)
			var corridors = rand(1,3);
			var j = 0;
			while (j<corridors && !letsRollBack){
				var length = rand(4,5);
	 			direction = randomElementOf(DIRECTIONS);
				if (this.carveCorridor(pos, direction, corridorTile, length)){
					j++;
					pos = this.corridorTip;
				} else {
					letsRollBack = true;
				};
			}
			if (letsRollBack){
				this.rollBack();
				letsRollBack = false;
				continue;
			}
			var randomWidth = rand(5, 10);
 			var randomHeight = rand(5, 10);
			
			// direction is kept from the last corridor
			if (this.carveRoom(pos, direction, solidCellTile, floorTile, randomWidth, randomHeight)){
				this.save();
				pendingRooms--;
				if (pendingRooms === 0){
					finished = true;
					checked = true;
				}
				placed = true;
			} else {
				this.rollBack();
				i++;
				if (i > 50){
	 				i = 0;
	 				//continue go;
	 				return;
	 			}
			}
			placed = false;
		};
	}
	
	var levelMap = new Array();
	for (var y = 0; y < this.getLevelHeight(); y++){
		for (var x = 0; x < this.getLevelWidth(); x++){
			if (levelMap[y] == null) 
				levelMap[y] = this.preLevel[x][y]; 
			else levelMap[y] += this.preLevel[x][y];  
		}
	}		
	ret = levelMap;
	if (addExit){
		var entrance = {x: 0, y: 0};
		var exit = {x: 0, y: 0};
		while (true){
			entrance.x = rand(1,this.getLevelWidth()-2);
			entrance.y = rand(1,this.getLevelHeight()-2);
			exit.x = rand(1,this.getLevelWidth()-2);
			exit.y = rand(1,this.getLevelHeight()-2);
			if (distance(entrance.x, entrance.y, exit.x, exit.y) < xdim / 4)
				continue;
			if (!this.isExitPlaceable(entrance) ||
				!this.isExitPlaceable(exit)){
				continue;
			}
			this.addEntrance(ret, entrance);
			this.addExit(ret, exit);
			break;
		}
	} else {
		var entrance = {x: 0, y: 0};
		while (true){
			entrance.x = rand(1,this.getLevelWidth()-2);
			entrance.y = rand(1,this.getLevelHeight()-2);
			if (!this.isExitPlaceable(entrance)){
				continue;
			}
			this.addEntrance(ret, entrance);
			break;
		}
	}
	
	return ret;
};
	
FeatureCarveGenerator.prototype.addExit = function (ret, exit){
	ret[exit.y] = ret[exit.y].replaceAt(exit.x, '>');
};

FeatureCarveGenerator.prototype.addEntrance = function (ret, entrance){
	this.startingPosition = entrance;
//	ret [entrance.x] = ret [entrance.x].replaceAt(entrance.y, '<'); No way up pals
};

FeatureCarveGenerator.prototype.isExitPlaceable = function (position){
	return this.preLevel[position.x][position.y] === '.';
};

FeatureCarveGenerator.prototype.getLevelWidth = function (){
	return this.preLevel.length;
};
	
FeatureCarveGenerator.prototype.getLevelHeight = function (){
	return this.preLevel[0].length;
};

FeatureCarveGenerator.prototype.isValid = function(x, y){
	return x > 0 && y > 0 && x < this.getLevelWidth() && y < this.getLevelHeight();
};

FeatureCarveGenerator.prototype.printMap = function (){
	console.log("Map");

	for (var y = 0; y < this.getLevelHeight(); y++){
		var line = '';
		for (var x = 0; x < this.getLevelWidth(); x++){
			line+= this.preLevel[x][y];
		}
		console.log(line);
	}
	
	console.log("Mask");

	for (var y = 0; y < this.getLevelHeight(); y++){
		var line = '';
		for (var x = 0; x < this.getLevelWidth(); x++){
			line+= this.mask[x][y] ? '*' : '-';
		}
		console.log(line);
	}
};

// Features
FeatureCarveGenerator.prototype.carveRoom = function (where, direction, solidCellTile, floorTile, width, height){
	var rndPin = 0;
	var start = {x: 0, y: 0};
	switch (direction){
		case "UP":
			rndPin = rand(1,width-2);
			start.x = where.x - rndPin;
			start.y = where.y - height + 1;
			break;
		case "DOWN":
			rndPin = rand(1,width-2);
			start.x = where.x - rndPin;
			start.y = where.y;
			break;
		case "LEFT":
			rndPin = rand(1,height-2);
			start.x = where.x - width + 1;
			start.y = where.y - rndPin;
			break;
		case "RIGHT":
			rndPin = rand(1,height-2);
			start.x = where.x;
			start.y = where.y - rndPin;
			break;
	}
	//Check the mask
	for (var x = start.x; x < start.x + width; x++){
		for (var y = start.y; y < start.y + height; y++){
			if (!this.isValid(x,y) || this.mask[x][y]){
				return false;
			}
		}
	}
	
	//Carve
	for (var x = start.x; x < start.x + width; x++){
		for (var y = start.y; y < start.y + height; y++){
			if (x==start.x || x == start.x + width-1 ||
				y==start.y || y == start.y + height-1 
			){
				this.mask[x][y] = true;
				if ((x > start.x + 1 && x < start.x + width - 2) ||
					 (y > start.y + 1 && y < start.y + height- 2))
					this.hotspots.push({x: x, y: y});
			} else {
				this.preLevel[x][y]=floorTile;
				this.mask[x][y] = true;
			}
		}
	}
	return true;
};

FeatureCarveGenerator.prototype.carveCorridor = function(where, direction, floor, length){
	var start = {x: 0, y: 0};
	switch (direction){
	case "UP":
		start.x = where.x;
		start.y = where.y - length +1;
		break;
	case "DOWN":
		start.x = where.x;
		start.y = where.y;
		break;
	case "LEFT":
		start.x = where.x - length + 1;
		start.y = where.y;
		break;
	case "RIGHT":
		start.x = where.x;
		start.y = where.y;
		break;
	}
	//Check the mask
	if (direction === "UP" || direction === "DOWN"){
		for (var y = start.y; y < start.y + length; y++){
			if (!this.isValid(start.x,y) ||
				!this.isValid(start.x-1,y) ||
				!this.isValid(start.x+1,y))
				return false;
		}
		for (var y = start.y+1; y < start.y + length -1; y++){
			if (this.mask[start.x][y]){
				return false;
			}
		}
		
		//Carve
		for (var y = start.y; y < start.y + length; y++){
			this.preLevel[start.x][y]=floor;
		}
		
		for (var y = start.y+1; y < start.y + length-1; y++){
			this.mask[start.x-1][y] = true;
			this.mask[start.x][y] = true;
			this.mask[start.x+1][y] = true;
		}
		
		if (direction == "UP"){
			this.corridorTip = {x: start.x, y: start.y};
		} else {
			this.corridorTip = {x: start.x, y: start.y+length-1};
		}
		
	} else {
		for (var x = start.x; x < start.x + length; x++){
			if (!this.isValid(x,start.y) || 
				!this.isValid(x,start.y-1) ||
				!this.isValid(x,start.y+1))
				return false;
		}
		
		for (var x = start.x+1; x < start.x + length-1; x++){
			if (this.mask[x][start.y])
				return false;
		}
		
		//Carve
		for (var x = start.x; x < start.x + length; x++){
			this.preLevel[x][start.y]=floor;
		}
		
		for (var x = start.x+1; x < start.x + length-1; x++){
			this.mask[x][start.y-1] = true;
			this.mask[x][start.y] = true;
			this.mask[x][start.y+1] = true;
		}

		if (direction == "RIGHT"){
			this.corridorTip = {x: start.x+length-1, y: start.y};
		} else {
			this.corridorTip = {x: start.x, y: start.y};
		}
	}
	this.mask[this.corridorTip.x][this.corridorTip.y] = false;
	return true;
};
