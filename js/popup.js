/*
Usage:
var POP = new popup();
POP.add({name: "param1",	title: "Value1:",	values: ["PNG", "JPG"],	});	
POP.add({name: "param2",	title: "Value2:",	value: 92, range: [0, 100], step: 1	});
POP.add({title: 'title:', function: 'custom_function'});

POP.show('title', main_handler, 'preview_handler', 'onload_handler');
*/

var POP = new popup();
function popup(){
	this.active = false;
	this.handler = '';
	this.preview = false;
	this.onload = false;
	this.width_mini = 195;
	this.height_mini = 195;
	this.id = 0;
	var parameters = [];

	this.constructor = new function(){
		var dim = HELPER.get_dimensions();
		popup = document.getElementById('popup');
		popup.style.top = 150+'px';
		popup.style.left = Math.round(dim[0]/2)+'px';
		};
	//add parameter
	this.add = function(object){
		parameters.push(object);
		};
	//show popup window
	this.show = function(title, handler, preview_handler, onload_handler){
		POP.id = HELPER.getRandomInt(0, 999999999); 
		if(this.active == true){
			this.hide();
			return false;
			}
		this.active = true;
		this.handler = handler;
		if(preview_handler != undefined)
			this.preview = preview_handler;
		if(onload_handler != undefined)
			this.onload = onload_handler;
		var html = '';
		var can_be_canceled = false;
		
		var dim = HELPER.get_dimensions();
		popup = document.getElementById('popup');
		popup.style.top = 150+'px';
		popup.style.left = Math.round(dim[0]/2)+'px';
		
		html += '<h2 id="popup_drag">'+title+'</h2>';
		html += '<table style="width:99%;">';
		for(var i in parameters){
			var parameter = parameters[i];
			html += '<tr>';
			html += '<td style="font-weight:bold;padding-right:3px;width:130px;">'+parameter.title+'</td>';
			if(parameter.name != undefined){
				can_be_canceled = true;
				if(parameter.values != undefined){
					var onchange = '';
					if(parameter.onchange != undefined)
						onchange = ' onchange="'+parameter.onchange+';" ';
					if(parameter.values.length > 10 || parameter.type == 'select'){
						//drop down
						html += '<td colspan="2"><select '+onchange+' style="font-size:12px;" id="pop_data_'+parameter.name+'">';
						var k = 0;
						for(var j in parameter.values){
							var sel = '';
							if(parameter.value == parameter.values[j])
								sel = 'selected="selected"';
							if(parameter.value == undefined && k == 0)
								sel = 'selected="selected"';
							html += '<option '+sel+' name="'+parameter.values[j]+'">'+parameter.values[j]+'</option>';
							k++;
							}
						html += '</select></td>';
						}
					else{
						//radio
						html += '<td colspan="2">';
						if(parameter.values.length > 2)
							html += '<div class="group">';
						var k = 0;
						for(var j in parameter.values){
								var ch = '';
							if(parameter.value == parameter.values[j])
								ch = 'checked="checked"';
							if(parameter.value == undefined && k == 0)
								ch = 'checked="checked"';
							html += '<input type="radio" '+onchange+' '+ch+' name="'+parameter.name+'" id="pop_data_'+parameter.name+"_poptmp"+j+'" value="'+parameter.values[j]+'">';
							html += '<label style="margin-right:20px;" for="pop_data_'+parameter.name+"_poptmp"+j+'">'+parameter.values[j]+'</label>';
							if(parameter.values.length > 2)
								html += '<br />';
							k++;
							}
						if(parameter.values.length > 2)
							html += '</div>';
						html += '</td>';
						}
					}
				else if(parameter.value != undefined){
					var step = 1;
					if(parameter.step != undefined)
						step = parameter.step;
					if(parameter.range != undefined){
						html += '<td><input type="range" id="pop_data_'+parameter.name+'" value="'+parameter.value+'" min="'+parameter.range[0]+'" max="'+parameter.range[1]+'" step="'+step+'" " oninput="document.getElementById(\'pv'+i+'\').innerHTML=Math.round(this.value*100)/100;" /></td>';
						html += '<td style="padding-left:10px;width:50px;" id="pv'+i+'">'+parameter.value+'</td>';
						}
					else{
						if(parameter.type == 'textarea')
							html += '<td><textarea style="width:100%;height:80px;" id="pop_data_'+parameter.name+'">'+parameter.value+'</textarea></td>';
						else
							html += '<td colspan="2"><input style="width:100%;" type="text" id="pop_data_'+parameter.name+'" value="'+parameter.value+'" onkeyup="POP.validate(this);" /></td>';
						}
					}
				}
			else if(parameter.function != undefined){
				//custom function
				if(typeof parameter.function == 'string')
					var result = window[parameter.function]();
				else
					var result = parameter.function();
				html += '<td colspan="3">'+result+'</td>';
				}
			else if(parameter.html != undefined){
				//html
				html += '<td colspan="2">'+parameter.html+'</td>';
				}
			else{
				//locked fields
				str = ""+parameter.value;
				var id_tmp = parameter.title.toLowerCase().replace(/[^\w]+/g,'').replace(/ +/g,'-');
				id_tmp = id_tmp.substring(0, 10);
				if(str.length < 40)
					html += '<td colspan="2"><input style="width:100%;color:#393939;padding-left:5px;" disabled="disabled" type="text" id="pop_data_'+id_tmp+'" value="'+parameter.value+'" /></td>';
				else
					html += '<td style="font-size:11px;" colspan="2"><textarea disabled="disabled">'+parameter.value+'</textarea></td>';
				}
			html += '</tr>';
			}
		html += '</table>';
		html += '<div style="text-align:center;margin-top:20px;margin-bottom:15px;">';
		html += '<input type="button" onclick="POP.save();" class="button" value="OK" />';
		if(can_be_canceled==true)
			html += '<input type="button" onclick="POP.hide();" class="button" value="Cancel" />';
		html += '</div>';
			
		document.getElementById("popup").innerHTML = html;
		document.getElementById("popup").style.display="block";
		if(parameters.length > 15)
			document.getElementById("popup").style.overflowY="scroll";
		else
			document.getElementById("popup").style.overflowY='hidden';
		
		//onload
		if(this.onload != ''){
			if(typeof this.onload == "string")
				window[this.onload]();
			else
				this.onload();
			}
		
		};
	//hide popup
	this.hide = function(){
		document.getElementById('popup').style.display='none';
		parameters = [];
		this.handler = '';
		this.active = false;
		this.preview = false;
		this.onload = false;
		this.preview_in_main = false;
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		};
	//OK pressed - prepare data and call handlers
	this.save = function(){
		this.active = false;
		document.getElementById("popup").style.display="none";
		var response={};
		inputs = document.getElementsByTagName('input');
		for (i = 0; i<inputs.length; i++){
			if(inputs[i].id.substr(0,9)=='pop_data_'){
				var key = inputs[i].id.substr(9);
				if(HELPER.strpos(key, "_poptmp") != false)
					key = key.substring(0, HELPER.strpos(key, "_poptmp"));
				var value = inputs[i].value;
				if(inputs[i].type == 'radio'){
					if(inputs[i].checked==true)
						response[key] = value;
					}
				else
					response[key] = value;
				
				}
			}
		parameters = [];		
		this.onload = false;
		if(this.handler != ''){
			if(typeof this.handler == "string")
				window[this.handler](response);
			else
				this.handler(response);
			}
		this.handler = '';
		};
	//validate input field, unless browser supports input=range
	this.validate = function(field){
		for(var i in parameters){
			var parameter = parameters[i];
			if("pop_data_"+parameter.name == field.id && parameter.range != undefined){
				if(field.value == '-' || field.value == '') return true;
				
				var value = parseFloat(field.value);
				if(isNaN(value) || value != field.value)
					field.value = parameter.value;	//not number
				if(value < parameter.range[0])
					field.value = parameter.range[0];	//less then min
				else if(value > parameter.range[1])
					field.value = parameter.range[1];	//more then max
				}
			}
		};
	}
