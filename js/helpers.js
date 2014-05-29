var HELPER = new HELPER_CLASS();

function HELPER_CLASS() {
	this.strpos = function(haystack, needle, offset) {
		var i = (haystack+'').indexOf(needle, (offset || 0));
		return i === -1 ? false : i;
	};
	this.get_dimensions = function(){
		var theWidth, theHeight;
		if (window.innerWidth) {
			theWidth=window.innerWidth;		
		}
		else if (document.documentElement && document.documentElement.clientWidth) {
			theWidth=document.documentElement.clientWidth;
		}
		else if (document.body) {
			theWidth=document.body.clientWidth;
		}
		if (window.innerHeight) {
			theHeight=window.innerHeight;
		}
		else if (document.documentElement && document.documentElement.clientHeight) {
			theHeight=document.documentElement.clientHeight;
		}
		else if (document.body) {
			theHeight=document.body.clientHeight;
		}
		return [theWidth, theHeight];
		};
	this.getRandomInt = function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

}