
var canvas;
var gl;
var length = 0.5;


var scale_ball = vec3(0.2, 0.2, 1);
var modelViewMatrix;
var deg;
var scale_paddle = vec3(0.5, 0.1, 1);
var translate_paddle = vec3(0.0 , -1.0, 0.0 );
var translate_ball = vec3();

var direction = vec3(1, 1, 0);
var speed = vec3(.02, .01, 0);

window.onload = function init(){

	//
    //  Setup WebGL
    //
    //these are from the library to set up webGL
	canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    gl.viewport( 0, 0, canvas.width, canvas.height );   
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    
    


    // Set up geometry models
    //vec2 takes 2 elements, the x value and the y value
    var vertices = [
        vec2(  length,  length ), //vertex 1
        vec2(  length,  -length ), //vertex 2
        vec2( -length,  length ), //vertex 3
        vec2(  -length, -length )  //vertex 4
    ];

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");

    //Can reuse the points in the buffer from above to make paddle

    canvas.onmousemove = function(e)
    {
        var x = e.clientX;

        var xprime = 2*(x - canvas.width/2) / canvas.width;

        translate_paddle[0] = xprime;
    }

    render();
};


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    if(translate_ball[0] >= 1 || translate_ball[0] <= -1)
    {
        direction[0] = -direction[0];
    }
    if(translate_ball[1] >= 1 || translate_ball[1] <= -1)
    {
        direction[1] = -direction[1];
    }
    
    //Need to include here because you need to render it each time. Cannot put it into the model
    deg += 30;
    translate_ball = add(translate_ball, vec3(speed[0] * direction[0], speed[1] * direction[1], 0));
    var ctm = mat4();
    ctm = mult(ctm, translate_ball);
    //Transformations is applied in reverse order so rotate first
    ctm = mult(ctm, scale(scale_ball));
    ctm = mult(cmt, rotate(deg, [0, 0, 1]));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));

    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    ctm = mat4();
    ctm = mult(ctm, translate(translate_paddle));
    ctm = mult(scale(scale_paddle));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    window.requestAnimFrame(render);
}
