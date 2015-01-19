var canvas;
var gl;

var NumVertices = 36;
var NumCrosshair = 2;
var scales = vec3(8, 8, 8);

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var rotTheta = [0, 0, 0];
var thetaLoc;

var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var solidColor;
var uniformColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.9, 0.9, 0.9, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];


var points = [];
var colors = [];
var staticColors = [];
var ctm;

var cubes = [
    vec3(10, 10, -10),
    vec3(-10, 10, -10),
    vec3(10, -10, -10),
    vec3(-10, -10, -10),
    vec3(10, 10, 10),
    vec3(-10, 10, 10),
    vec3(10, -10, 10),
    vec3(-10, -10, 10)
];


var pMatrix, mvMatrix, oMatrix;
var modelViewMatrix, projectionViewMatrix, orthoProjectionMatrix;
var radius = 4.0;
var near = 10;
var far = 100;
var fovy = 60.0;
var aspect; 
var yesNarrow = false;
var yesWide = false;
var narrow = 0;


var eye = vec3(Math.sin(theta)*Math.cos(phi), 0.0, 35);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var yesUp = false; 
var yesDown = false;
var yesLeft = false;
var yesRight = false;
var yesFoward = false;
var yesBack = false;

var tU = 0.0;
var translateUp = vec3(0.0, tU, 0.0);
var tD = 0.0;
var translateDown = vec3(0.0, tD, 0.0);
var tL = 0.0;
var translateLeft = vec3(tL, 0.0, 0.0);
var tR = 0.0;
var translateRight = vec3(tR, 0.0, 0.0);
var tF = 0.0;
var translateFoward = vec3(0.0, 0.0, tF);
var tB = 0.0;
var translateBack = vec3(0.0, 0.0, tB);

var rotateLeft = 0.0;
var rotateRight = 0.0;

var crossAppear = false;
var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;
var crossScale = vec3(10.0, 0.0, 0.0);

var cameraRight = false;
var cameraLeft = false; 
var reset = false; 

var squareVertices = [
    vec3(1, 1, 0),
    vec3(-1, 1, 0),
    vec3(1, -1, 0),
    vec3(-1, -1, 0)
];

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 67) // c
    {
        crossAppear = true;
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 32)// spacebar
    {
        var temp = uniformColors[0];
        uniformColors[0] = uniformColors[1];
        uniformColors[1] = uniformColors[2];
        uniformColors[2] = uniformColors[3];
        uniformColors[3] = uniformColors[4];
        uniformColors[4] = uniformColors[5];
        uniformColors[5] = uniformColors[6];
        uniformColors[6] = uniformColors[7]; 
        uniformColors[7] = temp; 
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 82) //R
    {
        reset = true; 
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 87) // w
    {
        yesWide = true;
        narrow -= 0.3;
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 78) // n
    {
        yesNarrow = true;
        narrow += 0.3;
    }
});

//***************************************************************************//
document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 39) //right arrow
    {   
        cameraRight = true;
        //rotateRight += 1.0;
        rotateRight += 10.0;
        //rotateRight += 90.0; 
        //theta += 10;
        //eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 0.0, 35);
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 37) //left arrow
    {
        cameraLeft = true;
        //rotateLeft -= 1.0;
        rotateLeft -= 10.0;
        //rotateLeft -= 90.0;
        //theta -= 10;
        //eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 0.0, 35);
    }
});
//***************************************************************************//

//*****************************************************************************//
document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 38) //up arrow
    {
        yesUp = true;
        tU = tU - 0.25;
        translateUp = vec3(0.0, tU, 0.0);
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 40) //down arrow
    {
        yesDown = true;
        tD += 0.25;
        translateDown = vec3(0.0, tD, 0.0);
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 74) // j
    {
        yesLeft = true;
        tL += 0.25;
        translateLeft = vec3(tL, 0.0, 0.0);
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 75) // k
    {
        yesRight = true;
        tR -= 0.25;
        translateRight = vec3(tR, 0.0, 0.0);
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 73) // i
    {
        yesFoward = true;
        tF += 0.25;
        translateFoward = vec3(0.0, 0.0, tF);
    }
});

document.addEventListener('keydown', function(event)
{
    if(event.keyCode == 77) // m
    {
        yesBack = true;
        tB -= 0.25;
        translateBack = vec3(0.0, 0.0, tB);
    }
});
//*********************************************************************************//



window.onload = function init()
{
	canvas = document.getElementById( "gl-canvas");

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ) { alert("WebGL isn't available" ); }

	colorCube();

	gl.viewport(0, 0, canvas.width, canvas.height);

    aspect = canvas.width / canvas.height;

	gl.clearColor(1.0, 1.0, 1.0, 1.0);


	gl.enable(gl.DEPTH_TEST);

    for(var j = 0; j < 36; j++)
    {
        staticColors.push([0.0, 0.0, 0.0, 1.0]);
    }

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( vPosition );	



    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    projectionViewMatrix = gl.getUniformLocation(program, "projectionViewMatrix");
    solidColor = gl.getUniformLocation(program, "solidColor");
    orthoProjectionMatrix = gl.getUniformLocation(program, "orthoProjectionMatrix" );

    thetaLoc = gl.getUniformLocation(program, "rotTheta");

	render();
}

//------------------------------------------------------------------//

function colorCube()
{
    quad( 1, 0, 3, 2 ); 
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    var vertices = [
        vec3( -0.2, -0.2,  0.2 ),
        vec3( -0.2,  0.2,  0.2 ),
        vec3(  0.2,  0.2,  0.2 ),
        vec3(  0.2, -0.2,  0.2 ),
        vec3( -0.2, -0.2, -0.2 ),
        vec3( -0.2,  0.2, -0.2 ),
        vec3(  0.2,  0.2, -0.2 ),
        vec3(  0.2, -0.2, -0.2 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    //a1b0c3d2
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[indices[i]]);
    }
}

//------------------------------------------------------------------//

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(yesWide)
    {
        aspect = 1 + narrow;
    }
    if(yesNarrow)
    {
        aspect = 1 + narrow;
    }

    mvMatrix = lookAt(eye, at, up);
    pMatrix = perspective(fovy, aspect, near, far);

    for(var i = 0; i < 8; i++)
    {
        ctm = mat4();
        ctm = mult(ctm, mvMatrix);
        ctm = mult(ctm, translate(cubes[i]));
        ctm = mult(ctm, scale(scales));

        if(reset)
        {
            cameraRight = false;
            cameraLeft = false;
            yesUp = false;
            yesDown = false;
            yesLeft = false;
            yesRight = false;
            yesFoward = false;
            yesBack = false;
            narrow = 0;
            rotateRight = 0;
            rotateLeft = 0;
            tR = 0;
            tL = 0;
            tF = 0;
            tB = 0;
            tD = 0;
            tU = 0;
            crossAppear = false;
            reset = false;
        }
        if(cameraRight)
        {  
           ctm = mult(ctm, rotate(rotateRight, [0.0, 1.0, 0.0]));
        }
        if(cameraLeft)
        {
            ctm = mult(ctm, rotate(rotateLeft, [0.0, 1.0, 0.0]));
        }
        if(yesUp)
        {
            ctm = mult(ctm, translate(translateUp));
        }
        if(yesDown)
        {
            ctm = mult(ctm, translate(translateDown));
        }
        if(yesLeft)
        {
            ctm = mult(ctm, translate(translateLeft));
        }
        if(yesRight)
        {
            ctm = mult(ctm, translate(translateRight));
        }
        if(yesFoward)
        {
            ctm = mult(ctm, translate(translateFoward));
        }
        if(yesBack)
        {
            ctm = mult(ctm, translate(translateBack));
        }

        gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
        gl.uniformMatrix4fv(projectionViewMatrix, false, flatten(pMatrix));
        gl.uniform4fv(solidColor, flatten(uniformColors[i]));


        rotTheta[xAxis] += 0.3;
        gl.uniform3fv(thetaLoc, rotTheta);

        gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    }


    if(crossAppear)
    {

        oMatrix = ortho(left, right, bottom, ytop, near, far);
        ctm = mat4();
        ctm = mult(ctm, mvMatrix);
        var crossScale = vec3(5, 0, 0);
        ctm = mult(ctm, scale(crossScale)); 
        gl.uniformMatrix4fv( modelViewMatrix, false, flatten(ctm));
        gl.uniformMatrix4fv( projectionViewMatrix, false, flatten(pMatrix));
        gl.drawArrays( gl.LINE_LOOP, 0, NumVertices );

        ctm = mat4();
        ctm = mult(ctm, mvMatrix);
        crossScale = vec3(0, 5, 0);
        ctm = mult(ctm, scale(crossScale));
        gl.uniformMatrix4fv( modelViewMatrix, false, flatten(ctm));
        gl.uniformMatrix4fv( projectionViewMatrix, false, flatten(pMatrix));
        gl.drawArrays( gl.LINE_LOOP, 0, NumVertices );

    }
    


    requestAnimFrame( render );
}