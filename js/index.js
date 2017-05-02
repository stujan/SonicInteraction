window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

var c = document.getElementById("canvas-club");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var ctx = c.getContext("2d");


var maxParticles = 5;
var particles = [];
var hue = 183;
var color = ["#F62259","#2C8CFF","#24E5FF","#FFF200"];

var clearColor = "rgba(0, 0, 0, .3)";



var audioContext;
var analyser;
var mic;


//get stream
navigator.getMedia = ( navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);

navigator.getMedia ( { audio: true }, function (stream) {
	audioContext = new (window.AudioContext || window.webkitAudioContext);

	mic = audioContext.createMediaStreamSource(stream);

	analyser= audioContext.createAnalyser();

	analyser.fftSize = 256;
	mic.connect(analyser);
	anim();
},function(){});

function random(min, max){
	return Math.random() * (max - min) + min
}

function distance(x1, y1, x2, y2){
	return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

function P(){}

P.prototype = {
	init: function(){
		this.size = this.origSize = random(3, 8);
		this.x = random(10,w/2);
		this.y = random(h/4,h/1.4);
		this.sides = random(3, 10);
		this.vx = random(-5, 5);
		this.vy = random(-5, 5);
		this.life = 0;
		this.maxLife = random(50, 200);
		this.alpha = 1;
		this.rcolor = Math.floor((Math.random() *4) + 0);
		this.ransharp = -1;
		this.point = Math.floor((Math.random()*(8-1))+1)

	},
	
	draw: function(){
		ctx.globalCompositeOperation = "lighter";
		// ctx.strokeStyle = "hsla("+hue+", 100%, 50%, "+this.alpha+")";		
		
		ctx.strokeStyle = color[this.rcolor];		


		//ctx.fillStyle = "hsla("+hue+", 100%, 50%, "+( this.alpha *.4 )+")";
		//ctx.fillStyle = color[this.rcolor];
		//ctx.strokeStyle = color[]


//         var gradient = ctx3.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
//         gradient.addColorStop(0, 'hsla(0,0%,100%,0.8)');
//         gradient.addColorStop(0.6, s.color);
//         gradient.addColorStop(1, 'hsla(0,0%,100%,0)');
// //              gradient.addColorStop(0.6, 'hsla(0,0%,100%,1)');
// //              gradient.addColorStop(1, s.color);
//         ctx3.fillStyle = gradient;
		
		ctx.beginPath();


		ctx.moveTo(this.x + this.size * Math.cos(0), this.y + this.size *  Math.sin(0));
		// ctx.moveTo(this.x + this.size, this.y + this.size );
		
		if(this.ransharp == 0){
			ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, true);
		}
		if(this.ransharp == 1){
			
			ctx.arc(this.x, this.y, this.size, 0, Math.PI, false);
      		ctx.moveTo(this.x+this.size,this.y)
      		ctx.arc(this.x, this.y, this.size*1.2, 0, Math.PI, false);
      		ctx.moveTo(this.x-this.size,this.y)
      		
      		//ctx.lineTo(this.x-this.size*1.2,this.y)
		}

		if(this.ransharp == 2){
			for(var i =0;i<2;i++){
				ctx.lineTo(this.x + this.size * Math.cos(i * 2 * Math.PI / this.sides), this.y + this.size * Math.sin(i * 2 * Math.PI / this.sides));
			}
		}

		if((this.ransharp > 2 && this.ransharp < 5) || this.ransharp == 7){
			for(var i = 0; i < this.ransharp+1;i++)
				ctx.lineTo(this.x + this.size * Math.cos(i * 2 * Math.PI / this.ransharp), this.y + this.size * Math.sin(i * 2 * Math.PI / this.ransharp));
		}
		if(this.ransharp == 5){
		//five

			ctx.lineTo(this.x + this.size * 1.5, this.y - this.size * 0.5);

			ctx.lineTo(this.x + this.size * 2.0, this.y);

	   		ctx.moveTo(0, 0);


		}
		if(this.ransharp == 6){

		//six
			for(var i = 0;i < this.point;i++){
				ctx.lineTo(this.x + this.size * (3+2*i)*0.5, this.y + this.size * 0.5);

				ctx.lineTo(this.x + this.size * ((3+2*i)*0.5+0.5), this.y + this.size * Math.sin(0));
			}
			ctx.moveTo(0, 0);
			
		}

		if(this.ransharp == 8){
			ctx.lineTo(this.x + this.size * 1.5, this.y);
			ctx.lineTo(this.x + this.size * 1.5, this.y + this.size * 4.0);
			ctx.lineTo(this.x + this.size, this.y + this.size * 4.0);

		}
		// for(var i=0; i<this.sides; i++){
		// 	ctx.lineTo(this.x + this.size * Math.cos(i * 2 * Math.PI / this.sides), this.y + this.size * Math.sin(i * 2 * Math.PI / this.sides));
		// }   
		ctx.closePath();
		ctx.lineWidth = this.size/50;
		ctx.fill();
		ctx.stroke();
		this.update();
	},
	
	update: function(){
		var rad = this.size/2;
		
		if(this.size <= 350){
			// if((this.x - rad <= 0  && this.vx < 0) || (this.x + rad >= w && this.vx > 0)){
			// 	this.vx *= -1;
			// }
			
			// if((this.y - rad <= 0 && this.vy < 0) || (this.y + rad >= h && this.vy > 0)){
			// 	this.vy *= -1;
			// }
			this.alpha *= .978;
			this.size += 2.1;
			this.life++;
		} else {
			this.init()
		}
		
	}
};

window.addEventListener("resize", function(){
	w = c.width = window.innerWidth;
	h = c.height = window.innerHeight;

});






