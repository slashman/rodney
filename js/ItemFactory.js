function ItemFactory(){
	this.itemDefinitions = {};
	this.addWeaponDefinition("DAGGER", "Dagger", new Roll(1,5,0), 100, 50);
	this.addArmorDefinition("LEATHER", "Leather armor", 2, 20, 20);
	this.addLightsourceDefinition("TORCH", "Torch", 3, 200, 10);
	this.addAccesoryDefinition("YENDOR", "The Amulet of Yendor", true, 0);
}

ItemFactory.prototype.addAccesoryDefinition = function (itemId, name, isUnique, generationChance){
	this.itemDefinitions[itemId] = {
			itemId: itemId,
			tileId: itemId,
			name: name,
			generationChange: generationChance,
			isUnique: isUnique,
			type: "ACCESORY"
		};
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
};

ItemFactory.prototype.createItem = function(itemId){
	var definition = this.itemDefinitions[itemId];
	if (definition.type === "WEAPON"){
		return new Weapon(definition.itemId, definition.name, definition.damageRoll, definition.baseIntegrity);
	}else if (definition.type === "ARMOR"){
		return new Armor(definition.itemId, definition.name, definition.protectionValue, definition.baseIntegrity);
	}else if (definition.type === "LIGHTSOURCE"){
		return new LightSource(definition.itemId, definition.name, definition.sightBonus, definition.fuel);
	}else if (definition.type === "ACCESORY"){
		return new Accesory(definition.itemId, definition.name, definition.isUnique);
	}
};

