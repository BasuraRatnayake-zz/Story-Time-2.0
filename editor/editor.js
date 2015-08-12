// Evolve WYSIWYG 1.0 | MIT license. | Basura Ratnayke (amuthupuwath@gmail.com)
$(document).ready(function(){
	controls.init();
});

			
var controls={
	ColorSet: "",
	init:function(){		
		storyDP.document.designMode='On';	
		document.getElementById('storyDP').contentDocument.body.style.wordWrap='break-word';
		controls.exe("fontSize",$('#fontSize').val());
		this.checkFontSize();
		this.changeFontSize();
		this.textStyle();
		this.editorDesign();
	},
	makeDraggable:function(container,div){//Make Div Draggables
		$(container).on('mousedown', div, function(e) {
		  $(this).addClass('draggable').parents().on('mousemove', function(e) {
			  $('.draggable').offset({
				  top: e.pageY - $('.draggable').outerHeight() / 2,
				  left: e.pageX - $('.draggable').outerWidth() / 2
			  }).on('mouseup', function() {
				  $(this).removeClass('draggable')
			  })
		  })
	  }).on('mouseup', function() {
		  $('.draggable').removeClass('draggable')
	  })
	},
	editorDesign:function(){//Designing of the Editor and its sub componenets
		$('#storyDP').contents().find('body').css("font-family","Arial, Helvetica, sans-serif").attr("spellcheck","false");
		this.makeDraggable('#container','#findHighlight');//Make Find and Replace Draggable
		this.makeDraggable('#container','#linkAdd');//Make Add Link Draggable
		this.DesignTable();//Design the Table Functions
	},
	findReplacehighlight:function(){//Find and Replace Functionality
		$('#BackOverlay').fadeIn('fast');
		$('#BackOverlay').click(function(){
			$('#c_frh').click()
		});
		$('#searchFound').html("");//Make Search Found Empty
		$('#findHighlight').toggle('normal');//Toggles the display of the div
		$('#c_frh').click(function(){//When Close Button Clicked
			$('#findHighlight,#BackOverlay').fadeOut('normal')//Close the div
		});					
		$('#findbtn').click(function(){//When find button clicked
			$('#storyDP').contents().find('body').highlight($('#findt').val());//Find the search term from the body and highlight
			var count=$('#storyDP').contents().find('.highlight').length;//Get the number of highlighted terms
			if(count>1){	//If count more than 1				
				$('#unhighlightbtn').click();//Perform Unhighlight to remove previous highlights
				$('#storyDP').contents().find('.highlight').css("background","#93dcee")//Add the background to the highlighted terms
			}
			$('#searchFound').html("Found ( "+count+" ) Items");//Show found number of terms
			count=0
		});
		$('#unhighlightbtn').click(function(){
			$('#storyDP').contents().find('span').each(function(index,element){
				$(element).removeAttr('style')
			})
		});
		$('#replacebtn').click(function(){			
			var count=$('#storyDP').contents().find('.highlight').length;
			$('#searchFound').html("Replaced ( "+count+" ) Items");				
			$('#storyDP').contents().find('body').removeHighlight($('#findt').val(),$('#replacet').val());
			$('#unhighlightbtn').click();
			count=0
		})
	},
	checkFontSize:function(){//Check the font size of the editor
		var fSize=$('#fontSize');
		fSize.change(function(){
			var size=fSize.val();
			if(isNaN(size) || size < 1)
				fSize.val(1)
			else if(size > 7)				
				fSize.val(7)
		})
	},
	exe:function(command,val){//Execute Command
		try{			
			storyDP.document.execCommand(command,false,val)
		}
		catch(err){
			document.getElementById("demo").innerHTML = err.message;
		}
	},
	changeFontSize:function(){//Change Font Size from Dropdown
		$('#fontName,#fontSize').change(function(){			
			controls.exe(this.id,$(this).val())
		})
	},
	addLink:function(){
		$('#BackOverlay').fadeIn('fast');
		$('#BackOverlay').click(function(){
			$('#c_frLink').click()
		});
		$('#linkAdd').toggle('normal');//Toggles the display of the div
		$('#c_frLink').click(function(){//When Close Button Clicked
			$('#linkAdd,#BackOverlay').fadeOut('normal')//Close the div
		});				
		$('#addL_btn').click(function(){
			$('#linkIA').removeClass('valK').removeClass('valW');//Remove status icons
			var val = $('#linkt').val();//Take value from input
			if(val.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)){//Validate the URL
				$('#linkIA').addClass('valK').attr("title","Link is okay");
				controls.exe("createLink",val);//Add Link
				$('#c_frLink').click();
				$('#linkt').val("http://");
				$('#linkIA').fadeOut('slow')
			}else
				$('#linkIA').addClass('valW').attr("title","The entered link is invalid")
		})
	},
	rgb2hex:function(rgb){//COnvert RGB to Hex
		if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;	
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2)
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
	},
	SetColor:function(command,left,top){		
		$('.colorBox').css("left",left).css("top",top);
		$(".colorBox").fadeToggle('slow');
		$('.colorTopSq,.colorSq').click(function(){
			this.ColorSet=controls.rgb2hex($(this).css("background-color"));//Assign Color to a Common Variable			
			controls.exe(command,this.ColorSet);
			$(".colorBox").fadeOut('slow')
		})
	},
	tblR:0,//Table Rows
	tblC:0,//Table Columns
	DesignTable:function(){//Design the table divs and the container
		var rc;
		for(var i=1;i<8;i++){
			rc = "R"+i;
			for(var j=1;j<8;j++){
				rc = "R"+i+"_C"+j;
				$('.tableBox').html($('.tableBox').html()+"<div id='tbl"+rc+"' class='tableB'></div>")
			}
		}
	},
	SetTable:function(){//Launches when add table button clicked
		var table = document.createElement('table');
		for(var k=1;k<=controls.tblR;k++){
			var tr = document.createElement('tr'); 
			for(var l=1;l<=controls.tblC;l++){
				var td = document.createElement('td'),
					text = document.createTextNode('Text');
				td.appendChild(text);	
				tr.appendChild(td)	
			}
			table.appendChild(tr)
		}
		$('#storyDP').contents().find('body').append(table); 
		$('#storyDP').contents().find('table').attr("cellspacing","0").attr("border","1").attr("bordercolor","#006699");
		$('.tableBox').fadeOut('slow')
	},
	ShowTable:function(){//When table columns and rows are selected	
		$('.tableBox').toggle('slow');
		$('.tableB').click(function(){
			var id=this.id.replace("tbl","")
			id =id.split("_");
			controls.tblR=parseInt(id[0].replace("R",""));//Assign Selected Row 
			controls.tblC=parseInt(id[1].replace("C",""));//Assign Selected Colum
			controls.SetTable();
		});
		$('.tableB').mouseenter(function(){
			$('.tableB').css("border","");
			var id=this.id.replace("tbl","")
			var rowColumn =id.split("_");
			rowColumn[0]=parseInt(rowColumn[0].replace("R",""));//Row
			rowColumn[1]=parseInt(rowColumn[1].replace("C",""));//Column
			for(var i=1;i<=rowColumn[0];i++){
				for(var j=1;j<=rowColumn[1];j++){
					$('#tblR'+i+"_C"+j).css("border","#c00000 solid 1px")				
				}
			}	
		})
	},
	source:false,
	ShowSource:function(){//Toggle between html and text
		var html=$('#storyDP').contents().find('body');
		if(controls.source){
			html.html($('#storyDP').contents().find('body').text());
			controls.source=false
		}else{
			html.text($('#storyDP').contents().find('body').html());
			controls.source=true
		}
	},
	saveDocument:function(){//Need to insert an AJAX Call
		
	},
	showUProgress:function(event){//Show Upload Progress
	 	var percent = Math.round((event.loaded / event.total) * 100), 
			proMeter = Math.round((414*percent)/100);
		$('#imageContainer').html(percent+"%").css("width",proMeter+"px")	
	},
	uploadOkay:function(){
		alert("K");
		$('#imageContainer').html("").removeClass('waitPrepare');
		$('#c_frImage').click()
		//Add the rest of the code herer
	},
	uploadImage:function(data){//Upload Data to the server
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'testUpload.php', true); 
		xhr.onload = function () { 
	 		if(xhr.status != 200)
				alert('An error occurred!, Something is wrong try again')
		};	 
 
		xhr.upload.addEventListener("progress", controls.showUProgress, false); 
		xhr.addEventListener("load", controls.uploadOkay, false); 
		xhr.send(data)
	},
	addImage:function(){
		var formData = new FormData();//Initialize the form data
		$('#BackOverlay').fadeIn('fast');
		$('#BackOverlay').click(function(){
			$('#c_frImage').click()
		});
		$('#imageLoad').toggle('normal');//Toggles the display of the div
		$('#c_frImage').click(function(){//When Close Button Clicked
			$('#imageLoad,#BackOverlay').fadeOut('normal')//Close the div			
			$('#file').val("")//Clears the previously selected images
			$('#imageLoad').css('height','125px');
			$('#uploadImgs').fadeOut('slow');
			$('#imageContainer').html("");
		});
		$('#file').click(function(){//When Image Browse Clicked		
			$(this).val("")//Clears the previously selected images
		});
		$('#file').change(function(){//When files chosen for upload
			var files = this.file || this.files, file,size,length;
			length=(files.length > 10)?10:files.length;//Set Image length to 10 if more
			$('#imageContainer').html("");//Empties the images container
			for(var i=0; i < length; i++){
				file = files[i];
				if(/^image\/(jpg|png|jpeg|gif)$/.test(file.type)){//Validate Image type	
					size = file.size/1024/1024;//Get Image size in MB		
					if(size < 10){//Check if the image size is less than 2 MB							
						var reader = new FileReader();//Declare the File Reader
						reader.readAsDataURL(files[i]);//Converts the image file into DataURL  					  	
						reader.onload = function(_file){//On the load of the reader
							var img = _file.target.result;
							$('#imageContainer').html($('#imageContainer').html()+"<img src='"+img+"' class='imageHolder'>")//Assign DataURL to image
						}
						
						size=182;
						if(length > 5) size = 252;
						$('#imageLoad').css('height',size+'px');
						
						formData.append('photos[]', file, file.name);//Append Images to the form										
						$('#uploadImgs').fadeIn('slow')//Show Upload Button
					}
				}
			}
		});
		$('#uploadImgs').click(function(){
			$(this).fadeOut('slow');
			$('#imageLoad').css('height','158px');
			$('#imageContainer').html("0%").addClass('waitPrepare').css("width","1px");
			controls.uploadImage(formData);//Call Image Upload Function
		})
	},
	textStyle:function(){
		$('.icon').click(function(){
			switch(this.id){
				case "bold":
					controls.exe("bold",null);
					break
				case "italic":
					controls.exe("italic",null);
					break
				case "underline":
					controls.exe("underline",null);
					break
				case "text_color":
					controls.SetColor("foreColor","492px","76px");	
					break
				case "select_background_color":					
					controls.SetColor("hiliteColor","516px","76px");
					break
				case "strike_through":
					controls.exe("strikeThrough",null);
					break
				case "left":
					controls.exe("justifyLeft",null);
					break	
				case "center":
					controls.exe("justifyCenter",null);
					break
				case "right":
					controls.exe("justifyRight",null);
					break
				case "justify":
					controls.exe("justifyFull",null);
					break
				case "decrease_indent":
					controls.exe("outdent",null);
					break
				case "increase_indent":
					controls.exe("indent",null);
					break
				case "numbered_list":
					controls.exe("InsertOrderedList",null);
					break
				case "bulleted_list":
					controls.exe("InsertUnorderedList",null);
					break
				case "undo":
					controls.exe("undo",null);
					break
				case "redo":
					controls.exe("redo",null);
					break
				case "cut":
					controls.exe("cut",null);
					break
				case "copy":
					controls.exe("copy",null);
					break
				case "paste":
					controls.exe("paste",null);
					break
				case "paste_as_plain_text":
				
					break
				case "paste_from_word":
				
					break		
				case "insert_image":
					controls.addImage();
					break		
				case "table":						
					controls.ShowTable();
					break
				case "blockquote":
					controls.exe('formatBlock',"<Q>");
					break	
				case "remove_format":
					controls.exe("removeFormat",null);
					break	
				case "linkA":
					controls.addLink();
					break	
				case "remove_link":
					controls.exe("unlink",null);
					break			
				case "find":
					controls.findReplacehighlight();
					break		
				case "replace":
					controls.findReplacehighlight();
					break		
				case "select_all":
					controls.exe("selectAll",null);
					break		
				case "save":	
					controls.saveDocument();				
					break		
				case "preview":
					controls.exe("italic",null);
					break		
				case "source":
					controls.ShowSource();
					break			
			}
		})
	}
}