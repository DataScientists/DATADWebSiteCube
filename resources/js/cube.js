//var cube = $('#cube');
var nxt = null;
var cube = null;
var shell = null;
var css_playing = null;
var db = null;
var revealCurrentPage= 0;
var playing = false;

var ui = false;

var r = 0;
var identity = [1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1];

r = -Math.PI / 2.0;
var right = [Math.cos(r),0,-Math.sin(r),0,
             0,1,0,0,
             Math.sin(r),0,Math.cos(r),0,
             0,0,0,1];

r = Math.PI / 2.0;
var left = [Math.cos(r),0,-Math.sin(r),0,
            0,1,0,0,
            Math.sin(r),0,Math.cos(r),0,
            0,0,0,1];

r = -Math.PI / 2.0;
var up = [1,0,0,0,
          0,Math.cos(r),Math.sin(r),0,
          0,-Math.sin(r),Math.cos(r),0,
          0,0,0,1];

r = Math.PI / 2.0;
var down = [1,0,0,0,
          0,Math.cos(r),Math.sin(r),0,
          0,-Math.sin(r),Math.cos(r),0,
          0,0,0,1];
function nextFirst(){
	if(isIE()){
		$('#to_5').click();
		window.location.href="#/slide5";
	}
	else
		{
		rotate('u');
		}
}

function mat_x_mat(a,b) {
  var c = new Array();
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var sum = 0;
      sum += a[i*4+0]*b[0+j];
      sum += a[i*4+1]*b[4+j];
      sum += a[i*4+2]*b[8+j];
      sum += a[i*4+3]*b[12+j];
      c.push(sum);
    }
  }
  return c;
}

function label() { return "" + Math.round(Math.random()*1000000)}

function mat_to_css(mat) {
  css = "matrix3d(";
  for (var i = 0; i < mat.length; i++) {
    css += mat[i].toFixed(9);
    if (i < mat.length-1) css += ',';
  }
  return css + ')';
}

var dirs = [1,2,5,3,4,6];

function sides_turn(sides,dir) {
  var maps = {
    'r':[1,3,2,4,0,5],
    'l':[4,0,2,1,3,5],
    'u':[2,1,3,5,4,0],
    'd':[5,1,0,2,4,3],
  }
  var turned = new Array();
  for (var i = 0; i < 6; i++) {
    turned.push(sides[maps[dir][i]]);
  }
  return turned;
}

var side_dirs = {1:dirs};
var side_mats = {1:identity};
for (var i = 2; i <= 6; i++) {
  /*
  if (i % 2 == 0) {
    side_dirs[i] = sides_turn(side_dirs[i-1],'r');
    side_mats[i] = mat_x_mat(side_mats[i-1],right);
  } else {
    side_dirs[i] = sides_turn(side_dirs[i-1],'u');
    side_mats[i] = mat_x_mat(side_mats[i-1],up);
  }
  */
  switch(i) {
    case 2:
      side_dirs[i] = sides_turn(dirs,'r');
      side_mats[i] = mat_x_mat(identity,right);
      break;
    case 3:
      side_dirs[i] = sides_turn(sides_turn(dirs,'r'),'r');
      side_mats[i] = mat_x_mat(mat_x_mat(identity,right),right);
      break;
    case 4:
      side_dirs[i] = sides_turn(dirs,'l');
      side_mats[i] = mat_x_mat(identity,left);
      break;
    case 5:
      side_dirs[i] = sides_turn(dirs,'u');
      side_mats[i] = mat_x_mat(identity,up);
      break;
    case 6:
      side_dirs[i] = sides_turn(dirs,'d');
      side_mats[i] = mat_x_mat(identity,down);
      break;
  }
}
console.log(JSON.stringify(side_dirs));

function show_sides(sides) {
  console.log('u:' + sides[2] + ' l:' + sides[4] + ' ' + sides[0] + ' r:' + sides[1] + ' d:' + sides[5]);
}

var state = 1;
var slide = null;
var mat = identity;
var size;
var edge;
var roof;

function animate(css_prev,css_trans,css_now) {
  playing = true;
  //$('.nav').remove();
  ui = false;
  var lbl = label();
  var prefixes = ['-webkit-','-moz-','-ms-','-o-',''];
  if (css_now != null) css_prev = mat_to_css(identity);
  css = "";
  for (var i = 0; i < prefixes.length; i++) {
    css += "@" + prefixes[i] + "keyframes anim_" + lbl + " {0% {" + prefixes[i] + "transform: " + css_prev + "} 100% {" + prefixes[i] + "transform: " + css_trans + "}}\n";
    css += ".anim_" + lbl + " {" + prefixes[i] + "animation-name: anim_" + lbl + "; " + prefixes[i] + "animation-duration: 1s; " + prefixes[i] + "animation-iteration: 1; " + prefixes[i] + "animation-timing-function: ease-in-out; " + prefixes[i] + "transform: " + css_trans + "}\n"
  }
  css_playing.html(css);
  if (css_now) {
    shell.attr('class','anim_' + lbl);
  } else {
    cube.attr('class','anim_' + lbl);
    cube.css({'transform':css_trans});
  }
  setTimeout(function() {
    shell.attr('class','');
    cube.attr('class','');
    if (css_now == null) css_now = css_trans;
    cube.css({'transform':css_now});
    slide = $('#slide_' + state);
    playing = false;
    clearTimeout(correction);
    correction = setTimeout(correct,1000);
    if (nxt) {
      var ign = function(f) {setTimeout(f,0);}(nxt);
      nxt = null;
    }
  },1100);
}

var vec = 0;
function fill_menu() {
  for (var i = 1; i <= 6; i++) {
    var link = $('#to_' + i);
    link.attr('class','');
    link.unbind('click');
    if(!isIE()){
	    if (i == dirs[1]) link.click(function() {rotate('r')});
	    if (i == dirs[2]) link.click(function() {rotate('u')});
	    if (i == dirs[3]) link.click(function() {rotate('u',function() {rotate('u')})});
	    if (i == dirs[4]) link.click(function() {rotate('l')});
	    if (i == dirs[5]) link.click(function() {rotate('d')});
	    $('#to_' + dirs[0]).attr('class','highlight');
    }
    else
	{
    	link.attr('href','#/slide'+i);
    	link.click(function(){
    		$(".inner_menu a").attr('class',"");$(this).attr('class','highlight');
    		state =i;
    	})
    	if(i==1)
    		$(link).attr('class','highlight');
	    /*if (i == 1) link.click(function() {Reveal.slide( 0 );});
	    if (i == 2) link.click(function() {Reveal.slide( 1 );});
	    if (i == 3) link.click(function() {Reveal.slide( 2 );});
	    if (i ==4) link.click(function() {Reveal.slide( 3 );});
	    if (i == 5) link.click(function() {Reveal.slide( 4 );});
	    if (i == 6) link.click(function() {Reveal.slide( 5 );});*/
	}
  }
  
}

function rotate(dir,clbck) {
  if (clbck) nxt = clbck;
  if (playing) return;
  playing = true;
  $("#nav").show();
  if (actions[state-1][1] != null) setTimeout(actions[state-1][1],0);

  dirs = sides_turn(dirs,dir); 
  state = dirs[0];
  //$('#header').html(titles[state-1]);
  $('#header').html(main_title);
  fill_menu();

  if (actions[state-1][0] != null) setTimeout(actions[state-1][0],0);

  var css_prev = mat_to_css(mat);
  var trans = ({'u':up,'d':down,'l':left,'r':right})[dir];
  mat = mat_x_mat(mat,trans);
  var css_now = mat_to_css(mat);
  animate(css_prev,mat_to_css(trans),css_now);
}

correction = null;
function correct() {
  if (playing) return;
  if (dirs[5] == side_dirs[state][5]) return;
  playing = true;

  var r = -Math.PI / 2.0;
  if (dirs[5] == side_dirs[state][2]) {
    r = Math.PI;
  } else {
    if (dirs[5] == side_dirs[state][4]) {
      r = -1*r;
    }
  }

  var rot = [Math.cos(r),Math.sin(r),0,0,
             -Math.sin(r),Math.cos(r),0,0,
             0,0,1,0,
             0,0,0,1];

  var css_prev = mat_to_css(mat);
  mat = side_mats[state];
  animate(css_prev,mat_to_css(rot),mat_to_css(mat));

  dirs = side_dirs[state];
  fill_menu();

  return false;
}

function nav(ths) {
  rotate($(ths.parentElement).attr('key'));
  return false;
}

$(function() {
	

  //var cube = $('#cube');
  cube = $('#cube');
  shell = $('#shell');
  css_playing = $('#playing');

  var viewport = $('#viewport');
  var aspect = $('#aspect');
  var side_1 = $('#side_1');
  var win = $(window);
  
  var resize_timer = null;
  var w;
  function resize() {
    size = Math.round(640 / 2.0);
    w = win.width();

    var sides = [
      ['#side_1','rotateY(0deg)'],
      ['#side_2','rotateY(90deg)'],
      ['#side_3','rotateY(180deg)'],
      ['#side_4','rotateY(-90deg)'],
      ['#side_5','rotateX(90deg)'],
      ['#side_6','rotateX(-90deg)'],
    ];
    if(!isIE()){
	    for (var i = 0; i < sides.length; i++) {
	      var side = sides[i];
	      var transform = side[1];
	      side = side[0];
	      $(side).css({'transform':transform + ' translateZ(' + size + 'px)'});
	    }
    }

    $('#side_7').css({'transform':'translateZ(' + size + 'px)'});

    //edge = $('#slide_' + state).offset().left;
    edge = (viewport.width()-size*2.0)/2.0;
    //roof = $('#slide_' + state).offset().top;
    roof = (viewport.height()-size*2.0)/2.0;

    $('#stand').css({'transform':'translateZ(-' + size + 'px)'});

    $('.nav_plate').remove();
    for (var i = 0; i < 4; i++) {
      var plt = $(document.createElement('div'));
      plt.addClass('nav_plate');
      var tip = $(document.createElement("div"));
      tip.html(tooltext);
      tip.addClass('tooltip');
	  $("#nav").show();
      switch(i) {
        case 0:
          plt.css({'top':'0px','left':'0px','right':'0px','height': Math.round(roof+(10.0)) + 'px'});		  
          plt.click(function() {rotate('u')});
          break;
        case 1:
          plt.css({'top':'0px','bottom':'0px','right':'0px','left':Math.round((edge+size*2.0)-(10.0)) + 'px'});
          plt.click(function() {rotate('r')});
          break;
        case 2:
          plt.css({'top':'0px','bottom':'0px','left':'0px','width':Math.round(edge+(10.0))+'px'});
		  plt.click(function() {rotate('l')});
          break;
        case 3:
          plt.css({'top':Math.round((roof+size*2.0)-(10.0))+'px','left':'0px','right':'0px','bottom':'0px'});
          plt.click(function() {rotate('d')});
          break;
      }
      plt.append(tip);
      $('#nav_plates').append(plt);
      switch(i) {
        case 0:
          tip.css({'top':Math.round(roof-tip.height())+'px','left':Math.round(edge+320-tip.width()/2.0) + 'px','width':'186px'});
          tip.attr('id','nav_top');
          break;
        case 1:
          tip.css({'right':Math.round(edge-(tip.width()/2.0)-(tip.height()/2.0)) + 'px','top':Math.round(roof+320-(tip.height()/2.0)) + 'px','width':'186px'});
          tip.css({'transform':'rotate(90deg)'});
          tip.attr('id','nav_right');
          break;
        case 2:
          tip.css({'left':Math.round(edge-tip.width()/2.0-tip.height()/2.0) + 'px','top':Math.round(roof+320-tip.height()/2.0) + 'px','width':'186px'});
		  console.log('edge:' + edge + ' tip width:' + tip.width()+ ' tip height:' + tip.height());
          tip.css({'transform':'rotate(-90deg)'});
          tip.attr('id','nav_left');
          break;
        case 3:
          tip.css({'bottom':Math.round(roof-tip.height())+'px','left':Math.round(edge+320-tip.width()/2.0)+'px','width':'186px'});
          tip.attr('id','nav_bottom');
          break;
      }
    }

    var header_height_p = Math.round(header_height*size*2.0);
    var header_width_p = Math.round(header_width*edge);
    $('#header').css({'top':Math.round(roof+size-(header_height_p/2.0)) + 'px',
                      'left':Math.round((edge/2.0)-(header_width_p/2.0)) + 'px',
                      'width':Math.round(header_width_p) + 'px',
                      'height':Math.round(header_height_p) + 'px'
                     })

    var menu_height_p = Math.round(menu_height*size*2.0);
    var menu_width_p = Math.round(menu_width*edge);
    $('#menu').css({'top':Math.round(roof+size-(menu_height_p/2.0)) + 'px',
                      'left':Math.round((edge+size*2.0)+(edge/2.0)-(menu_width_p/2.0)) + 'px',
                      'width':Math.round(menu_width_p) + 'px',
                      'height':Math.round(menu_height_p) + 'px'
                     })

  }

  db = resize;
  $(window).resize(function() {
    clearTimeout(resize_timer);
    resize_timer = setTimeout(resize,1000);
  });

  resize();
  resize_timer = setTimeout(resize,1000);
  $('#header').html(main_title);
  {
    var html = "<div class=\"outer_menu\"><div class=\"inner_menu\">\n";
    for (var i = 1; i <=6; i++) {
      html += "\t<a id=\"to_" + i + "\" href=\"#\">" + titles[i-1] + "</a><br/>\n";
    }
    html += "</div></div>\n";
    $('#menu').html(html);
    $('#to_' + state).attr('class','highlight');
  }
  fill_menu();

  for (var i = 1; i <= 6; i++) {
    var dirs = side_dirs[i];
    var slide = $('#slide_' + i);
    var map = [2,1,5,4]
    for (var j = 0; j < 4; j++) {
      var nav = $(document.createElement('div'));  
      nav.html('&nbsp;' + titles[dirs[map[j]]-1] + '&nbsp;');
      nav.addClass('nav');
      slide.append(nav);
      switch(j) {
        case 0:
          nav.css({'top':'-1px','left':Math.round(320-nav.width()/2.0) + 'px'});
          break;
        case 1:
          nav.css({'right':'-96px','top':Math.round(320-(nav.height()/2.0)) + 'px'});
          nav.css({'transform':'rotate(90deg)'});
          break;
        case 2:
          nav.css({'bottom':'-20px','left':Math.round(320-nav.width()/2.0) + 'px'});
          break;
        case 3:
          nav.css({'left':'-96px','top':Math.round(320-(nav.height()/2.0)) + 'px'});
          nav.css({'transform':'rotate(-90deg)'});
          break;
      }
     
    }
  }

  setTimeout(function() {
    cube.attr('class','spinin');
  },3000);

  setTimeout(function() {
    $('#header').css({'display':'block'});
    $('#menu').css({'display':'block'});
    $('body').addClass('nav_active');
    setTimeout(function() {
      $('#header').css({'opacity':'1'});
      $('#menu').css({'opacity':'1'});
    },1000);
  },6000);

  playing = true;
  setTimeout(function() {
    resize();
    playing = false;
    if (actions[0][0] != null) setTimeout(actions[0][0],0);
  },6000);

  setTimeout(function() {
    resize();
  },7000);

  if (document.createTouch != undefined) {
    setTimeout(function() {
      //alert('Use a one-finger sliding motion to control the cube. On the iPhone, this website is best viewed in full-screen landscape mode.');
    },7000);
  }

  var current = identity;
/*
  $(document).keydown(function(evt) {
    if (playing) return;
    switch(evt.keyCode) {
      case 87:
      case 38:
        //console.log('u');
        //dirs = sides_turn(dirs,'u');
        rotate('u');
        break;
      case 68:
      case 39:
        //console.log('r');
        //dirs = sides_turn(dirs,'r');
        rotate('r');
        break;
      case 83:
      case 40:
        //console.log('d');
        //dirs = sides_turn(dirs,'d');
        rotate('d');
        break;
      case 65:
      case 37:
        //console.log('l');
        //dirs = sides_turn(dirs,'l');
        rotate('l');
        break;
    }
  });
*/

  function hover(activate) {
    if (activate) {
      ui = true;
      resize();
      for (var i = 0; i < 4; i++) {
        var div = document.createElement('div');
        var title = titles[dirs[4]-1];
        if (i % 2 == 0) {
          if (i == 2) {
            title = titles[dirs[1]-1];
          }
          var letters = title.split('');
          title = '';
          var vert = '';
          for (var j = 0; j < letters.length; j++) {
            if (letters[j] == ' ') letters[j] = "&nbsp;";
            title += "<span>" + letters[j] + "</span>\n";
          }
          div.innerHTML = title;
          $(div).attr('class','nav');
          $('body').append(div);
          if (i == 2) {
            $(div).click(function() {rotate('r')});
            $(div).css({'left':Math.round((edge+size*2)-1-$(div).width()/2.0) + 'px',
                        'top':Math.round(roof+size-1-$(div).height()/2.0) + 'px'});
          } else {
            $(div).click(function() {rotate('l')});
            $(div).css({'left':Math.round(edge-1-$(div).width()/2.0) + 'px',
                        'top':Math.round(roof+size-1-$(div).height()/2.0) + 'px'});
          }
        } else {
          if (i == 1) {
            title = titles[dirs[2]-1];
          } else {
            title = titles[dirs[5]-1];
          }
          div.innerHTML = title;
          $(div).attr('class','nav');
          $('body').append(div);
          if (i == 1) {
            $(div).click(function() {rotate('u')});
            $(div).css({'left':Math.round((edge+size)-1-$(div).width()/2.0) + 'px',
                        'top':Math.round(roof-1-$(div).height()/2.0) + 'px'});
          } else {
            $(div).click(function() {rotate('d')});
            $(div).css({'left':Math.round((edge+size)-1-$(div).width()/2.0) + 'px',
                        'top':Math.round((roof+size*2)-1-$(div).height()/2.0) + 'px'});
          }
        }
      }
      setTimeout(function() {
        $('.nav').css({'opacity':'1'});
      },0);
    } else {
      $('.nav').remove();
      ui = false;
    }
  }

  $(window).mousemove(function(evt) {
    if (document.createTouch != undefined) return;
    x = evt.clientX;
    y = evt.clientY;
    if (playing) return;
    var hover = false;
	
    if ($('#nav_left').css('z-index') == '2') {
      hover = true;
      $('#tilt').css({'transform':'rotateY(15deg)'});
	  $("#nav").show();
    }
    if ($('#nav_right').css('z-index') == '2') {
      hover = true;
      $('#tilt').css({'transform':'rotateY(-15deg)'});
    }
    if ($('#nav_top').css('z-index') == '2') {
      hover = true;
      $('#tilt').css({'transform':'rotateX(-15deg)'});
    }
    if ($('#nav_bottom').css('z-index') == '2') {
      hover = true;
      $('#tilt').css({'transform':'rotateX(15deg)'});
    }
    if (!hover) {
      $('#tilt').css({'transform':'rotateY(0deg)'});
    }
  });

  function handleGesture(evt) {
    var self = handleGesture;
    if (evt.touches.length > 1) {
      self.feeling = false;
      return;
    }
    evt.preventDefault();
    switch (evt.type) {
      case 'touchstart':
        self.sx = evt.touches[0].screenX;
        self.sy = evt.touches[0].screenY;
        self.feeling = true;
        break;
      case 'touchmove':
        if (self.feeling) {
          self.x = evt.touches[0].screenX;
          self.y = evt.touches[0].screenY;
        }
        break;
      case 'touchend':
        if (self.feeling) {
          var dx = parseInt(self.x, 10) - parseInt(self.sx, 10);
          var dy = parseInt(self.y, 10) - parseInt(self.sy, 10);
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) { 
              rotate('l');
            } else {
              rotate('r');
            }
          } else {
            if (dy > 0) { 
              rotate('u');
            } else {
              rotate('d');
            }
          }
        }
        self.feeling = false;
        break;
    }
  }
  handleGesture.sx = 0;
  handleGesture.sy = 0;
  handleGesture.x = 0;
  handleGesture.y = 0;
  handleGesture.feeling = false;
  viewport[0].addEventListener("touchstart", handleGesture, false);
  viewport[0].addEventListener("touchmove", handleGesture, false);
  viewport[0].addEventListener("touchend", handleGesture, false);

  function tilt(evt) {
    if (window.orientation != 0) {
      //alert('bad');
    } else {
    }
  }
  window.addEventListener("orientationchange", tilt, false); 

});
