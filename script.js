var canvas,ctx;
var fps;
//var joint;
var hair = [];
var hair2 = [];
var img;
var linkbtn;
var oldTime, startTime,  totalFrame= 0;
var  fpstxt, fpsN;
//__________________________________________________________________________________________________
//                                                                                         监听事件
var addListener = function( e, str, func ) {
	if( e.addEventListener ) {
		e.addEventListener( str, func, false );
	}else if( e.attachEvent ) {
		e.attachEvent( "on" + str, func );
	}else {
		
	}
};
addListener( window, "load", init );
var isBlur = false;
function init(){
	canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx = canvas.getContext("2d");
	//ctx.shadowBlur=20;
//ctx.shadowColor="black";
  for(var i = 1;i<=10;i++){
    var yy;
		 switch (i)
            {
                case 1:
                    yy=190;
                    break;
                case 2:
                    yy=175
                    break;
				        case 3:
					          yy=165;
					          break;
				        default:
					          yy=150;
					          break;
            }
			hair[i-1] = new Joint(10,15,true,new Vector2(300+15*i,yy),10,Math.random()*360,Math.random()*3+1);
    
  }
	//joint = new Joint(2,140,true,new Vector2(300,100));
	for(var i=1;i<=3;i++)
		hair2[i-1] = new Joint(10,15,true,new Vector2(350+15*i,135),10,Math.random()*360,Math.random()*3+1);
	
	img=new Image();
	img.src="http://upload.wikimedia.org/wikipedia/commons/d/d3/Medusa_by_Carvaggio.jpg";
	
	linkbtn = document.createElement("a");
	document.body.appendChild( linkbtn ); 
	linkbtn.href = "#";
	linkbtn.innerHTML = "SHADOW";
	linkbtn.style.position = "absolute";
	
	linkbtn.style.top = "30px";
	linkbtn.style.fontSize = "8pt";
	linkbtn.onclick = function( ){
		if(isBlur){ 
			ctx.shadowBlur=0;
			//ctx.shadowColor="black";
			isBlur = false;
		}
		else{
			ctx.shadowBlur=20;
			ctx.shadowColor="black";
			isBlur = true;
		}
	}
	
	//定义fpstxt，fpstxt的声明是全局的，在最上面
	fpstxt = document.createElement("div");
  fpstxt.innerHTML = "FPS average: ";
	fpstxt.style.width = "170px";
	fpstxt.style.height = "15px";
	document.body.appendChild( fpstxt ); 
	fpstxt.style.position = "absolute";
	fpstxt.style.fontSize = "8pt";
	
	fpstxt.style.fontWeight = "bold";
	fpstxt.style.overflow = "hidden";
	//定义帧速fpsN，fpsN的声明是全局的，在最上面
	fpsN = document.createElement("div");
	fpsN.innerHTML = "00.0";
	fpsN.style.width = "30px";
	fpsN.style.height = "12px";
	document.body.appendChild( fpsN ); 
	fpsN.style.position = "absolute";
	fpsN.style.fontSize = "8pt";

	fpsN.style.fontWeight = "bold";
	fpsN.style.overflow = "hidden";
	fpstxt.style.color = fpsN.style.color = "#777";
	
	
	
	
	
	fpsN.style.left = "100px";
	var FPS =30;
	var interval = 1000 / FPS >> 0;//每1000毫秒走30帧，那么1帧需要1000/30毫秒
//update();

	resize();
	addListener( window, "resize", resize );
	img.onload = function(){
		var timer = setInterval( drawHair, interval );//哒啦~~这是动画的原理
		
		canvas.onmousemove = canvasMouseMoveHandler; 
	}
}

//__________________________________________________________________________________________________
//                                                                                             骨骼
function Joint(segLength,segCount,isFixed,startPoint,lineWidth,angle,angleSpeed){
	this.lineWidth = lineWidth;
	this.segLength = segLength;
	this.segCount  = segCount;
	this.isFixed = isFixed;
	this.startAngle = angle;
	this.angleSpeed = angleSpeed;
	this.lastMouseX = 0;
	this.lastMouseY = 0;
	this.disX = 0;
	this.disY = 0;
	this.sX = 0;
	this.sY = 0;
	//初始点
	this.startPoint = startPoint;
	this.points = [];
	for(var i = 0;i < this.segCount;i++){
		//每个关节之间的连线，也就是骨头，默认是垂直向下的
		this.points[i] = new Vector2(this.startPoint.x,this.startPoint.y + i * this.segLength);
	}
}


Joint.prototype.updatePointsPosition = function (point, index) {
        var tempV = this.points[index - 1].sub(point).setLength(this.segLength);
        this.points[index - 1] = point.add(tempV);
        if (index > 1) {
            this.updatePointsPosition(this.points[index - 1], index - 1);
        }else {
                if (this.isFixed) {
                    var v = this.points[0].sub(this.startPoint);
                    for (var i = 0; i < this.points.length; i++) {
                        this.points[i].subSelf(v);
                    }
                }
            }
}

Joint.prototype.drawjoint = function () {
   
    
    for (var i = 0; i < this.points.length - 1; i++) {
	
		drawLine(this.points[i],this.points[i+1]);
        if (i % 2 === 0) {
            drawLine(this.points[i],this.points[i+1],this.lineWidth,"#1a1414");
        }
        else {
           drawLine(this.points[i],this.points[i+1],this.lineWidth,"#7b5e3c");//#a4947d
        }
    }
}

//__________________________________________________________________________________________________
//																							 向量类
//向量
function Vector2(x,y){
	this.x = x || 0;
	this.y = y || 0;
}
//减法
Vector2.prototype.sub = function(v){
	return new Vector2(this.x - v.x , this.y - v.y);
}
Vector2.prototype.subSelf = function (a) { 
	this.x -= a.x; this.y -= a.y; 
	return this;
}
//加法
Vector2.prototype.add = function (v) { 
	return new Vector2(this.x + v.x, this.y + v.y) 
}
//点乘
Vector2.prototype.dot = function(v){
	return this.x * v.x + this.y * v.y;
}
//数乘
Vector2.prototype.multiplyScalar =  function(s) {
     this.x *= s;
     this.y *= s;
     return this;
}
//数除
Vector2.prototype.divideScalar = function(s) {
     if (s) {
          this.x /= s;
          this.y /= s;
      } else {
          this.set(0, 0);
      }
          return this;
}
//模
Vector2.prototype.length = function() {
       return Math.sqrt(this.lengthSq());
}
//单位化向量
Vector2.prototype.normalize = function() {
       return this.divideScalar(this.length());
}
//到原点距离的平方
Vector2.prototype.lengthSq = function() {
       return this.x * this.x + this.y * this.y;
}
//两点之间距离的平方
Vector2.prototype.distanceToSquared = function(v) {
       var dx = this.x - v.x,
       dy = this.y - v.y;
       return dx * dx + dy * dy;
}
//两点之间距离
Vector2.prototype.distanceTo = function(v) {
       return Math.sqrt(this.distanceToSquared(v));
}
Vector2.prototype.setLength = function(l) {
       return this.normalize().multiplyScalar(l);
}
//__________________________________________________________________________________________________
//                                                                                             绘制
function drawLine(v1,v2,width,color){
	ctx.beginPath();

	ctx.strokeStyle = color;
	ctx.lineCap = "round";
	ctx.lineWidth = width;
	ctx.lineJoin = "round";
	ctx.moveTo(v1.x, v1.y);
	ctx.lineTo(v2.x, v2.y);
	//ctx.closePath();
	ctx.stroke();
}

var mouseX,mouseY;
function canvasMouseMoveHandler(e){
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
    var    r = canvas.getBoundingClientRect();
	var xx = document.getElementById("xx");
	//xx.innerHTML = e.clientX - r.left;
	mouseX = e.clientX - r.left;
	mouseY = e.clientY - r.top;
    //for(var i = 0;i<hair.length;i++){
		//var joint = hair[i];
		//joint.points[joint.points.length - 1] = new Vector2(e.clientX - r.left, e.clientY - r.top);
		//joint.updatePointsPosition(joint.points[joint.points.length - 1], joint.points.length - 1);
		//joint.drawjoint();   
}		



var x = 0;
var distance= 99999;
function drawHair(){

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.setTransform( 0.5, 0, 0, 0.5, 0, 0 );
	ctx.drawImage(img,280,10);
	ctx.restore();
	
	

    var    r = canvas.getBoundingClientRect();
    for(var i = 0;i<hair.length;i++){
		var joint = hair[i];
		var dx = mouseX-joint.points[joint.points.length - 1].x;
		var dy = mouseY-joint.points[joint.points.length - 1].y;
		distance = Math.sqrt(dx*dx+dy*dy);
		if(distance <50)
			joint.points[joint.points.length - 1] = new Vector2(mouseX,mouseY);
		else
			joint.points[joint.points.length - 1] = new Vector2(150+i*50-20*Math.sin(degToRad((joint.startAngle+=(joint.angleSpeed))/2)),150+ 100*Math.sin(degToRad(joint.startAngle+=joint.angleSpeed)));
		joint.updatePointsPosition(joint.points[joint.points.length - 1], joint.points.length - 1);
		joint.drawjoint();   
	}	
		
	for(var i=0;i<hair2.length;i++){
		var joint = hair2[i];
		
		var dx = mouseX-joint.points[joint.points.length - 1].x;
		var dy = mouseY-joint.points[joint.points.length - 1].y;
		distance = Math.sqrt(dx*dx+dy*dy);
		if(distance <50){
			joint.points[joint.points.length - 1] = new Vector2(mouseX,mouseY);
			/*joint.lastMouseX = mouseX;
			joint.lastMouseY = mouseY;
			joint.sX = 325+i*50-20*Math.sin(degToRad((joint.startAngle+=(joint.angleSpeed))/2));
			joint.sY = 65+ 50*Math.sin(degToRad(joint.startAngle+=joint.angleSpeed));
			joint.disX = joint.sX - joint.lastMouseX;
			joint.disY = joint.sY - joint.lastMouseY;*/
			}
		else{
			
			var X = 325+i*50-20*Math.sin(degToRad((joint.startAngle+=(joint.angleSpeed))/2));
			var Y = 65+ 50*Math.sin(degToRad(joint.startAngle+=joint.angleSpeed));
			/*if(joint.disX>10 || joint.disX < -10)
				joint.disX = X - joint.lastMouseX;
			joint.disX *=0.5;
			if(joint.disY>10 || joint.disY < -10)
				joint.disY = Y - joint.lastMouseY;
			joint.disY *=0.5;
			document.getElementById("xx").innerHTML = joint.disY;*/
			joint.points[joint.points.length -1] = new Vector2(X-joint.disX,Y-joint.disY);
		}
		joint.updatePointsPosition(joint.points[joint.points.length - 1], joint.points.length - 1);
		joint.drawjoint();   
	}
	
	
	//计算帧速
	if ( ++totalFrame > 15 && totalFrame % 5 == 0 ) {
		var now = new Date().getTime();
		var aveFps = 1000 / (( now - startTime ) / ( totalFrame - 15 ));
		fpsN.innerHTML = aveFps.toFixed(1);
	}else if( totalFrame == 15 ){

		oldTime = new Date().getTime();
		startTime = oldTime;
	}
	
}

function degToRad(a) {
	return (a / (360 / (2 * Math.PI)));
}
function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}