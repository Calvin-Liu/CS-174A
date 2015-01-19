
var canvas;
var gl;
var length = 0.5;
var deg = 0.0;

var scale_ball = vec3(0.1, 0.1, 1.0);
var scale_paddle = vec3(1.0, 0.1, 1.0);
var translate_paddle = vec3(0.0, -1.0, 0.0);
var translate_ball = vec3(0, 0, 0);

var modelViewMatrix;

var speed = vec3(0.0374, 0.0589, 0);
var direction = vec3(1, 1, 0);

var score_me = 0;
var score_opponent = 0;


window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    vertices = [
        vec2(  length,   length ), //vertex 1
        vec2(  length,  -length ), //vertex 2
        vec2( -length,   length ), //vertex 3
        vec2( -length,  -length )  //vertex 4    
    ];

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");

    canvas.onmousemove = function(e){
        var x = e.clientX;
        translate_paddle[0] = 2*(x - canvas.width/2)/canvas.width;
    }

    
    render();
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(translate_ball[0] + length * scale_ball[0] >= 1 || translate_ball[0] - length * scale_ball[0] <= -1 ){
        direction[0] = -direction[0];
    }
    if(translate_ball[1] + length * scale_ball[1] >= 1){
        direction[1] = -direction[1];
    }
    else if(translate_ball[1] - length * scale_ball[1] <= -1){
        if(translate_ball[0] - length * scale_ball[0] > translate_paddle[0] + length * scale_paddle[0] || 
            translate_ball[0] + length * scale_ball[0] < translate_paddle[0] - length * scale_paddle[0])
        {
            // var restart = confirm("Game Over! Restart?");
            // if (restart == true) {
            //     translate_ball = vec3();
            //     direction = vec3(1, 1, 0);
            // }
            translate_ball = vec3();
            direction = vec3(1, 1, 0);
            score_opponent++;

        }
        else{
            direction[1] = -direction[1];
        }
    }


    deg += 50;
    translate_ball = add(translate_ball, vec3(speed[0]*direction[0], speed[1]*direction[1], 0));

    var ctm = mat4();
    ctm = mult(ctm, translate(translate_ball));
    ctm = mult(ctm, scale(scale_ball));
    ctm = mult(ctm, rotate(deg, [0, 0, 1]));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));

    
   
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    ctm = mat4();
    ctm = mult(ctm, translate(translate_paddle));
    ctm = mult(ctm, scale(scale_paddle));
    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm));
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    document.getElementById('score_me').innerHTML = score_me;
    document.getElementById('score_opponent').innerHTML = score_opponent;
    
    window.requestAnimFrame( render );
}

