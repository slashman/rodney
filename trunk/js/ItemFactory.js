function ItemFactory(){
	this.itemDefinitions = {};
	this.addWeaponDefinition("DAGGER", "Dagger", new Roll(1,5,0), 100, 50);
	this.addArmorDefinition("LEATHER", "Leather armor", 2, 20, 20);
}


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
	}
};

