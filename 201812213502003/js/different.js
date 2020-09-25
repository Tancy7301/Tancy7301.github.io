"use strict";

var gl;
var points;

window.onload = function init(){
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}
   //6个点
	var vertices = [
		-1.0,  0.0, 
		 -0.5,  1.0, 
		 0.0, 0.0,	
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	]; 

	// 配置
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0,1.0, 1.0, 1.0 );

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// 向GPU传输 数据
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	// 将外部着色器变量与数据缓冲区相关联
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	render();
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.TRIANGLES, 0,3);
	gl.drawArrays( gl.TRIANGLE_FAN, 2, 4 );
}