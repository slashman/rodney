function Sound(){
	this.sounds = [];
	
	this.addSound("SND_WALK",this.loadSound("wav/walk.wav"));
	this.addSound("SND_SWORD",this.loadSound("wav/sword.wav"));
	this.addSound("SND_LASER",this.loadSound("wav/34.wav"));
}

Sound.prototype.addSound = function(sndIndex, sound){
	this.sounds[sndIndex] = sound;
	this.sounds[sndIndex].sndIndex = sndIndex;
};

Sound.prototype.loadSound = function(fname){
	var sound = new Audio();
	sound.src = fname;
	sound.copyPlay = function(){
		var node = this.cloneNode();
		node.volume = 0.1;
		node.play();
	};
	
	return sound;
};

Sound.prototype.getSound = function(sndIndex){
	return this.sounds[sndIndex];
};
