var zIndex = 0;
function doClick() {
	var el = document.getElementById("fileElem");
	if (el) el.click();   
}
function draw(files){
	var img = document.createElement("img");	
	var btnAddImage = document.getElementById('btnAddImage');
	zIndex += 1;
    img.id ="img1";
    img.onload = function() {
    	window.URL.revokeObjectURL(this.src);      	
      	img.style.position 	= "relative";
      	img.style.zIndex = zIndex;
      	img.style.left = "0px";
      	img.style.top = "0px";
      	img.style.border = "1px dashed gray";
      	img.addEventListener("mousedown", function() { drag(this, event);}, false);
      	var bannerEdit = document.getElementById('banner-edit');
      	var download = document.getElementById('download');
        bannerEdit.appendChild(img);
        download.disabled = false;
        btnAddImage.disabled = true;
        }         
    img.src = window.URL.createObjectURL(files[0]);         
}
function addText(){
	var text = prompt("Add Text");
	if (!text) return;
    var bannerEdit = document.getElementById('banner-edit');
    var p = document.createElement("p");
    var download = document.getElementById('download');
    var btnAddText = document.getElementById('btnAddText');
    var imgHeight = 0;
    p.id = "text1";
    zIndex += 1;
    p.innerHTML = text;
    p.style.position 	= "relative";
    p.style.zIndex = zIndex;
    p.style.border = "1px dashed gray";
    p.style.margin = "0 0 0 0";
    p.style.left = "0px";   
    
    if (document.getElementById('img1')){
    	imgHeight = document.getElementById('img1').height;
    	p.style.top = "-" + imgHeight + "px";
    }  	
    else
    	p.style.top = "0px";  	
  	p.addEventListener("mousedown", function() { drag(this, event, imgHeight);}, false);    
    bannerEdit.appendChild(p);   
    download.disabled = false;
    btnAddText.disabled = true;
}
function downloadBanner(){	
	var canvas = document.getElementById('banner');
    var ctx = canvas.getContext('2d');
    var img = document.getElementById('img1');
    if (document.getElementById('text1')) {
    	var text = document.getElementById('text1');      	
        ctx.font = "12pt Times New Roman";
        ctx.fillText(text.innerHTML, text.offsetLeft - 8, text.offsetTop + 5);	
    }    
    if (document.getElementById('img1')) {
    	ctx.drawImage(img, img.offsetLeft - 8, img.offsetTop - 8);
    }
    var data = canvas.toDataURL("image/png");
	var data_header = "image/png";
	var fname = "banner.png";
	//push data to user
	window.URL = window.webkitURL || window.URL;
	var a = document.createElement('a');
	if (typeof a.download != "undefined"){
		//a.download is supported
		a.setAttribute("id", "save_data");
		a.download = fname;
		a.href = data;
		a.textContent = 'Downloading...';
		document.getElementById("tmp").appendChild(a);		
		//release memory		
		setTimeout(function(){
			a.textContent = 'Downloaded';
			a.href = '';
			var element = document.getElementById("save_data");
			element.parentNode.removeChild(element);
			}, 1500);
		//force click
		document.querySelector('#save_data').click();
		}
	else{
		//poor browser or poor user - not sure here. No support
		alert("Error");
		}   
}