"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),//0
    vec4( -0.5,  0.5,  0.5, 1.0 ),//1
    vec4(  0.5,  0.5,  0.5, 1.0 ),//2
    vec4(  0.5, -0.5,  0.5, 1.0 ),//3
    vec4( -0.5, -0.5, -0.5, 1.0 ),//4
    vec4( -0.5,  0.5, -0.5, 1.0 ),//5
    vec4(  0.5,  0.5, -0.5, 1.0 ),//6
    vec4(  0.5, -0.5, -0.5, 1.0 )//7
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 1.0, 1.0, 1.0, 1.0 )  // white

];


// Parameters controlling the size of the Robot's arm
//底座宽高
var BASE_HEIGHT      = 2.0;
var BASE_WIDTH       = 2.3;
//底部手指宽高
var LOWER_ARM_HEIGHT = 1.0;
var LOWER_ARM_WIDTH  = 0.3;
var LOWER_ARM_HEIGHT_SEC = 1.0;
var LOWER_ARM_WIDTH_SEC  = 0.3;
var LOWER_ARM_HEIGHT_THI = 1.3;
var LOWER_ARM_WIDTH_THI  = 0.3;
var LOWER_ARM_HEIGHT_FOR = 1.0;
var LOWER_ARM_WIDTH_FOR  = 0.3;
var LOWER_ARM_HEIGHT_FIF = 0.8;
var LOWER_ARM_WIDTH_FIF  = 0.3;
//中部手指宽高
var MID_ARM_HEIGHT_SEC=1.0
var MID_ARM_WIDTH_SEC=0.3
var MID_ARM_HEIGHT_THI=1.3
var MID_ARM_WIDTH_THI=0.3
var MID_ARM_HEIGHT_FOR=1.0
var MID_ARM_WIDTH_FOR=0.3
var MID_ARM_HEIGHT_FIF=0.8
var MID_ARM_WIDTH_FIF=0.3
//上面手指宽高
var UPPER_ARM_HEIGHT = 1.0;
var UPPER_ARM_WIDTH  = 0.3;
var UPPER_ARM_HEIGHT_SEC = 1.0;
var UPPER_ARM_WIDTH_SEC  = 0.3;
var UPPER_ARM_HEIGHT_THI = 1.3;
var UPPER_ARM_WIDTH_THI  = 0.3;
var UPPER_ARM_HEIGHT_FOR = 1.0;
var UPPER_ARM_WIDTH_FOR  = 0.3;
var UPPER_ARM_HEIGHT_FIF = 0.8;
var UPPER_ARM_WIDTH_FIF  = 0.3;

// Shader transformation matrices

var modelViewMatrix,modelViewMatrix2, projectionMatrix;//单位矩阵4*4

// Array of rotation angles (in degrees) for each rotation axis
//为手指的每个关节做标记
var Base = 0;
var LowerArm = 1;
var LowerArm1 = 2;
var LowerArm2 = 3;
var LowerArm3 = 4;
var LowerArm4 = 5;
var UpperArm = 6;
var UpperArm1 = 7;
var UpperArm2 = 8;
var UpperArm3 = 9;
var UpperArm4 = 10;
var MidArm1=11;
var MidArm2=12;
var MidArm3=13;
var MidArm4=14;

var theta= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//15-0角度

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}

//绘制底座
function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();//4*4
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 0.9, 0.8, 0.6, 1.0 );//要在glClear之前设置Color
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    //设置页面的选择范围按钮控制，一共15组(参照theta数组的定义)
    //底部旋转和底部关节
    document.getElementById("slider1").onchange = function(event) {
        theta[0] = event.target.value;
    };
    document.getElementById("slider2").onchange = function(event) {
         theta[1] = event.target.value;
    };
    document.getElementById("slider3").onchange = function(event) {
         theta[2] = event.target.value;
    };
    document.getElementById("slider4").onchange = function(event) {
         theta[3] = event.target.value;
    };
    document.getElementById("slider5").onchange = function(event) {
         theta[4] = event.target.value;
    };
    document.getElementById("slider6").onchange = function(event) {
         theta[5] = event.target.value;
    };
    //上部关节
    document.getElementById("slider7").onchange = function(event) {
         theta[6] =  event.target.value;
    };
    document.getElementById("slider8").onchange = function(event) {
         theta[7] =  event.target.value;
    };
    document.getElementById("slider9").onchange = function(event) {
         theta[8] =  event.target.value;
    };
    document.getElementById("slider10").onchange = function(event) {
         theta[9] =  event.target.value;
    };
    document.getElementById("slider11").onchange = function(event) {
         theta[10] =  event.target.value;
    };
    //中间关节
    document.getElementById("slider12").onchange = function(event) {
         theta[11] =  event.target.value;
    };
    document.getElementById("slider13").onchange = function(event) {
         theta[12] =  event.target.value;
    };
    document.getElementById("slider14").onchange = function(event) {
         theta[13] =  event.target.value;
    };
    document.getElementById("slider15").onchange = function(event) {
         theta[14] =  event.target.value;
    };

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");//设立模型矩阵

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);//设立投影矩阵，设置可视体范围，平行投影
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

//----------------------------------------------------------------------------
//上部关节

function base() {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);//长、宽、高
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);//实例矩阵
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function upperArm1() {
    var s = scale4(UPPER_ARM_WIDTH_SEC, UPPER_ARM_HEIGHT_SEC, UPPER_ARM_WIDTH_SEC);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT_SEC, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function upperArm2() {
    var s = scale4(UPPER_ARM_WIDTH_THI, UPPER_ARM_HEIGHT_THI, UPPER_ARM_WIDTH_THI);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT_THI, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function upperArm3() {
    var s = scale4(UPPER_ARM_WIDTH_FOR, UPPER_ARM_HEIGHT_FOR, UPPER_ARM_WIDTH_FOR);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT_FOR, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function upperArm4() {
    var s = scale4(UPPER_ARM_WIDTH_FIF, UPPER_ARM_HEIGHT_FIF, UPPER_ARM_WIDTH_FIF);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT_FIF, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------
//底部关节

function lowerArm()
{ 
    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
function lowerArm1()
{
    var s = scale4(LOWER_ARM_WIDTH_SEC, LOWER_ARM_HEIGHT_SEC, LOWER_ARM_WIDTH_SEC);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT_SEC, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
function lowerArm2()
{
    var s = scale4(LOWER_ARM_WIDTH_THI, LOWER_ARM_HEIGHT_THI, LOWER_ARM_WIDTH_THI);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT_THI, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
function lowerArm3()
{
    var s = scale4(LOWER_ARM_WIDTH_FOR, LOWER_ARM_HEIGHT_FOR, LOWER_ARM_WIDTH_FOR);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT_FOR, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
function lowerArm4()
{
    var s = scale4(LOWER_ARM_WIDTH_FIF, LOWER_ARM_HEIGHT_FIF, LOWER_ARM_WIDTH_FIF);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT_FIF, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------
//中间关节
function midArm1()
{
    var s = scale4(MID_ARM_WIDTH_SEC, MID_ARM_HEIGHT_SEC, MID_ARM_WIDTH_SEC);
    var instanceMatrix = mult( translate( 0.0, 0.5 * MID_ARM_HEIGHT_SEC, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function midArm2()
{
    var s = scale4(MID_ARM_WIDTH_THI, MID_ARM_HEIGHT_THI, MID_ARM_WIDTH_THI);
    var instanceMatrix = mult( translate( 0.0, 0.5 * MID_ARM_HEIGHT_THI, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function midArm3()
{
    var s = scale4(MID_ARM_WIDTH_FOR, MID_ARM_HEIGHT_FOR, MID_ARM_WIDTH_FOR);
    var instanceMatrix = mult( translate( 0.0, 0.5 * MID_ARM_HEIGHT_FOR, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function midArm4()
{
    var s = scale4(MID_ARM_WIDTH_FIF, MID_ARM_HEIGHT_FIF, MID_ARM_WIDTH_FIF);
    var instanceMatrix = mult( translate( 0.0, 0.5 * MID_ARM_HEIGHT_FIF, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//////////////////////////////////

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );//清除屏幕和深度缓存
	//旋转定点和运行
    modelViewMatrix = rotate(theta[Base], 0, 1, 0 ); 
    modelViewMatrix2 = rotate(theta[Base], 0, 1, 0 );
    base();
////////////////
    modelViewMatrix = mult(modelViewMatrix2, translate(-1.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], 0, 0, 1 ));
    lowerArm();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], 0, 0, 1) );
    upperArm();
    ////////////////////////////////
    modelViewMatrix = mult(modelViewMatrix2, translate(-0.5, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm1], 0, 0, 1 ));
    lowerArm1();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT_SEC, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[MidArm1], 0, 0, 1) );
    midArm1();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, MID_ARM_HEIGHT_SEC, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm1], 0, 0, 1) );
    upperArm1();
    ////////////////////////////////
    modelViewMatrix = mult(modelViewMatrix2, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm2], 0, 0, 1 ));
    lowerArm2();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT_THI, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[MidArm2], 0, 0, 1) );
    midArm2();
    
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, MID_ARM_HEIGHT_THI, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[UpperArm2], 0, 0, 1 ));
    upperArm2();
    /////////////////////////////
    modelViewMatrix = mult(modelViewMatrix2, translate(0.5, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm3], 0, 0, 1 ));
    lowerArm3();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT_FOR, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[MidArm3], 0, 0, 1) );
    midArm3();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, MID_ARM_HEIGHT_FOR, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm3], 0, 0, 1) );
    upperArm3();
    /////////////////////////////////
    modelViewMatrix = mult(modelViewMatrix2, translate(1.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm4], 0, 0, 1 ));
    lowerArm4();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT_FIF, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[MidArm4], 0, 0, 1) );
    midArm4();
    
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, MID_ARM_HEIGHT_FIF, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm4], 0, 0, 1) );
    upperArm4();
    
    //////////////////////////////////////////////////////////////////////////

    requestAnimFrame(render);
}
