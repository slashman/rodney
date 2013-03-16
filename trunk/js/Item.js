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

Item.prototype.getFloorDescription = function(){
	return this.name;
};

function LightSource(itemId, name, lightBonus, fuel){
	Item.call(this, itemId, name, "ACCESORY");
	this.isLightSource = true;
	this.lightBonus = lightBonus;
	this.fuel = fuel;
}

LightSource.prototype = new Item();
LightSource.prototype.constructor = LightSource;
LightSource.prototype.spend = function(){
	this.fuel--;
	if (this.fuel <= 0){
		this.fuel = 0;
		this.lightBonus = 0;
	}
};

LightSource.prototype.getStatusDescription = function(){
	return this.fuel === 0 ? this.name + "(Spent)" : this.name + " ("+this.fuel+")";
};

LightSource.prototype.getMenuDescription = function(){
	return this.fuel === 0 ? this.name + "(Spent)" : this.name + " ("+this.fuel+")";
};

function Accesory(itemId, name, isUnique){
	Item.call(this, itemId, name, "ACCESORY");
	this.isUnique = isUnique;
}

Accesory.prototype = new Item();
Accesory.prototype.constructor = Accesory;

function Potion(itemId, name){
	Item.call(this, itemId, name, "SPENDABLE");
}

Potion.prototype = new Item();
Potion.prototype.constructor = Potion;

Potion.prototype.use = function(){
	if (this.itemId === "HEALTH_POTION"){
		JSRL.ui.showMessage("You feel better");
		JSRL.player.recoverHP(rand(50,70));
		JSRL.player.inventory.removeObject(this);
	} else if (this.itemId === "EXTRA_HEALTH_POTION"){
		JSRL.ui.showMessage("You feel much better!");
		JSRL.player.recoverHP(rand(80,120));
		JSRL.player.inventory.removeObject(this);
	} else if (this.itemId === "GAIN_STRENGTH_POTION"){
		JSRL.ui.showMessage("You feel stronger");
		JSRL.player.strength+=2;
		JSRL.player.inventory.removeObject(this);
	}
};

function DamageableItem(itemId, name, type, baseIntegrity, maxIntegrity){
	Item.call(this, itemId, name, type);
	this.maxIntegrity = maxIntegrity;
	this.integrity = baseIntegrity;
}

DamageableItem.prototype = new Item();
DamageableItem.prototype.constructor = DamageableItem;

var INTEGRITY_DESCRIPTIONS = ["Ruined ", "Badly Worn ", "Worn ", "", "Excellent "];

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

DamageableItem.prototype.getFloorDescription = function(){
	return this.getIntegrityDescription() + this.name;
};

function Weapon(itemId, name, damageRoll, baseIntegrity, maxIntegrity){
	DamageableItem.call(this, itemId, name, "WEAPON", baseIntegrity, maxIntegrity);
	this.damageRoll = damageRoll;
	this.damageRoll.base += INTEGRITY_DAMAGE_ROLL_MODIFIERS[this.getIntegrityLevel()];
}

Weapon.prototype = new DamageableItem();
Weapon.prototype.constructor = Weapon;

var INTEGRITY_DAMAGE_ROLL_MODIFIERS = [-3, -2, -1, 0, 1];

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

function Armor(itemId, name, protectionValue, baseIntegrity, maxIntegrity){
	DamageableItem.call(this, itemId, name, "ARMOR", baseIntegrity, maxIntegrity);
	this.protectionValue = protectionValue;
	this.protectionValue += INTEGRITY_PV_MODIFIERS[this.getIntegrityLevel()];

}

Armor.prototype = new DamageableItem();
Armor.prototype.constructor = Armor;
var INTEGRITY_PV_MODIFIERS = [-3, -2, -1, 0, 1];

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