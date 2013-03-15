// Helper function that calculates a distance
function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

// Helper function that does blending between two values
function blend(a, b, f) {
	return a*f + b*(1.0-f);
}

function chance(chance){
	return rand(0,100) <= chance;
}

function sign(number){
	if (number === 0)
		return 0;
	else if (number > 0)
		return 1;
	else 
		return -1;
}

function randomElementOf(array){
	return array[Math.floor(Math.random()*array.length)];
}

function rand(low, hi){
	return Math.floor(Math.random() * (hi - low + 1))+low;
}

//Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.removeObject = function(object) {
	for (var i = 0; i < this.length; i++){
		if (this[i] == object){
			this.remove(i,i);
			return;
		}
	}
};

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};

var DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT"];

var ALL_DIRECTIONS = ["UP", "DOWN", "LEFT", "RIGHT","UPLEFT", "DOWNLEFT", "UPRIGHT", "DOWNRIGHT"];

function sumPositions(p1, p2){
	return {x: p1.x+ p2.x, y: p1.y+p2.y};
}