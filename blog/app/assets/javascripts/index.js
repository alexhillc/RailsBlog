var uID;
var jsonString;

var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({
	    el: $('#paper'),
	    width: (screen.width-50),
	    height: (screen.height-100),
	    gridSize: 1,
	    perpendicularLinks: false,
	    linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
	    model: graph
	});
	
	var commandManager = new joint.dia.CommandManager({ graph: graph });
	
	$('#undo').on('click', _.bind(commandManager.undo, commandManager));
	$('#redo').on('click', _.bind(commandManager.redo, commandManager));
	

/********************************************************************************************************************************
Handles onload function.  Draws relapse line in the center of the paper.
*********************************************************************************************************************************/
$( document ).ready(function() {
	
	//grab height and width of the paper(the 'canvas' in which the family map is displayed on)
	var h = $('#paper').height();
	var w = $('#paper').width();
	
	//draw the relapse line in center of the paper
	var r_line = V('line',{x1: 0, y1: h/2, x2: w, y2: h/2, stroke: 'black'});
	V(paper.viewport).append(r_line);
});

/********************************************************************************************************************************
Function is called when the Arrow Button is pressed. (NEW)
This allows the user to click on two different elements(not links) to link them.  
When two are selected, it will popup the arrow dialog box for editing the link before displaying it.
*********************************************************************************************************************************/
var linking = false;
var linkSource, linkTarget;
var linkSourceText, linkTargetText;
var firstLink = true;
function clickToLink(){

  if(!linking){
  	if(firstLink){
  	  alert("Click on two different elements to create an arrow, or you can cancel by clicking the Cancel button to the right.");
  	  firstLink = false;
  	}
	  linking = true;			//global variable to allow pointerclick event(below) to run
	  linkSource = -1;			//holds the ID of the source element
	  linkTarget = -1;			//holds the ID of the target element
	  linkTargetText = "";
	  linkSourceText = "";
	  
	  $('.navbar-btn').prop('disabled', true);		//disabled all buttons on nav bar while linking is enabled 
	  $('#arrowOptionsButton').prop('disabled', false);	//except for the Add Arrow button
  	  $('#arrowOptionsButton').html('Cancel');		//change arrow button to Cancel, to cancel linking
	  $('.element').css('cursor','pointer');		//so the user knows its clickable
  	}else{				//handles cancel button
  	  linking = false;

  	  if(linkSource != -1){
  	  	paper.findViewByModel(linkSource).unhighlight(linkSource);
		graph.getCell(linkSource).attr({text: {text: linkSourceText}});
  	  }
  	  if(linkTarget != -1){
  	  	paper.findViewByModel(linkTarget).unhighlight(linkTarget);
		graph.getCell(linkTarget).attr({text: {text: linkTargetText}});
  	  }
  	  $('#arrowOptionsButton').html('Add Arrow');
  	  $('.navbar-btn').prop('disabled', false);
	  $('.element').css('cursor','move');
	} 	
}

/********************************************************************************************************************************
When linking is true, allow the user to click on an element for linking. Linking is turned on when 'Add Arrow' button
is pressed.
*********************************************************************************************************************************/
paper.on('cell:pointerdown', function(cellView, evt, x, y){
	  if(linking){

		      var cell = cellView.model.id;

		      if(cell == linkSource){				//if the user clicks on a cell that was already highlighted
		      		paper.findViewByModel(linkSource).unhighlight(linkSource); //unhighlight and
		      		graph.getCell(linkSource).attr({text: {text: linkSourceText}});
		      		linkSource = -1;					//default back to -1
		      }else 
		      if(cell == linkTarget){				//same as above for linkTarget
		      		paper.findViewByModel(linkTarget).unhighlight(linkTarget); 
		      		graph.getCell(linkTarget).attr({text: {text: linkTargetText}});
		      		linkTarget = -1;
		      }else 
		      if(linkSource == -1 && linkTarget != cell){	//make sure source is -1 and that the target is not the same as the source
		      
		          if(!(graph.getCell(cell).isLink())){		//make sure its not a link
		      	    linkSource = cell;				
		      	    paper.findViewByModel(cell).highlight(cell);//highlight for looks
		      	    linkSourceText = graph.getCell(linkSource).attr('text/text') || ""; 
		      	    graph.getCell(linkSource).attr({text: {text: '1'}});
		      	}
		      	  
		      }else 
		      if(linkTarget == -1 && linkSource != cell){	//make sure target is -1 and that the source is not the same as the target
		      
		         if(!(graph.getCell(cell).isLink())){		
		      	   linkTarget = cell;
		      	   paper.findViewByModel(cell).highlight(cell);
		      	   linkTargetText = graph.getCell(linkTarget).attr('text/text') || "";
		      	   graph.getCell(linkTarget).attr({text: {text: '2'}});
		      	}
		      
		      }//end if-else nest
		      
		      if(linkTarget != -1 && linkSource != -1){
	      	        $('#arrowModal').modal('show');
		      }
		}//end if(linking)
});//end pointer click

/********************************************************************************************************************************
Add a link to the graph:
linkSource:	reference to the 1st element(source)
linkTarget:   	reference to the 2nd element(target)
col:     	color of the line
heads:   	integer referring to number of arrow heads (0,1,2)
dashed:  	boolean for if the link is dashed or not
*********************************************************************************************************************************/
function add_link(col, heads, dashed){
    l = new joint.dia.Link({
    	source: {id: linkSource},
    	target: {id: linkTarget},
    	connector: {name: 'normal'},
    	attrs: {'.connection': {stroke: col, 'stroke-width': 3}}
    });
    
    switch(heads){
      case(1): {l.attr( {'.marker-target': {fill: '#333333', d: 'M 10 0 L 0 5 L 10 10'}} ); break;}	//add arrowhead to the target-side of the link
      case(2): {l.attr( {'.marker-target': {fill: '#333333', d: 'M 10 0 L 0 5 L 10 10'}, 		//add arrowhead to both sides of the link
                         '.marker-source': {fill: '#333333', d: 'M 10 0 L 0 5 L 10 10 z'}} ); break;}
    }
    
    if(dashed){
    	l.attr( {'.connection': {'stroke-dasharray': '5 2'}} );						//if dashed is true, add this attribute to the link
    }
	graph.addCell(l);
	cancel_linking();
};

/********************************************************************************************************************************
Grab form values from the radio buttons.  Pass them to the add_link function to create the desired link.
*********************************************************************************************************************************/
function div_arrow_hide(){
	var heads = parseInt($('input[name="arrowOptRadio"]:checked').val());
	var dashed = parseInt($('input[name="arrowOptRadio2"]:checked').val());
	var color = $('input[name="arrowOptRadio3"]:checked').val();
	add_link(color, heads, dashed);
	$('#arrowModal').modal('hide');
}

/********************************************************************************************************************************
Cancel linking process.  Unhighlight all elements, change values back to default and DOM elements back to normal.
*********************************************************************************************************************************/
function cancel_linking(){
	paper.findViewByModel(linkSource).unhighlight(linkSource);
	graph.getCell(linkSource).attr({text: {text: linkSourceText}});
	paper.findViewByModel(linkTarget).unhighlight(linkTarget);
	graph.getCell(linkTarget).attr({text: {text: linkTargetText}});
	$('.basic').css('cursor','move');
	$('#arrowOptionsButton').html('Add Arrow');
	$('.navbar-btn').prop('disabled', false);
	linking=false;							//prevents the pointerclick event from running
}

/********************************************************************************************************************************
Add an Oval shape(action) to the graph.  Ovals contain text, color and text style.  
Function is called when Add Oval button is pressed.
*********************************************************************************************************************************/
function add_oval(){
	$('#myModal').modal('show');
	document.getElementById("green").checked = true;	//set default checkbox back to green
	document.getElementById("normal").checked = true;	//set default text-type back to default - normal
        document.getElementById("name").value = "";			//Set text fields as empty.
	document.getElementById("comments").value = "";		//Set text fields as empty.

	var oval = new joint.shapes.basic.Ellipse({
                position: { x:0, y:0 },
		size: { width: 0, height: 0 }			//size to 0,0 so it will not show while setting it up						
        });
	
	uID = oval.id;				
	graph.addCell(oval);
}

/********************************************************************************************************************************
Add a Diamond shape to the graph.  Diamonds contain text, color and text style.
Function is called when Add Diamond button is pressed.
*********************************************************************************************************************************/
function add_diamond(){
	$('#diaModal').modal('show');
	document.getElementById("sad").checked = false;		//Uncheck all check boxes in popup
	document.getElementById("angry").checked = false;
	document.getElementById("worried").checked = false;
	document.getElementById("happy").checked = false;
	document.getElementById("aroused").checked = false;
	document.getElementById("discomfort").checked = false;
	document.getElementById("ashamed").checked = false;
	document.getElementById("guilty").checked = false;
	document.getElementById("lonely").checked = false;
	//except for the Green
	document.getElementById("dia_green").checked = true;
    	document.getElementById("comments2").value = "";

	var diamond = new joint.shapes.basic.Path({
    		size: { width: 0, height: 0 },
    		position: {x: 0, y:0},
    		attrs: { path: { d: 'M 30 0 L 60 30 30 60 0 30 z' },
        		 text: {
            			'ref-x': .5,
            			'ref-y': .55,
            			'y-alignment': 'middle'
     				}}
	});

	uID = diamond.id;
	graph.addCell(diamond);
}

/********************************************************************************************************************************
Add a Square/Rectangle shape to the graph.  Rectangles contain text, color and text style.
*********************************************************************************************************************************/
function add_square(){
	$('#myModal').modal('show');	//display dialog box to edit the shape's information
	document.getElementById("green").checked = true;	//set default checkbox back to green
	document.getElementById("normal").checked = true;	//set default text-type back to default - normal
    	document.getElementById("name").value = "";		//Set text fields as empty.
	document.getElementById("comments").value = "";		//Set text fields as empty.

	var rect = new joint.shapes.basic.Rect({	//New instance of the Square shape.  
                position: { x:0, y:0 },				//Set position where shape will be spawned
		size:     { width: 0, height: 0 }		//Set size of shape
        });
        
	uID = rect.id;				//store ID value of the element just created. uID is used to determine which shape the dialog box is editing/changing
	graph.addCell(rect);		//add shape to the graphto be displayed
}

/********************************************************************************************************************************
Handles the doubleclick of an element.  It will grab the data from this element and display it in the popup
to be edited and saved.
*********************************************************************************************************************************/
paper.on('cell:pointerdblclick', function(cellView, evt, x, y) { 
	if(!linking){
		var elm = graph.getCell(cellView.model.id);			//get element that was clicked on
		if(!elm.isLink()){
		var txt = elm.attr('text/text');				//grab contect from element
		var com = elm.prop('comment');					//grab comment from element
		var color = elm.attr('rect/fill') || elm.attr('ellipse/fill') || elm.attr('path/fill');	//get color value back from element

		var type = elm.prop('type');		
		if (type=='basic.Rect' || type=='basic.Ellipse'){	//if the shape  is a square or oval
		
			$("input[name=optradio][value="+ color +"]").prop('checked', true);	//check radio button of element's color
			txt = txt.replace(/\n/g, " ");	//we just want the text to show on the field, not the tags
			$("input[name=optradio3][value="+ getStyle(elm) +"]").prop('checked', true);	//check the font-style of element
			document.getElementById("name").value = txt;
			document.getElementById("comments").value = com;

			uID = cellView.model.id;
			div_show();
		}else if(type=='basic.Path'){ 			//if the shape is a Diamond
			document.getElementById("comments2").value = com;
			$("input[name=radioDiaColor][value="+ color +"]").prop('checked', true);	//check radio button of element's color
			uID = cellView.model.id;
			
			document.getElementById("sad").checked = elm.prop('sad');
			document.getElementById("angry").checked = elm.prop('angry');
			document.getElementById("worried").checked = elm.prop('worried');
			document.getElementById("happy").checked =elm.prop('happy');
			document.getElementById("aroused").checked = elm.prop('aroused');
			document.getElementById("discomfort").checked = elm.prop('discomfort');
			document.getElementById("lonely").checked = elm.prop('lonely');
			document.getElementById("guilty").checked = elm.prop('guilty');
			document.getElementById("ashamed").checked = elm.prop('ashamed');
			$('#diaModal').modal('show');
		}
	  }
    }
    }
);

function getStyle(elm){
	if(elm.attr('text/font-style') == 'italic'){
		return 2;
	}else if(elm.attr('text/font-weight') == 'bold'){
		return 1;
	}else{
		return 0;
	}
}

/********************************************************************************************************************************
Change the text that is located inside of the element.  Change text/font-style based on checkboxes checked in the
popup menu.
*********************************************************************************************************************************/
function changeText(){
	var textBoxText = document.getElementById("name").value;
	var elm = graph.getCell(uID);
	var type = elm.prop('type');
	var x = Math.floor(getTextWidth(textBoxText, "14pt arial")) + 1;	//get rounded width of text inside element.
	var h,w ;

	//determine width and height of the textbox inside of the element, so the text fits nicely inside of the shape.
	if(type == "basic.Rect"){
		h = 16;
		w = 160;
	}else{
		h = 20;
		w = 135;
	}
	
	//If text is too long, the text will need to be wrapped to fit inside of the element.
	var wrappedText = joint.util.breakText(textBoxText, {
    		width: w
	});
	var style = parseInt($('input[name="optradio3"]:checked').val());
	elm.attr({text: {'font-weight': 'normal', 'font-style': 'normal'}});
	switch(style){
	  case(1): {elm.attr({text: {text: wrappedText, 'font-weight': 'bold'}});  //BOLD text
	  	    elm.resize(180, h*(Math.ceil(x/w))); break;}				
	  case(2): {elm.attr({text: {text: wrappedText, 'font-style': 'italic'}}); //ITALICIZED text
	            elm.resize(170, h*(Math.ceil(x/w)));  break;}			
	  default: {elm.attr({text: {text: wrappedText}}); 			//Normal text
	            elm.resize(170, h*(Math.ceil(x/w))); break;}			
		}//end switch	
			
	elm.prop('comment', document.getElementById("comments").value);	
}

//Function To Display Popup
function div_show() {
$('#myModal').modal('show');
}

/********************************************************************************************************************************
Hide Popup for oval or square/rect and submit new changes to the selected element.  
Also called the changeText() function.
*********************************************************************************************************************************/
function div_hide(){
	changeText();
	var elm = graph.getCell(uID);
	var type = elm.prop('type');
	if(type=="basic.Rect")						//IF the element is a RECTANGLE or OVAL - change attr 
	{
		var color = $('input[name="optradio"]:checked').val();	//get color from radio checked.
		elm.attr({
		     rect: { fill: color, stroke: '#000000'}
		});

	}else									//IF the element is an OVAL - change attr 
	{
		var color = $('input[name="optradio"]:checked').val();
		elm.attr({
		    ellipse: { fill: color, stroke: '#000000' }
		});
	}
	$('#myModal').modal('hide');
}

/********************************************************************************************************************************
When Save Changes button is pressed in the Diamond popup.
*********************************************************************************************************************************/
function div_hide_dia(){

var elm = graph.getCell(uID);
var textInBox = "";
var numChecked = 0;
if(document.getElementById('sad').checked){
	numChecked++;
	textInBox+="Sad\n";
	elm.prop('sad',true);
   }else{
	elm.prop('sad',false);
}
if(document.getElementById('angry').checked){
	numChecked++;
	textInBox+="Angry\n";
	elm.prop('angry',true);
   }else{
	elm.prop('angry',false);
}
if(document.getElementById('happy').checked){
	numChecked++;
	textInBox+="Happy\n";
	elm.prop('happy',true);
   }else{
	elm.prop('happy',false);
}
if(document.getElementById('aroused').checked){
	numChecked++;
	textInBox+="Aroused\n";
	elm.prop('aroused',true);
   }else{
	elm.prop('aroused',false);
}
if(document.getElementById('worried').checked){
	numChecked++;
	textInBox+="Worried\n";
	elm.prop('worried',true);
   }else{
	elm.prop('worried',false);
}
if(document.getElementById('discomfort').checked){
	numChecked++;
	textInBox+="Discomfort\n";
	elm.prop('discomfort',true);
   }else{
	elm.prop('discomfort',false);
}
if(document.getElementById('ashamed').checked){
	numChecked++;
	textInBox+="Ashamed\n";
	elm.prop('ashamed',true);
   }else{
	elm.prop('ashamed',false);
}
if(document.getElementById('lonely').checked){
	numChecked++;
	textInBox+="Lonely\n";
	elm.prop('lonely',true);
   }else{
	elm.prop('lonely',false);
}
if(document.getElementById('guilty').checked){
	numChecked++;
	textInBox+="Guilty\n";
	elm.prop('guilty',true);
   }else{
	elm.prop('guilty',false);
}
if(numChecked > 3){
	alert("Too many boxes checked.  You can only have up to 3 boxes checked.");
	return;
}

elm.attr({text: {text: textInBox}});

var com = document.getElementById('comments2').value;
var color = $('input[name="radioDiaColor"]:checked').val();
elm.prop('comment',com);

  elm.attr({
    'path': { fill: color, stroke: '#000000' }
	});
 
elm.prop('size/width', 120);
elm.prop('size/height', 120);		//now that the save button was clicked, 'display' the element
$('#diaModal').modal('hide');
}

//Function to serialize graph
function serialize_graph(){
jsonString = JSON.stringify(graph.toJSON());
console.log(jsonString);
}

//Function to deserialize graph
function deserialize_graph(){
graph.fromJSON(JSON.parse(jsonString));
//console.log(JSON.parse(jsonString));
}

function remove_shape(){
	graph.getCell(uID).remove();
	$('#myModal').modal('hide');
}

function remove_dia(){
	graph.getCell(uID).remove();
	$('#diaModal').modal('hide');
}

function save_to_database_prep(){
	$('#passModal').modal('show');
}
function save_to_database_new_prep()
{
	$('#passNewModal').modal('show');
}
function save_proceed(){
	var password = document.getElementById("pw").value;
	var password2 = document.getElementById("pwCon").value;
	if(password.length<5 || password!=password2)
	{
		alert("Map Password error. Map Password must be at least five characters in length and match confirmation.");
		return;
	}
	document.getElementById("fmap_json").value = CryptoJS.AES.encrypt(JSON.stringify(graph.toJSON()),document.getElementById("pw").value);
	$('#passModal').modal('hide');
	$('#saveModal').modal('show');
}
function save_proceed_new()
{
	var password = document.getElementById("pwNew").value;
	var password2 = document.getElementById("pwConNew").value;
	if(password.length<5 || password!=password2)
	{
		alert("Map Password error. Map Password must be at least five characters in length and match confirmation.");
		return;
	}
	
	document.getElementById("new_json").value = CryptoJS.AES.encrypt(JSON.stringify(graph.toJSON()),document.getElementById("pwNew").value);
	
	//set default values
	document.getElementById("new_title").value = gon.id.title;
	document.getElementById("new_family").value = gon.id.family;
	document.getElementById("new_extra").value = gon.id.extra;
	document.getElementById("new_notes").value = gon.id.notes;
	document.getElementById("new_version").value = gon.id.version;
	$('#passNewModal').modal('hide');
	$('#saveNewModal').modal('show');
}
function div_save_hide()
{
	$('#saveModal').modal('hide');
}

function save_to_database()
{
	title = document.getElementById("fmap_title").value;
	if(title == ""){
		alert("Please include a title before saving");
	}
	else{
		alert('Family Map Saved');
		$('#saveModal').modal('hide');
	}
}
function save_to_database_as_new()
{
	title = document.getElementById("new_title").value;
	if(title == ""){
		alert("Please include a title before saving");
	}
	else{
		alert('Family Map Saved');
		$('#saveNewModal').modal('hide');
		// Probably about here is where it would be nice to redirect
		// to fix the issue of accidentally saving over another fmap
		// $('#save_dropdown').show();
	}
}
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};
function div_txt_show()
{	
	var password = document.getElementById("txtPW").value;
	var password2 = document.getElementById("txtPWCon").value;
	if(password.length<5 || password!=password2)
	{
		alert("Text Password error. Text Password must be at least five characters in length and match confirmation.");
		return;
	}
	$('#passTxtDownloadModal').modal('hide');
	$('#txtModal').modal('show');
}
function div_txt_pw_show()
{
	$('#passTxtDownloadModal').modal('show');
}
function div_txt_imp_show()
{
	$('#passTxtUploadModal').modal('show');
}
function div_chooser_show()
{
	$('#passTxtUploadModal').modal('hide');
	$('#txtImportModal').modal('show');
}
function make_graph()
{
	// if password is wrong this will fail so let the user know about it
	try {
		var decrypted = CryptoJS.AES.decrypt(gon.id.json, document.getElementById("dec").value);
		$('#decModal').modal('hide');
	} catch(err) {
		$('#decModalLabel').html("Incorrect password, try again.").fadeIn(500).fadeOut(500).fadeIn(500)
			.fadeOut(500).fadeIn(500);
		$('#dec').val("").focus();
	}
	graph.fromJSON(JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)));
}
function download()
{
	var fileNameToSaveAs = document.getElementById("fileName").value;
	var txtTest = fileNameToSaveAs.slice(-4);
	
	if(txtTest!=".txt" || fileNameToSaveAs.length < 5)
	{
		alert("File name error. File name must start with a valid character and end with \".txt\" ");
		return;
	}
	
	var textToWrite = CryptoJS.AES.encrypt(JSON.stringify(graph.toJSON()),document.getElementById("txtPW").value);
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.webkitURL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}
	downloadLink.click();
	$('#txtModal').modal('hide');
}
function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}
function loadFileAsText()
{
	var fileToLoad = document.getElementById("fileToLoad").files[0];
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		///document.getElementById("inputTextToSave").value = textFromFileLoaded;
		var decrypted = CryptoJS.AES.decrypt(textFromFileLoaded, document.getElementById("txtUpPW").value);
		graph.fromJSON(JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)));
		//graph.fromJSON(JSON.parse(textFromFileLoaded));
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
	$('#txtImportModal').modal('hide');
}
;