// Things to do: 
// Gouraud and Phong shading
// Lightning fixure
// complexity of the planets

var moonSpeed;
var solidColor;
var program; 
var ctm;
var fovy = 90;
var aspect = 1;
var fowardBackAmount = 0;
var rightLeftAmount = 0;
var scales = [
    vec3(.7, .7, .7),
    vec3(.35, .35, .35),
    vec3(1.7, 1.7, 1.7),
    vec3(1.2, 1.2, 1.2),
    vec3(1.0, 1.0, 1.0),
];
var planets = [
    vec3(-4.9+rightLeftAmount, 0, fowardBackAmount),
    vec3(-9.7+rightLeftAmount, 0, fowardBackAmount),
    vec3(0+rightLeftAmount, 0, fowardBackAmount), 
    vec3(-7.4+rightLeftAmount, 0, fowardBackAmount),
    vec3(-2.9+rightLeftAmount, 0, fowardBackAmount),
];
var orbitSpeed1 = 0;
var orbitSpeed2 = 0;
var orbitSpeed3 = 0;
var orbitSpeed4 = 0;
var orbitSpeed5 = 0;
var orbitSpeeds = [
    orbitSpeed1,
    orbitSpeed2,
    orbitSpeed3,
    orbitSpeed4,
    orbitSpeed5
];
var degrees = 0;
var orbitRadius = 4;
var orbitDegrees = 0;
var individualColors = [
    [ 1, 1, 1, 1.0 ],  // white
    [ 0, 1, .4, 1 ],   // watery green
    [ 1.0, 1, 0, 1.0 ],     //sun
    [ 0.0, .8, 3.6, 1.0 ],  // green-blue
    [ .5, .35, .2, 1.0 ]   // brown
];
var colors = [];
var upDownRot = 30;
var rightLeftRot = 0;



var canvas;
var gl;

var numTimesToSubdivide = 5;
 
var index = 0;

var pointsArray = [];
var normalsArray = [];


var near = 1;
var far = 100;
var radius = 15;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop = 3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);
    

//original 1,1,1,1
var lightPosition = vec4(0.0, 0.0, 1.5, 1.0);
//original .2,.2,.2,1
var lightAmbient = vec4(0.1, 0.0, 0.2, 1.0 );
var lightDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 2.0, 1.0 );

var materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
var materialDiffuse = vec4( 0.5, 0.8, 0.5, 1.0 );
var materialSpecular = vec4( 0.5, 0.8, 0.5, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var program;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
    

function triangle(a, b, c) {

    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = normalize(cross(t1, t2));
    normal = vec4(normal);

    normalsArray.push(normal);
    normalsArray.push(normal);
    normalsArray.push(normal);

     pointsArray.push(a);
     pointsArray.push(b);      
     pointsArray.push(c);

     index += 3;
}


function divideTriangle(a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle( a, ab, ac, count - 1 );
        divideTriangle( ab, b, bc, count - 1 );
        divideTriangle( bc, c, ac, count - 1 );
        divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
        triangle( a, b, c );
    }
}


function tetrahedron(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}


window.onload = function init(x) {
//window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    ambientProduct = mult(lightAmbient, materialAmbient);
    specularProduct = mult(lightSpecular, materialSpecular);


    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    gl.uniform4fv( gl.getUniformLocation(program,
        "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
    if(x)
        render();
}

document.addEventListener('keydown', function(event)
{
    switch(event.keyCode)
    {
        case 39: //right arrow
            rightLeftRot += 1;
        break;
        case 37: //left arrow
            rightLeftRot -= 1;
        break;
        case 38: //up arrow
            upDownRot += 1;
        break;
        case 40: //down arrow
            upDownRot -= 1;
        break;
        case 73: //i
            fowardBackAmount += .25;
        break;
        case 77: //m
            fowardBackAmount -= .25;
        break;
        case 74: //j
            rightLeftAmount -= .25;
        break;
        case 75: //k
            rightLeftAmount += .25;
        break;
        case 82: //r
            upDownRot = 30;
            fowardBackAmount = 0;
            rightLeftAmount = 0;
            rightLeftRot = 0;
        break;
    }
});



function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
         radius*Math.sin(theta)*Math.sin(phi), 
         (radius*Math.cos(theta)));


    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    for(var i = 0; i < 5; i++)
    {
        ctm = mat4();
        ctm = mult(ctm, modelViewMatrix);
        ctm = mult(ctm, translate(vec3(rightLeftAmount, 0, fowardBackAmount)));
        ctm = mult(ctm, rotate(upDownRot, vec3(1, 0, 0)));
        ctm = mult(ctm, rotate(orbitSpeeds[i], vec3(0, 1, 0)));
        ctm = mult(ctm, rotate(rightLeftRot, vec3(0, 1, 0)));
        ctm = mult(ctm, translate(planets[i]));
        ctm = mult(ctm, scale(scales[i]));
        
        orbitSpeeds[0] += .1;
        orbitSpeeds[1] += .2;
        orbitSpeeds[2] += 0;
        orbitSpeeds[3] += .3;
        orbitSpeeds[4] += .4;

        diffuseProduct = mult(lightDiffuse, individualColors[i]);
        ambientProduct = mult(lightAmbient, individualColors[i]);
        specularProduct = mult(lightSpecular, individualColors[i]);
        //alert(add(add(specularProduct, ambientProduct), diffuseProduct));


        gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),flatten(diffuseProduct) ); 

        gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),flatten(ambientProduct) );

        gl.uniform4fv( gl.getUniformLocation(program,
        "specularProduct"), flatten(specularProduct));


        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        for(var k = 0; k < index; k+=3)
        {
            gl.drawArrays(gl.TRIANGLES, k, 3);
        }
    }
        
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);
    ctm = mult(ctm, rotate(upDownRot, vec3(1, 0, 0)));
    ctm = mult(ctm, rotate(orbitSpeeds[3], vec3(0, 1, 0)));
    ctm = mult(ctm, rotate(rightLeftRot, vec3(0, 1, 0)));
    ctm = mult(ctm, rotate(orbitSpeeds[1], vec3(1, 0, 0)));
    ctm = mult(ctm, translate( vec3(-7.4+rightLeftAmount, 1.5, fowardBackAmount) ));
    ctm = mult(ctm, scale(vec3(.2, .2, .2)));

    diffuseProduct = mult(lightDiffuse, vec4(.3, .3, .3, 1));
    ambientProduct = mult(lightAmbient, vec4(.3, .3, .3, 1));
    specularProduct = mult(lightSpecular, vec4(.3, .3, .3, 1));

    gl.uniform4fv( gl.getUniformLocation(program, 
    "diffuseProduct"),flatten(diffuseProduct) ); 
    gl.uniform4fv( gl.getUniformLocation(program, 
    "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
    "specularProduct"), flatten(specularProduct));


    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    for(var k = 0; k < index; k+=3)
    {
        gl.drawArrays(gl.TRIANGLES, k, 3);
    }

    window.requestAnimFrame(render);
}