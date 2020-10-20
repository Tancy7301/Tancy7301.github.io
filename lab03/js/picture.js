"use strict";

var gl;
var canvas;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;

function changeDir(){
	direction *= -1;
}

window.onload = function init(){
	var sunSpeed = document.getElementById("sunSpeed");
    canvas = document.getElementById( "sun-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}
   //四个点
	var vertices = [
		-0.5,  0.5, 0.0,
		-0.3,  0.6, 0.0,
		-0.4,  0.7, 0.0,
		-0.6,  0.7, 0.0,
		-0.7,  0.6, 0.0,
	
		  0.5,  0.3, 0.0,
		  0.2,  0.0, 0.0,
		  0.8,  0.0, 0.0,
		  0.2,  -0.4, 0.0,
		  0.8,  -0.4, 0.0,
		 
		  -1.0, -0.2, 0.0,
		  -1.0, -1.0, 0.0,
		   1.0, -1.0, 0.0,
		   1.0, -0.2, 0.0
	];
	var colors = [
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
	     0.5, 0.4, 0.0, 1.0,
		 0.5, 0.4, 0.0, 1.0,
		 0.5, 0.4, 0.0, 1.0,
		 0.5, 0.4, 0.0, 1.0,
	     0.5, 0.4, 0.0, 1.0,
		 0.7, 0.7, 0.7, 1.0,
		 0.7, 0.7, 0.7, 1.0,
		 0.7, 0.7, 0.7, 1.0,
		 0.7, 0.7, 0.7, 1.0,
	];

	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.6, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// Associate external shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	var cBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
	
	var vColor = gl.getAttribLocation( program, "vColor" );
	gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );
	
	thetaLoc = gl.getUniformLocation( program, "theta" );
	
	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 100 - event.target.value;
	}
	render();
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	theta += direction * 0.1;
	gl.uniform1f( thetaLoc, theta );
	
	gl.drawArrays( gl.TRIANGLE_FAN, 0, 5);
	gl.drawArrays( gl.TRIANGLE_FAN,10, 4);
	gl.drawArrays( gl.TRIANGLE_STRIP,5, 5);
	
	setTimeout( function(){ requestAnimFrame( render ); }, speed );
}