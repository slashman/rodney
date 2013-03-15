function addEvent(obj, type, func){
	if (obj.addEventListener)
		obj.addEventListener(type, func, false);
	else if (obj.attachEvent)
		obj.attachEvent("on"+type, func);
}

addEvent(window, "load", loadScores);
