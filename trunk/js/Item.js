function Item(itemId, name, type){
	this.itemId = itemId;
	this.name = name;
	this.type = type;
}

Item.prototype.getStatusDescription = function(){
	return this.name;
};

Item.prototype.getMenuDescription = function(){
	return this.name;
};

function DamageableItem(itemId, name, type, baseIntegrity){
	Item.call(this, itemId, name, type);
	this.maxIntegrity = baseIntegrity;
	this.integrity = baseIntegrity;
}

DamageableItem.prototype = new Item();
DamageableItem.prototype.constructor = DamageableItem;

var INTEGRITY_DESCRIPTIONS = ["Ruined ", "Badly Worn ", "Worn ", "", "Pristine "];

DamageableItem.prototype.getIntegrityDescription = function(){
	return INTEGRITY_DESCRIPTIONS[this.getIntegrityLevel()];	
};

DamageableItem.prototype.getIntegrityLevel = function(){
	return Math.round( (this.integrity / this.maxIntegrity)*4);
};

DamageableItem.prototype.clash = function(strength){
	var previousIntegrityLevel = this.getIntegrityLevel();
	if (this.type === "WEAPON"){
		if (JSRL.player.hasSkill("FINESSE")){
			strength /= 2;
		}
	}
	this.integrity -= strength;
	if (this.integrity <= 0)
		this.integrity = 0;
	var integrityLevel = this.getIntegrityLevel();
	if (integrityLevel < previousIntegrityLevel && integrityLevel <= 3){
		JSRL.ui.showMessage("Your "+this.name+" is damaged");
		this.damage();
	}
};

DamageableItem.prototype.damage = function(){
	
};

function Weapon(itemId, name, damageRoll, baseIntegrity){
	DamageableItem.call(this, itemId, name, "WEAPON", baseIntegrity);
	this.damageRoll = damageRoll;
}

Weapon.prototype = new DamageableItem();
Weapon.prototype.constructor = Weapon;


Weapon.prototype.damage = function(){
	this.damageRoll.base --;
	if (this.damageRoll.base <= 1)
		this.damageRoll.base =  0;
};

Weapon.prototype.getStatusDescription = function(){
	return this.name + "[" + this.damageRoll.getDescription() + "] {"+this.integrity+"}";
};

Weapon.prototype.getMenuDescription = function(){
	return this.getIntegrityDescription() +this.name + " [" + this.damageRoll.getDescription() + "]";
};

function Armor(itemId, name, protectionValue, baseIntegrity){
	DamageableItem.call(this, itemId, name, "ARMOR", baseIntegrity);
	this.protectionValue = protectionValue;
}

Armor.prototype = new DamageableItem();
Armor.prototype.constructor = Armor;

Armor.prototype.damage = function(){
	this.protectionValue --;
	if (this.protectionValue <= 1)
		this.protectionValue =  0;
};

Armor.prototype.getStatusDescription = function(){
	return this.name + "[" + this.protectionValue + "] {"+this.integrity+"}";
};

Armor.prototype.getMenuDescription = function(){
	return this.getIntegrityDescription() +this.name + " [" + this.protectionValue + "]";
};