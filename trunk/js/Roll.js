/**
 * Very simple roll implementation for xDy+z patterns
 * @param rollExpression
 * @returns
 */
function Roll (multiplier, base, modifier){
	this.multiplier = multiplier;
	this.base = base;
	this.modifier = modifier;
}

Roll.prototype.roll = function(){
	var sum = 0;
	for (var i = 0; i < this.multiplier; i++){
		sum += rand(1, this.base);
	}
	return sum + this.modifier; 
};

Roll.prototype.getDescription = function(){
	if (this.modifier)
		if (this.modifier > 0)
			return this.multiplier+"D"+this.base+"+"+this.modifier;
		else
			return this.multiplier+"D"+this.base+""+this.modifier;
	else
		return this.multiplier+"D"+this.base;
	
};

Roll.prototype.clone = function(){
	return new Roll(this.multiplier, this.base, this.modifier);
};