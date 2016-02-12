var uID;
var jsonString;

var erd = joint.shapes.erd;
var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({
	    el: $('#paper'),
	    width: (screen.width-85),
	    height: (screen.height-100),
	    gridSize: 1,
	    perpendicularLinks: false,
	    linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
	    model: graph
	});
	
	var commandManager = new joint.dia.CommandManager({ graph: graph });
	
	$('#undo').on('click', _.bind(commandManager.undo, commandManager));
	$('#redo').on('click', _.bind(commandManager.redo, commandManager));
	
/*I dont know why this exists, so i commented it out
var element = function(elm, x, y, label) {
    var cell = new elm({ 
    	position: { x: x, y: y }, 
    	   attrs: { text: { text: label }}});
    graph.addCell(cell);
    return cell;
};
*/

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
function clickToLink(){

  if(!linking){
	  linking = true;			//global variable to allow pointerclick event(below) to run
	  linkSource = -1;			//holds the ID of the source element
	  linkTarget = -1;			//holds the ID of the target element
	  
	  $('.navbar-btn').prop('disabled', true);		//disabled all buttons on nav bar while linking is enabled 
	  $('#arrowOptionsButton').prop('disabled', false);	//except for the Add Arrow button
  	  $('#arrowOptionsButton').html('Cancel');		//change arrow button to Cancel, to cancel linking
	  $('.element').css('cursor','pointer');		//so the user knows its clickable
	  $('#arrow_note').css('display', 'inline-block');
  	}else{				//handles cancel button
  	  linking = false;
  	  if(linkSource != -1){paper.findViewByModel(linkSource).unhighlight(linkSource);}
  	  if(linkTarget != -1){paper.findViewByModel(linkTarget).unhighlight(linkTarget);}
  	  $('#arrowOptionsButton').html('Add Arrow');
  	  $('.navbar-btn').prop('disabled', false);
	  $('.element').css('cursor','move');
	  $('#arrow_note').css('display', 'none');
	} 	
}

/********************************************************************************************************************************
When linking is true, allow the user to click on an element for linking. Linking is turned on when 'Add Arrow' button
is pressed.
*********************************************************************************************************************************/
paper.on('cell:pointerclick', function(cellView, evt, x, y){
	  if(linking){

		      var cell = cellView.model.id;

		      if(cell == linkSource){				//if the user clicks on a cell that was already highlighted
		      		paper.findViewByModel(linkSource).unhighlight(linkSource); //unhighlight and
		      		linkSource = -1;					//default back to -1
		      }else 
		      if(cell == linkTarget){				//same as above for linkTarget
		      		paper.findViewByModel(linkTarget).unhighlight(linkTarget); 
		      		linkTarget = -1;
		      }else 
		      if(linkSource == -1 && linkTarget != cell){	//make sure source is -1 and that the target is not the same as the source
		      
		          if(!(graph.getCell(cell).isLink())){		//make sure its not a link
		      	    linkSource = cell;				
		      	    paper.findViewByModel(cell).highlight(cell);//highlight for looks
		      	  }
		      	  
		      }else 
		      if(linkTarget == -1 && linkSource != cell){	//make sure target is -1 and that the source is not the same as the target
		      
		         if(!(graph.getCell(cell).isLink())){		
		      	  linkTarget = cell;
		      	  paper.findViewByModel(cell).highlight(cell);
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
heads:   	integer refering to number of arrow heads (0,1,2)
dashed:  	boolean for if the link is dashed or not
*********************************************************************************************************************************/
function add_link(col, heads, dashed){
    l = new erd.Line({
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
	paper.findViewByModel(linkTarget).unhighlight(linkTarget);
	linkSource = -1;
	linkTarget = -1;
	$('.basic').css('cursor','move');
	$('#arrowOptionsButton').html('Add Arrow');
	$('.navbar-btn').prop('disabled', false);
	 $('#arrow_note').css('display', 'none');
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

	var oval = new joint.shapes.basic.TextBlockC({
                position: { x:0, y:0 },
				size: { width: 0, height: 0 }			//size to 0,0 so it will not show while setting it up							
        });
	
	uID = oval.id;				
	graph.addCell(oval);
}

/********************************************************************************************************************************
Add a Diamond shape to the graph.  Ovals contain text, color and text style.
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
    document.getElementById("comments2").value = "";

	var diamond = new joint.shapes.basic.TextBlockD({
                position: { x:0, y:0 },
                size: { width: 0, height: 0 }			//size to 0 so it will not be displayed right away
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
    document.getElementById("name").value = "";			//Set text fields as empty.
	document.getElementById("comments").value = "";		//Set text fields as empty.

	var textBlock = new joint.shapes.basic.TextBlock({	//New instance of the Square shape.  
                position: { x:0, y:0 },			//Set position where shape will be spawned
		size:     { width: 0, height: 0 },		//Set size of shape
        content:  "",							//The text content that is displayed inside of the shape.
		comment:  ""							//Comment is the textbox under the Advanced button
        });
        
	uID = textBlock.id;				//store ID value of the element just created. uID is used to determine which shape the dialog box is editing/changing
	graph.addCell(textBlock);		//add shape to the graphto be displayed
}

/********************************************************************************************************************************
Handles the doubleclick of an element.  It will grab the data from this element and display it in the popup
to be edited and saved.
*********************************************************************************************************************************/
paper.on('cell:pointerdblclick', function(cellView, evt, x, y) { 
		var elm = graph.getCell(cellView.model.id);			//get element that was clicked on
		if(!elm.isLink()){
		var txt = elm.prop('content');						//grab contect from element
		var com = elm.prop('comment');						//grab comment from element
		var color = elm.attr('rect/fill') || elm.attr('.outer/fill');	//get color value back from element
		$("input[name=optradio][value="+ color +"]").prop('checked', true);	//check radio button of elements color

		txt = txt.replace(/<strong>|<\/strong>|<em>|<\/em>/g, "");	//we just want the text to show on the field, not the tags

		var type = elm.prop('type');		
		if (type=='basic.TextBlock' || type=='basic.TextBlockC')	//if the shape  is a square or oval
		{
			$("input[name=optradio3][value="+ getTextType(elm.prop('content')) +"]").prop('checked', true);
			document.getElementById("name").value = txt;
			document.getElementById("comments").value = com;

			uID = cellView.model.id;
			div_show();
		}else if(type=='basic.TextBlockD')				//if the shape is a Diamond
		{
			document.getElementById("comments2").value = com;
		
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
);

/********************************************************************************************************************************
Only called from the double click event.  Checks the content string for strong OR em tags.  Returns the value from 0-2 depending
on result so the Text Type radio buttons are appropriately checked when modal opens.
*********************************************************************************************************************************/
function getTextType(cont){
	if(cont.indexOf('<strong>') >= 0 && cont.indexOf('<\/strong>') >= 0){
		return "1";
	}else if(cont.indexOf('<em>') >= 0 && cont.indexOf('<\/em>') >= 0){
		return "2";
	}else{
		return "0";
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
	var sLen = 208;
	var oLen = 110;
	
	//Used for resizing the element depending on the amount of text in the textbox*
	if(type=="basic.TextBlock"){				//if the element is a square(208 per line)
		elm.resize(170, 20*(Math.ceil(x/sLen)));
	}else{							//else meaning it is an Oval
		elm.resize(170, 20*(Math.ceil(x/oLen)));
	}
	
	var style = parseInt($('input[name="optradio3"]:checked').val());
	switch(style){
	  case(1): {elm.prop('content', '<strong>' + textBoxText +'</strong>'); break;}	//BOLD text
	  case(2): {elm.prop('content', '<em>' + textBoxText +'</em>'); break;}		//ITALICIZED text
	  default: {elm.prop('content', textBoxText);break;}				//Normal text
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
	if(type=="basic.TextBlock")					//IF the element is a RECTANGLE or OVAL - change attr 
	{
		var color = $('input[name="optradio"]:checked').val();	//get color from radio checked.
		elm.attr({
		    rect: { fill: color, stroke: '#000000' }
		});

	}else									//IF the element is an OVAL - change attr 
	{
		var color = $('input[name="optradio"]:checked').val();
		elm.attr({
		    '.outer': { fill: color, stroke: '#000000' }
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
	textInBox+="Sad ";
	elm.prop('sad',true);
   }else{
	elm.prop('sad',false);
}
if(document.getElementById('angry').checked){
	numChecked++;
	textInBox+="Angry ";
	elm.prop('angry',true);
   }else{
	elm.prop('angry',false);
}
if(document.getElementById('happy').checked){
	numChecked++;
	textInBox+="Happy ";
	elm.prop('happy',true);
   }else{
	elm.prop('happy',false);
}
if(document.getElementById('aroused').checked){
	numChecked++;
	textInBox+="Aroused ";
	elm.prop('aroused',true);
   }else{
	elm.prop('aroused',false);
}
if(document.getElementById('worried').checked){
	numChecked++;
	textInBox+="Worried ";
	elm.prop('worried',true);
   }else{
	elm.prop('worried',false);
}
if(document.getElementById('discomfort').checked){
	numChecked++;
	textInBox+="Discomfort ";
	elm.prop('discomfort',true);
   }else{
	elm.prop('discomfort',false);
}
if(document.getElementById('ashamed').checked){
	numChecked++;
	textInBox+="Ashamed ";
	elm.prop('ashamed',true);
   }else{
	elm.prop('ashamed',false);
}
if(document.getElementById('lonely').checked){
	numChecked++;
	textInBox+="Lonely ";
	elm.prop('lonely',true);
   }else{
	elm.prop('lonely',false);
}
if(document.getElementById('guilty').checked){
	numChecked++;
	textInBox+="Guilty ";
	elm.prop('guilty',true);
   }else{
	elm.prop('guilty',false);
}
if(numChecked > 3){
	alert("Too many boxes checked.  You can only have up to 3 boxes checked.");
	return;
}

textInBox = textInBox.trim();
textInBox = textInBox.replace(/ /g, " <br> ");			//Replace all spaces with a plus sign
elm.prop('content',textInBox);

var com = document.getElementById('comments2').value;
elm.prop('comment',com);

if(document.getElementById('dia_green').checked) {
  elm.attr({
    '.outer': { fill: '#77DD77', stroke: '#000000' }//green
	});
	}else if(document.getElementById('dia_blue').checked) {
	  elm.attr({
	    '.outer': { fill: '#B4CFEC', stroke: '#000000' }//blue
	}); 
	}else if(document.getElementById('dia_red').checked) {
	  elm.attr({
	    '.outer': { fill: '#FF7575', stroke: '#000000' }//red
	}); 
	}else if(document.getElementById('dia_violet').checked) {
	  elm.attr({
	    '.outer': { fill: '#B19CD9', stroke: '#000000' }//violet
	}); 
	}else if(document.getElementById('dia_yellow').checked) {
	  elm.attr({
	    '.outer': { fill: '#FDFD96', stroke: '#000000' }//yellow
	}); 
	}else if(document.getElementById('dia_orange').checked) {
	  elm.attr({
	    '.outer': { fill: '#FFB347', stroke: '#000000' }//orange
	}); 
}
elm.resize(120, 120);			//now that the save button was clicked, 'display' the element
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
