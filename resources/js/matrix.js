var anim = null;
var dirty = true;
var active = false;
var refresh = function() {};

function randomLetter() {
  return chars[Math.floor(Math.random()*chars.length)];
}

if (typeof requestAnimationFrame == "undefined" && typeof mozRequestAnimationFrame == "undefined")
    requestAnimationFrame = webkitRequestAnimationFrame;
if (typeof requestAnimationFrame == "undefined" && typeof webkitRequestAnimationFrame == "undefined")
    requestAnimationFrame = mozRequestAnimationFrame;

function start() {
  var dark_green = "rgb(90, 120, 150)";
  var light_green = "rgb(180, 220, 255)";
  var size = 14;
  var trans = .1;

  var w = $('#cnv').attr('width');
  var h = $('#cnv').attr('height');
  var ctx = $('#cnv')[0].getContext('2d');

  ctx.font = "bolder "+size+"px Arial";
  var colHeight = Math.round(h/size)+1;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = Math.round(size/2);

  var cols = new Array;
  var states = new Array;
  var locked = new Array;
  for (var cx = 0; cx < w; cx += size) {
    cols.push(new Array);
    states.push(false);
    locked.push(new Object);
  }
  //text = (new Array(Math.round(cols.length - text.length/2)).join(' ')) + text;
  //var textCol = Math.round((cols.length - text.length)/2);
  //text = (new Array(textCol)).join(' ') + text;
  //text = text + (new Array(cols.length+1 - text.length)).join(' ');
  //var pad = new Array((cols.length * (colHeight-1) - text.length)/2+1).join(' ');
  var textp = text;
  console.log('text is: ' + textp);
  var which = 294;
  var stopRendering = false;

  refresh = function refresh() {
    if (!dirty) {
      if (active) requestAnimationFrame(refresh);
      return;
    }

    for (var i = 0; i < cols.length; i++) {
      var color = 'black';
      if (states[i] && !locked[i][j]) {
        if ((cols[i].length == 0 || cols[i][0][0] == 'black') && Math.random() < .2) {
          color = 'white';
        } else {
          color = dark_green;
        }
      }
      cols[i].unshift([color, randomLetter()]);
      cols[i] = cols[i].slice(0,colHeight);
      if ((states[i] && Math.random() < trans) || (!states[i] && Math.random() < trans)) {
        states[i] = !states[i];
      }
    }

    /*
    for (var i = 0; i < text.length; i++) {
      if (cols[textCol+i][textRow] != undefined && cols[textCol+i][textRow][0] != 'black' && cols[textCol+i][textRow][1] == text[i]) locked[textCol+i] = true;
      
    }
    */

    ctx.save(); 
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = "black"
      ctx.fillRect(0,0,w,h);
    ctx.restore();


    which++;

    for (var i = 0; i < cols.length; i++) {
      for (var j = 0; j < cols[i].length; j++) {
        ctx.save();
          ctx.fillStyle = cols[i][j][0];
          ctx.shadowColor = cols[i][j][0];

          if (locked[i][j] && textp[j*cols.length+i] != " ") {
            ctx.fillStyle = light_green;
            ctx.shadowColor = light_green;
            ctx.fillText(textp[j*cols.length+i], size*i, (size+4)*(j+1));
          } else {
            if (textp[j * cols.length + i] != ' ') {
              if ((j * cols.length + i) * 2 == which && textp[j * cols.length + i] != ' ') {
                locked[i][j] = true;
                if (textp[j * cols.length + i] == '.' && textp[j * cols.length + i - 1] == 's')
                  stopRendering = true;
              }
            } else {
              if (cols[i][j][1] == textp[j*cols.length+i])
                locked[i][j] = true;

              // if we should stop, then gradually start making them locked
              if (stopRendering)
                if (Math.random() < 0.05)
                  locked[i][j] = true;
            }
            if (cols[i][j][0] != 'black' && !locked[i][j])
              ctx.fillText(cols[i][j][1], size*i, (size+4)*(j+1));
          }
        ctx.restore();
      }
    }
    dirty = false;
    if (active) requestAnimationFrame(refresh);
  }

}

function matrixGo() {
  active = true;
  clearInterval(anim);
  anim = setInterval(function() {
    dirty = true;
  },15);
  requestAnimationFrame(refresh);
}

function matrixStop() {
  clearInterval(anim);
  dirty = false;
  active = false;
}

$(start);
