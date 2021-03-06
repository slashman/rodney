function ItemFactory(){
	this.itemDefinitions = {};
	this.setThresholds(1);
}

ItemFactory.prototype.setThresholds = function (depth){
	this.thresholds = new Array();
	this.generationChanceTotal = 0;
	
	var tier2Bonus = depth > 10 ? 10 : 0;
	var tier3Bonus = (depth > 15 ? 10 : 0)+tier2Bonus;
	var tier4Bonus = (depth > 20 ? 10 : 0)+tier3Bonus;
	
	// Weapon 2/6 = 200 (-50)
	this.addWeaponDefinition("DAGGER", "Dagger", new Roll(1,6,0), 400, 60);
	this.addWeaponDefinition("STAFF", "Staff", new Roll(2,3	,0), 600, 40);
	this.addWeaponDefinition("LONG_SWORD", "Long Sword", new Roll(3,4,0), 400, 30 + tier2Bonus);
	this.addWeaponDefinition("MACE", "Mace", new Roll(2,4,0), 600, 10 + tier3Bonus);
	this.addWeaponDefinition("SPEAR", "Spear", new Roll(1,8,0), 300, 5 + tier3Bonus);
	this.addWeaponDefinition("CLAYMORE", "Claymore", new Roll(4,4,0), 400, 5 + tier4Bonus);
	
	// Armor 1/6 = 100
	this.addArmorDefinition("LEATHER", "Leather armor", 2, 75, 30);
	this.addArmorDefinition("STUDDED", "Studded leather armor", 4, 75, 20);
	this.addArmorDefinition("RING", "Ring mail", 4, 100, 15+ tier2Bonus);
	this.addArmorDefinition("SCALE", "Scale mail", 5, 100, 15 + tier2Bonus);
	this.addArmorDefinition("CHAIN", "Chain mail", 6, 300, 10 + tier3Bonus);
	this.addArmorDefinition("SPLINT", "Splint mail", 7, 300, 5 + tier3Bonus);
	this.addArmorDefinition("BANDED", "Banded mail", 7, 200, 3 + tier4Bonus);
	this.addArmorDefinition("PLATE", "Plate mail", 8, 500, 2 + tier4Bonus);
	
	// Light 1/6 = 100
	this.addLightsourceDefinition("TORCH", "Torch", 4, 200, 70);
	this.addLightsourceDefinition("LANTERN", "Lantern", 5, 300, 30 + tier4Bonus);
	
	// Potion 2/6 = 200
	this.addPotionDefinition("HEALTH_POTION", "Healing Potion", 170);
	this.addPotionDefinition("EXTRA_HEALTH_POTION", "Extra Healing Potion", 20 + tier3Bonus);
	this.addPotionDefinition("GAIN_STRENGTH_POTION", "Strength Potion", 5 + tier4Bonus);
	this.addPotionDefinition("GAIN_VITALITY_POTION", "Vitality Potion", 5 + tier4Bonus);

	// Special
	this.addAccesoryDefinition("YENDOR", "The Amulet of Yendor", true, 0);
};

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
	if (generationChance <= 0)
		return;
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

ItemFactory.prototype.createItem = function(itemId, worn){
	var definition = this.itemDefinitions[itemId];
	if (definition.type === "WEAPON"){
		var integrity = rand(10,100) / 100;
		if (worn)
			integrity = 0.75;
		integrity = Math.round(definition.baseIntegrity * integrity);
		if (integrity > definition.baseIntegrity) integrity = definition.baseIntegrity;
		return new Weapon(definition.itemId, definition.name, definition.damageRoll.clone(), integrity, definition.baseIntegrity);
	}else if (definition.type === "ARMOR"){
		var integrity = rand(25,100) / 100;
		if (worn)
			integrity = 0.75;
		integrity = Math.round(definition.baseIntegrity * integrity);
		if (integrity > definition.baseIntegrity) integrity = definition.baseIntegrity;
		return new Armor(definition.itemId, definition.name, definition.protectionValue, integrity, definition.baseIntegrity);
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
		if (number <= this.thresholds[i].threshold)
			return this.createItem(this.thresholds[i].itemId);
	}
	// console.log("Unable to get an item, dropping a TORCH");
	return this.createItem("TORCH");
};