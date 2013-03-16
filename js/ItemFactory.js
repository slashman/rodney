function ItemFactory(){
	this.itemDefinitions = {};
	this.thresholds = new Array();
	this.generationChanceTotal = 0;
	
	this.addWeaponDefinition("DAGGER", "Dagger", new Roll(1,6,0), 200, 30);
	this.addWeaponDefinition("STAFF", "Staff", new Roll(2,3,0), 100, 30);
	this.addWeaponDefinition("LONG_SWORD", "Long Sword", new Roll(3,4,0), 300, 15);
	this.addWeaponDefinition("MACE", "Mace", new Roll(2,4,0), 300, 15);
	this.addWeaponDefinition("SPEAR", "Spear", new Roll(1,8,0), 200, 5);
	this.addWeaponDefinition("CLAYMORE", "Claymore", new Roll(4,4,0), 400, 5);
	
	
	this.addArmorDefinition("LEATHER", "Leather armor", 4, 150, 30);
	this.addArmorDefinition("STUDDED", "Studded leather armor", 6, 150, 20);
	this.addArmorDefinition("RING", "Ring mail", 6, 200, 15);
	this.addArmorDefinition("SCALE", "Scale mail", 7, 200, 10);
	this.addArmorDefinition("CHAIN", "Chain mail", 8, 300, 10);
	this.addArmorDefinition("SPLINT", "Splint mail", 9, 300, 5);
	this.addArmorDefinition("BANDED", "Banded mail", 9, 400, 5);
	this.addArmorDefinition("PLATE", "Plate mail", 10, 600, 5);
	
	this.addLightsourceDefinition("TORCH", "Torch", 3, 200, 80);
	this.addLightsourceDefinition("LANTERN", "Lantern", 5, 300, 20);
	
	this.addPotionDefinition("HEALTH_POTION", "Healing Potion", 80);
	this.addPotionDefinition("EXTRA_HEALTH_POTION", "Extra Healing Potion", 15);
	this.addPotionDefinition("GAIN_STRENGTH_POTION", "Strength Potion", 5);
	
	this.addAccesoryDefinition("YENDOR", "The Amulet of Yendor", true, 0);
}

ItemFactory.prototype.addPotionDefinition = function (itemId, name, generationChance){
	this.itemDefinitions[itemId] = {
			itemId: itemId,
			tileId: itemId,
			name: name,
			generationChange: generationChance,
			type: "POTION"
		};
	this.pushThreshold(itemId, generationChance);
};

ItemFactory.prototype.pushThreshold = function(itemId, generationChance){
	this.generationChanceTotal += generationChance;
	this.thresholds.push({threshold: this.generationChanceTotal, itemId: itemId});
};

ItemFactory.prototype.addAccesoryDefinition = function (itemId, name, isUnique, generationChance){
	this.itemDefinitions[itemId] = {
			itemId: itemId,
			tileId: itemId,
			name: name,
			generationChange: generationChance,
			isUnique: isUnique,
			type: "ACCESORY"
		};
	this.pushThreshold(itemId, generationChance);
};

ItemFactory.prototype.addLightsourceDefinition = function (itemId, name, sightBonus, fuel, generationChance){
	this.itemDefinitions[itemId] = {
			itemId: itemId,
			tileId: itemId,
			name: name,
			sightBonus: sightBonus,
			fuel: fuel,
			generationChange: generationChance,
			type: "LIGHTSOURCE"
		};
	this.pushThreshold(itemId, generationChance);
};

ItemFactory.prototype.addWeaponDefinition = function (itemId, name, damageRoll, baseIntegrity, generationChance){
	this.itemDefinitions[itemId] = {
		itemId: itemId,
		tileId: itemId,
		name: name,
		damageRoll: damageRoll.clone(),
		baseIntegrity: baseIntegrity,
		generationChange: generationChance,
		type: "WEAPON"
	};
	this.pushThreshold(itemId, generationChance);
};

ItemFactory.prototype.addArmorDefinition = function (itemId, name, protectionValue, baseIntegrity, generationChance){
	this.itemDefinitions[itemId] = {
		itemId: itemId,
		tileId: itemId,
		name: name,
		protectionValue: protectionValue,
		baseIntegrity: baseIntegrity,
		generationChange: generationChance,
		type: "ARMOR"
	};
	this.pushThreshold(itemId, generationChance);
};

ItemFactory.prototype.createItem = function(itemId){
	var definition = this.itemDefinitions[itemId];
	if (definition.type === "WEAPON"){
		var integrity = rand(10,100) / 100;
		return new Weapon(definition.itemId, definition.name, definition.damageRoll.clone(), Math.round(definition.baseIntegrity * integrity), definition.baseIntegrity);
	}else if (definition.type === "ARMOR"){
		var integrity = rand(25,100) / 100;
		return new Armor(definition.itemId, definition.name, definition.protectionValue, Math.round(definition.baseIntegrity * integrity), definition.baseIntegrity);
	}else if (definition.type === "LIGHTSOURCE"){
		return new LightSource(definition.itemId, definition.name, definition.sightBonus, definition.fuel);
	}else if (definition.type === "ACCESORY"){
		return new Accesory(definition.itemId, definition.name, definition.isUnique);
	}else if (definition.type === "POTION"){
		return new Potion(definition.itemId, definition.name);
	}
};

ItemFactory.prototype.getAnItem = function(){
	var number = rand(0, this.generationChanceTotal);
	for (var i = 0; i < this.thresholds.length; i++){
		if (number < this.thresholds[i].threshold)
			return this.createItem(this.thresholds[i].itemId);
	}
};