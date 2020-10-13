"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];

var numTimesToSubdivide = 4;

var theta=60;

window.onload = function initTriangles(){
	var	lab2_d01=document.getElementById('lab2_d01');
	var	lab2_d02=document.getElementById('lab2_d02');
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		/*-0.5, -0.5,  0,
		 0,  0.5,  0,
		 0.5, -0.5,  0*/
		 Math.cos(90 * Math.PI / 180.0),  Math.sin(90 * Math.PI / 180.0),  0,
		 Math.cos(210 * Math.PI / 180.0), Math.sin(210 * Math.PI / 180.0),  0,
		 Math.cos(-30 * Math.PI / 180.0), Math.sin(-30 * Math.PI / 180.0),  0
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );

	divideTriangle( u, v, w, numTimesToSubdivide );

	// configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	renderTriangles();
	
	lab2_d01.onmouseup = function(){
		points = [];
		numTimesToSubdivide = lab2_d01.value;
		initTriangles();
	}
	
	lab2_d02.onmouseup = function(){
		points = [];
		theta = lab2_d02.value;
		initTriangles();
	}
	
};

function triangle( a, b, c ){
	//var k;
	var zerovec3 = vec3.create();
	vec3.zero( zerovec3 );
	var radian = theta * Math.PI / 180.0;
	
	var a_new = vec3.create();
	var b_new = vec3.create();
	var c_new = vec3.create();
	
	vec3.rotateZ( a_new, a, zerovec3, radian );
	vec3.rotateZ( b_new, b, zerovec3, radian );
	vec3.rotateZ( c_new, c, zerovec3, radian );
	
	points.push( a_new[0], a_new[1], a_new[2] );
	points.push( b_new[0], b_new[1], b_new[2] );
	points.push( b_new[0], b_new[1], b_new[2] );
	points.push( c_new[0], c_new[1], c_new[2] );
	points.push( c_new[0], c_new[1], c_new[2] );
	points.push( a_new[0], a_new[1], a_new[2] );
}

function divideTriangle( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		//--count;
		
		divideTriangle( a, ab, ca, count-1 );
		divideTriangle( ab, b, bc, count-1 );
		divideTriangle( ca, bc, c, count-1 );
		divideTriangle( ab, bc, ca, count-1 );
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINES, 0, points.length/3 );
}

//<script type="text/javascript" src="../js/ch02/triangle-tessa.js"></script>
//<script type="text/javascript" src="../js/ch02/gasket-triangles.js"></script>