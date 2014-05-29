var MENU = new MENU_CLASS();

function MENU_CLASS(){
	this.do_menu = function(name){
		//save
		if(name == 'file_save'){
			POP.add({name: "name",		title: "File name:",	value: ["example"],	});
			POP.add({name: "type",		title: "Save as type:",	values: SAVE_TYPES,	});	
			POP.add({name: "quality",	title: "Quality (1-100) (optional):",	value: 92, range: [1, 100],	});
			POP.show('Save as ...', MENU.save);
			}
	};	
	this.save = function(user_response){
		fname = user_response.name;
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = WIDTH;
		tempCanvas.height = HEIGHT;
		if (document.getElementById('img1')) {
	    	var img = document.getElementById('img1');
	    	tempCtx.drawImage(img, img.offsetLeft - 8, img.offsetTop - 8);
	    }
		if (document.getElementById('text1')) {
	    	var text = document.getElementById('text1');      	
	    	tempCtx.font = "12pt Times New Roman";
	    	tempCtx.fillText(text.innerHTML, text.offsetLeft - 8, text.offsetTop + 5);	
	    }	    
		//detect type
		var parts = user_response.type.split(" ");
		user_response.type = parts[0];
		
		//auto detect?
		if(HELPER.strpos(fname, '.png')==true)		user_response.type = 'PNG';
		else if(HELPER.strpos(fname, '.jpg')==true)	user_response.type = 'JPG';
		else if(HELPER.strpos(fname, '.xml')==true)	user_response.type = 'XML';
		else if(HELPER.strpos(fname, '.bmp')==true)	user_response.type = 'BMP';
		else if(HELPER.strpos(fname, '.webp')==true)	user_response.type = 'WEBP';
		
		//prepare data
		if(user_response.type == 'PNG'){
			//png - default format
			var data = tempCanvas.toDataURL("image/png");
			var data_header = "image/png";
			if(HELPER.strpos(fname, '.png')==false)
				fname = fname+".png";
		}
		else
			return false;
		
		//check support
		var actualType = data.replace(/^data:([^;]*).*/, '$1');
		if(data_header != actualType && data_header != "text/plain"){
			//error - no support
			POP.add({title: "Error:",	value: "Your browser do not support "+user_response.type,	});
			POP.show('Sorry', '');
			return false;
			}
			
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
			a.onclick = function(e){
				MENU.save_cleanup(this);
				};
			//force click
			document.querySelector('#save_data').click();
			}
		else{
			//poor browser or poor user - not sure here. No support
			if(user_response.type == 'PNG')
				window.open(data);
			else if(user_response.type == 'JPG')
				window.open(data, quality);
			}
		};
		
	this.save_cleanup = function(a){
		a.textContent = 'Downloaded';
		setTimeout(function(){
			a.href = '';
			var element = document.getElementById("save_data");
			element.parentNode.removeChild(element);
			}, 1500);
		};
	}