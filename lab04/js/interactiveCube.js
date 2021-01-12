"use strict";

var canvas;
var gl;

var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [0, 0, 0];
var talk = [0, 0, 0];
var zoom = [0, 0, 0];

var thetaLoc;
var talkLoc;
var zoomLoc;


window.onload = function initWindow() {
    canvas = document.getElementById("rt-cb-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) {
		alert("WebGL isn't available");
	}

    makeCube();

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	// load shaders and initialize attribute buffer
	var program = initShaders(gl, "rt-vshader", "rt-fshader");
	gl.useProgram(program);
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
	
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	thetaLoc = gl.getUniformLocation(program, "theta");
	gl.uniform3fv(thetaLoc, theta);	
	
	talkLoc = gl.getUniformLocation(program, "talk");
	gl.uniform3fv(talkLoc, talk);
	
	zoomLoc = gl.getUniformLocation(program, "zoom");
	gl.uniform3fv(zoomLoc, zoom);
	
	
	document.getElementById("xButton").onclick = function(){
		axis = xAxis;
	}
	document.getElementById("yButton").onclick = function(){
		axis = yAxis;
	}
	document.getElementById("zButton").onclick = function(){
		axis = zAxis;
	}
	
	// task.b translation along x/ y/ z axis
	var xTa = document.getElementById("xTalk");
	xTa.onchange = function(){
		talk[0] = xTa.value/100;
	}
	var yTa = document.getElementById("yTalk");
	yTa.onchange = function(){
		talk[1] = yTa.value/100;
	}
	var zTa = document.getElementById("zTalk");
	zTa.onchange = function(){
		talk[2] = zTa.value/100;
	}
	
	var xZoom = document.getElementById("xZoom");
	xZoom.onchange = function(){
		zoom[0] = xZoom.value/100;
	}
	var yZoom = document.getElementById("yZoom");
	yZoom.onchange = function(){
		zoom[1] = yZoom.value/100;
	}
	var zZoom = document.getElementById("zZoom");
	zZoom.onchange = function(){
		zoom[2] = zZoom.value/100;
	}
	
	render();
}

function makeCube(){
	var vertices = [
		glMatrix.vec4.fromValues(-0.5, -0.5,  0.5, 1.0),
		glMatrix.vec4.fromValues(-0.5,  0.5,  0.5, 1.0),
		glMatrix.vec4.fromValues( 0.5,  0.5,  0.5, 1.0),
		glMatrix.vec4.fromValues( 0.5, -0.5,  0.5, 1.0),
		glMatrix.vec4.fromValues(-0.5, -0.5, -0.5, 1.0),
		glMatrix.vec4.fromValues(-0.5,  0.5, -0.5, 1.0),
		glMatrix.vec4.fromValues( 0.5,  0.5, -0.5, 1.0),
		glMatrix.vec4.fromValues( 0.5, -0.5, -0.5, 1.0)
	];
	
	var vertexColors = [
		glMatrix.vec4.fromValues(0.0, 0.0, 0.0, 1.0),  
		glMatrix.vec4.fromValues(1.0, 0.0, 0.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 1.0, 0.0, 1.0), 
		glMatrix.vec4.fromValues(0.0, 1.0, 0.0, 1.0), 
		glMatrix.vec4.fromValues(0.0, 0.0, 1.0, 1.0),  
		glMatrix.vec4.fromValues(1.0, 0.0, 1.0, 1.0),
		glMatrix.vec4.fromValues(1.0, 1.0, 1.0, 1.0),  
		glMatrix.vec4.fromValues(0.0, 1.0, 1.0, 1.0)   
	];
	
    var faces = [
        1, 0, 3, 1, 3, 2, //正
        2, 3, 7, 2, 7, 6, //右
        3, 0, 4, 3, 4, 7, //底
        6, 5, 1, 6, 1, 2, //顶
        4, 5, 6, 4, 6, 7, //背
        5, 4, 0, 5, 0, 1  //左
    ];


	for (var i = 0; i < faces.length; i++) {
		points.push(vertices[faces[i]][0], vertices[faces[i]][1], vertices[faces[i]][2]);
		colors.push(vertexColors[Math.floor(i / 6)][0], vertexColors[Math.floor(i / 6)][1], vertexColors[Math.floor(i / 6)][2], vertexColors[Math.floor(i / 6)][3]);
	}	
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	theta[axis] += 0.04;
	gl.uniform3fv(thetaLoc, theta);
	gl.uniform3fv(talkLoc, talk);
	gl.uniform3fv(zoomLoc, zoom);
	
	gl.drawArrays(gl.TRIANGLES, 0, points.length/3);
	
	requestAnimFrame(render);
}

