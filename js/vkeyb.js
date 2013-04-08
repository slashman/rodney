function vkeyb(key){
	if (keyLock)
		return;
	keyLock = true;
	var keycode = keyCharToCode[key];
	if (JSRL.ui)
		JSRL.ui.pressedKey = keycode;
	keyLock = false;
}

function vkeybcode(event){
	if (keyLock)
		return false;
	keyLock = true;
	var keycode = event.keyCode;
	if (JSRL.ui)
		JSRL.ui.pressedKey = keycode;
	keyLock = false;
	return true;

}

function showNameEnter(){
	document.getElementById("nameEnterDiv").style.display = 'block';
	document.getElementById("gameKeyboardTable").style.display = 'none';
}

function showVirtualKeyboard(){
	document.getElementById("nameEnterDiv").style.display = 'none';
	document.getElementById("gameKeyboardTable").style.display = 'block';
}