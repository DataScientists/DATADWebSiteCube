var star = null;
var pausing =false;
$(function() {
  star = function(star) {
    var w = 620;
    var h = 350;
    star.rows = 4;
    star.cols = 4;
    star.per = 3;
    star.scale = 0.20;
    star.draws = 20;
    star.time = 0.5;
    star.flash = 0.1;
    /*
    star.ox = 413;
    star.oy = 181;
    */
    star.ox = 310;
    star.oy = 175;
    star.centering = true;
    star.flashing = false;
    star.loaded = false;
    star.callback = null;

    if (typeof requestAnimationFrame == "undefined" && typeof mozRequestAnimationFrame == "undefined") requestAnimationFrame = webkitRequestAnimationFrame;
    if (typeof requestAnimationFrame == "undefined" && typeof webkitRequestAnimationFrame == "undefined") requestAnimationFrame = mozRequestAnimationFrame;

    var actions = function() {};
    actions.drawFrame = function() {};
    var req_anim_frame = function() {
      actions.drawFrame();
      requestAnimationFrame(req_anim_frame);
    }
    requestAnimationFrame(req_anim_frame);

    actions.timerAction = function() {};
    actions.interval = null;
    actions.timer = null;
    actions.draw = false;

    star.hole = new Image();
    star.pic = new Image();
    var one = new Image();
    var zero = new Image();
    var imgs = [one,zero];

    var ctx = $('#field')[0].getContext('2d');

    star.apply = function() {
      actions.timerAction = function() {};
      actions.drawFrame = function() {};
      clearInterval(actions.interval);
      clearTimeout(actions.timer);
      actions.interval = setInterval(function() {actions.timerAction()},Math.round(1000/star.draws));

      var rows = star.rows;
      var cols = star.cols;
      var per = star.per;
      var scale = star.scale;
      var time = star.time*1000;
      var flash = star.flash*1000;
      var ox = star.ox;
      var oy = star.oy;
      var centering = star.centering;
      var flashing = star.flashing;

      //not quite Fisher-Yates
      function shuffle(arr) {
        for (var i = arr.length-1; i >= 0; i--) {
          var rand_idx = Math.floor(Math.random() * i);
          var tmp = arr[i];
          arr[i] = arr[rand_idx];
          arr[rand_idx] = tmp;
        }
        return arr;
      }

      //courtesy http://sol.gfxile.net/interpolation/#c4
      function smooth(x) {
        return ((x) * (x) * (3 - 2 * (x)));
      }

      ctx.drawTile = function(pic,row,col) {
        var sw = w/cols;
        var sh = h/rows;
        var x = col*sw;
        var y = row*sh;
        ctx.drawImage(pic,x,y,sw,sh,x,y,sw,sh); 
      }

      var pool = new Array();
      var grid = new Array();
      for (var r = 0; r < rows; r++) {
        grid[r] = new Array();
        for (var c = 0; c < cols; c++) {
          grid[r].push({alpha:0,flashed:0});
          for (var i = 0; i < per; i++) {
            pool.push({r:r,c:c});
          }
        }
      }
      shuffle(pool);
      var bits = new Array();
      var total = rows*cols*per;

      actions.timerAction = function() {
        actions.draw = true;
      }

      actions.drawFrame = function() {
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(star.hole,0,0)

        //draw a bit if needed
        if (actions.draw && pool.length) {
          var bit = pool.pop();
          bit.img = imgs[Math.floor(Math.random()*imgs.length)];
          bit.x = bit.c*w/cols + Math.floor(Math.random()*w/cols);
          bit.y = bit.r*h/rows + Math.floor(Math.random()*h/rows);
          if (centering) {
            bit.x = bit.c*w/cols + w/cols/2;
            bit.y = bit.r*h/rows + h/rows/2;
          }
          bit.born = Date.now();
          bits.push(bit);
        }
        actions.draw = false;

        var now = Date.now();

        nextBits = new Array;
        //draw/kill the bits
        while(bits.length) {
          var bit = bits.pop();
          var dur = now - bit.born;
          if (dur > time) {
            grid[bit.r][bit.c].alpha = grid[bit.r][bit.c].alpha + 1/per; 
            total--;
            if (flashing) grid[bit.r][bit.c].flashed = now;
            continue;
          }
          nextBits.push(bit);
          var prog = dur/time;
          prog = smooth(prog);
          var scl = (1-prog)*scale + prog; 
          var px = ((1-prog)*ox + bit.x*prog)/scl; 
          var py = ((1-prog)*oy + bit.y*prog)/scl; 
          ctx.save();
            ctx.scale(scl,scl);
            ctx.drawImage(bit.img,(px+bit.img.ax),(py+bit.img.ay));
          ctx.restore();
        }
        bits = nextBits;

        //draw the tiles
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            ctx.save();
              ctx.globalAlpha = grid[r][c].alpha;
              ctx.drawTile(star.pic,r,c);
            ctx.restore();
            if (flashing && flash > now - grid[r][c].flashed) {
              ctx.save();
                ctx.fillStyle = "rgba(0, 255, 000, 255)";
                ctx.fillRect(c*w/cols,r*h/rows,w/cols,h/rows);
              ctx.restore();
            }
          }
        }

        if (total == 0) {
          actions.drawFrame = function() {};
          clearInterval(actions.interval);
          actions.timer = setTimeout(function() {ctx.drawImage(star.pic,0,0)},100);
          if (star.callback) setTimeout(star.callback,0);
        };
      }

    }

    star.hole.onload = function () {
      ctx.drawImage(star.hole,0,0)
      star.pic.onload = function() {
        one.onload = function() {
          one.ax = -1*one.width/2;
          one.ay = -1*one.height/2;
          zero.onload = function() {
            zero.ax = -1*zero.width/2;
            zero.ay = -1*zero.height/2;
            star.loaded = true;
            //star.$apply();
          }
          zero.src = "resources/img/zero.png";
        }
        one.src = "resources/img/one.png";
      }
      star.pic.src = "resources/img/DatadSlide2.jpg";
    }
    star.hole.src = "resources/img/DatadSlide1.jpg";

    return star;

  }(function() {});
});


function nextPicture(){
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
	  star.hole = star.pic;
	  star_idx += 1;
	  var img = new Image();
	  img.src = pics[star_idx % pics.length];
	  star.pic = img;
	  star.apply();
}
function prevPicture(){
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
	  star.hole = star.pic;
	  star_idx -= 1;
	  var img = new Image();
	  img.src = pics[star_idx % pics.length];
	  star.pic = img;
	  star.apply();
}
function resetPauseButton()
{
	$("#btnPause").val("Pause");
}
function pausePicture(){
	if(star_on){
		stop_star();
		$("#btnPause").val("Play");
	}
	else{
		star_on=true;
		nextPicture();
		$("#btnPause").val("Pause");
	}
}

