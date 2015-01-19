
var canvas;
var gl;
var dis = 0.0;
var deg = 0.0;
var displacement;
var modelViewMatrix;

window.onload = function init(){

	//
    //  Setup WebGL
    //
    //these are from the library to set up webGL
	canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    //
    //  Configure WebGL
    //
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );    //background: grey
    //gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //gl.clearColor( 1.5, 1.5, 1.0, 1.0 );
    //gl.clearColor( -1.5, 0, 1.0, 1.0 );

    //gl.viewport( 0, 0, canvas.width, canvas.height );
    //gl.viewport( 0, 0, canvas.width/2, canvas.height/2 );
    
    


    // Set up geometry models
    //vec2 takes 2 elements, the x value and the y value
    var vertices = [
        vec2(  0,  1 ), //vertex 1
        vec2(  1,  0 ), //vertex 2
        vec2( -1,  0 ), //vertex 3
        vec2(  0, -1 )  //vertex 4
    ];

    // var vertices = [
    //     vec2(  0,  10 ),
    //     vec2(  10,  0 ),
    //     vec2( -10,  0 ),
    //     vec2(  0, -10 )
    // ];

     var colors = [
         vec4(  1, 0, 0, 1 ),
         vec4(  0, 1, 0, 1 ),
         vec4(  0, 0, 1, 1 ),
         vec4(  0, 0, 0, 0 )
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
    //The next line parses the buffer into 2 coordinates each in the array
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    
    // // Load the data into the GPU
     var cbuffer = gl.createBuffer();
     gl.bindBuffer( gl.ARRAY_BUFFER, cbuffer );
     gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // // Associate out shader variables with our data buffer
     var vColor = gl.getAttribLocation( program, "vColor" );
     gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
     gl.enableVertexAttribArray( vColor );

    
    //displacement = gl.getUniformLocation(program, "displacement");
    //modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");

    // Initialize event handlers
    // document.getElementById("bt_move").onclick = function () {
    //     dis+= 0.1;
    // };



    render();
};


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    //Take the points in the buffer to draw triangles
    //2 Trangles are drawn to fill in square
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    //Different ways in drawing polygons to color in the square
    //Second parameter is the starting index of the buffer
    //gl.drawArrays( gl.TRIANGLES, 0, 3 );
    //gl.drawArrays( gl.TRIANGLES, 1, 3 );
    //gl.drawArrays( gl.TRIANGLES, 0, 4 );
    //gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    //gl.drawArrays( gl.POINTS, 0, 3 );
    //gl.drawArrays( gl.LINES, 0, 4 );
    //gl.drawArrays( gl.LINE_STRIP, 0, 4 );
    //gl.drawArrays( gl.LINE_LOOP, 0, 4 );



    // dis += 0.001;
    // gl.uniform1f(displacement, dis);

	// dis += 0.001;
 //    var ctm = translate(dis, 0, 0);
 //    gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm))

 	// deg += 5;
  	// var ctm = rotate(deg, 0, 1, 0);
  	// gl.uniformMatrix4fv(modelViewMatrix, false, flatten(ctm))


    // window.requestAnimFrame(render);
}
