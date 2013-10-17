	function isIE() {
		var FF = !(window.mozInnerScreenX == null);
		var myNav = navigator.userAgent.toLowerCase();
		var ie= (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1])
				: false;
		return FF || ie;
	}
	$(document).ready(function() {
		
		$("a[rel^='prettyPhoto']").prettyPhoto();
	});
	
	
	
var main_title = "";
main_title += "";
main_title += "The DATAD process is for building agile data-driven solutions that are designed for highly changeable environments.";
main_title += "<br/>";
main_title += "<br/>";
main_title += "<img src=resources/img/BestViewedOnGoogleChrome.png width=120 />";

var titles = [
  "What We Do",
  "Our Mission",
  "The Team",
  "Recommendations",
  "The Product",
  "Free Consultation",
];

var header_height = 0.405;
var header_width = 0.65;

var menu_height = 0.405;
var menu_width = 0.65;

var tooltext = "&nbsp;Click to Rotate Cube.&nbsp;";
var started =false;
var star_on = false;
var star_idx = 1;
var pics = ["resources/img/DatadSlide1.jpg",
            "resources/img/DatadSlide2.jpg",
            "resources/img/DatadSlide3.jpg",
            "resources/img/DatadSlide4.jpg",];
function start_star() {
	resetPauseButton();
	started=true;
  star.callback = function() {
    if (!star_on) return;
    star_timer = setTimeout(function() {
      if (!star_on) return;
      star.hole = star.pic;
      var img = new Image();
      star_idx += 1;
      img.src = pics[star_idx % pics.length];
      star.pic = img;
      star.apply();
    },5000);
  }
  star_on = true;
  star.apply();
}

var star_timer = null;
function stop_star() {
  clearInterval(star_timer);
  star_on = false;
}
// 640/14 = 45.71
// 640/16 = 40
// 400/16 = 25
//      
//    

var text = "";

	text += "                                       "
	text += "                                       "
	text += "                                       "
	text += "                                       "
	text += "   The DATAD mission is to honour      "
	text += "   the wealth of data that is here.    "
	text += "                                       "
	text += "                                       "
	text += "    Our vision is to serve and         "
	text += "    inspire the world's leading        "
	text += "    health entrepreneurs by            "
	text += "    measuring and maintaining the      "
	text += "    value of their data assets         " 
	text += "    and evovling data ecosystems.      " 
	text += "                                       "
	text += "                                       "
	text += "                                       "
	text += "                                       "
	text += "                                       "
	text += "                                       "

//last line is bleed

var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.   "
chars += new Array(5).join(text.replace(/ /g,''));

function restartMatrix() {
  start();
  matrixGo();
}

var actions = [
  [start_star,stop_star],
  [restartMatrix,matrixStop],
  [null,null],
  [null,null],
  [null,null],
  [null,null],
];

//Thanks, message received.  We will be in contact.

function saveContactDetails(){
	if(!isIE())
		rotate('u',function() {rotate('u',function() {rotate('u',function() {rotate('u')})})});
	var data = new FormData();
	var name = $("#name").val();
	var organisation = $("#organisation").val();
	var email = $("#email").val();
	var vision = $("#vision").val();
	data.append("data" , name + ',' + organisation + ',' + email + ',' + vision );
	var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
	xhr.open( 'post', 'controller.php', true );
	xhr.send(data);
	$("#name").val('');
	$("#organisation").val('');
	$("#email").val('');
	$("#vision").val('');
	$("#thanks").html('<center>Message received.  <br><br><strong>Thank you.</strong><br><br> We will be in contact.<center>');
	$("#thanks").css("height", 350); 
	$("#namebox").hide();
	$("#organisationbox").hide();
	$("#emailbox").hide();
	$("#visionbox").hide();
	$("#sendbutton").hide();
}