var gl;
var canvas;

var va = vec4(0.0, 0.0, -1.0, 1.0);
var vb = vec4(0.0, 0.942809, 0.333333, 1.0);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1.0);
var vd = vec4(0.816497, -0.471405, 0.333333, 1.0);

var numPoints = 0;
var points_2 = [];
var normals_2 = [];
var points_3 = [];
var normals_3 = [];
var points_4 = [];
var normals_4 = [];
var points_5 = [];
var normals_5 = [];
var numTimesToSubdivide;

var scale_planet = vec3(0.7, 0.7, 0.7);
var translate_planets = [
	vec3(4.5, 0.0, 0.0),
	vec3(6.5, 0.0, 0.0),
	vec3(9.0, 0.0, 0.0),
	vec3(11.5, 0.0, 0.0)
];
var move_planets = vec3(0.0, 0.0, 0.0);
var rotate_planets = [0, 0, 0, 0];

var eye = vec3(0.0, 0.0, 0.0);
var at = vec3(0.0, 0.0, -15.0);
var up = vec3(0.0, 1.0, 0.0);
	
var fovy = 90;
var aspect = 1;
var near = 1.0;
var far = 30.0;

var azimuth = 0;
var pitch = 0;
var xdeg = 0;
var ydeg = 0;
var zdeg = 0;

var UNIFORM_modelViewMatrix;
var UNIFORM_projection;
var UNIFORM_ambientProduct;
var UNIFORM_diffuseProduct;
var UNIFORM_specularProduct;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var UNIFORM_lightMatrix;
var UNIFORM_shadeType;

var lightAmbient = vec4(0.7, 0.7, 0.7, 1.0);
var materialAmbient = vec4(1.0, 0.4, 0.0, 1.0);
var ambientProduct = mult(lightAmbient, materialAmbient);

var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(1.0, 0.0, 0.0, 1.0);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);

var lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularProduct = mult(lightSpecular, materialSpecular);

var shininess = 100;
var shadeType = 2.0;
var lightPosition = vec4(0.0, 0.0, 0.0, 1.0);

window.onload = function init()
{
 	canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available."); }

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	gl.enable(gl.DEPTH_TEST);

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	numTimesToSubdivide = 2;
	createSphere(va, vb, vc, vd, numTimesToSubdivide);
	numTimesToSubdivide = 3;
	createSphere(va, vb, vc, vd, numTimesToSubdivide);
	numTimesToSubdivide = 4;
	createSphere(va, vb, vc, vd, numTimesToSubdivide);
	numTimesToSubdivide = 5;
	createSphere(va, vb, vc, vd, numTimesToSubdivide);

	UNIFORM_modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
	UNIFORM_projection = gl.getUniformLocation(program, "projection");
	UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
    UNIFORM_lightMatrix = gl.getUniformLocation(program, "lightMatrix");
    UNIFORM_shadeType = gl.getUniformLocation(program, "ShadeType");

	render();	
}

function createSphere(a, b, c, d, n)
{
	divideTriangle(a, b, c, n);
	divideTriangle(d, c, b, n);
	divideTriangle(a, d, b, n);
	divideTriangle(a, c, d, n);
}

function divideTriangle(a, b, c, count)
{
	if(count > 0)
	{
		var ab = normalize(mix(a, b, 0.5), true);
		var ac = normalize(mix(a, c, 0.5), true);
		var bc = normalize(mix(b, c, 0.5), true);
		divideTriangle(a, ab, ac, count - 1);
		divideTriangle(ab, b, bc, count - 1);
		divideTriangle(bc, c, ac, count - 1);
		divideTriangle(ab, bc, ac, count - 1);
	}
	else
	{
		triangle(a, b, c);
	}
}

function triangle(a, b, c){

	if(numTimesToSubdivide === 2)
	{
		var d = vec4(a[0], a[1], a[2], 0.0);
	    var e = vec4(b[0], b[1], b[2], 0.0);
	    var f = vec4(c[0], c[1], c[2], 0.0);
		normals_2.push(d);
		normals_2.push(e);
		normals_2.push(f);

		points_2.push(a);
		points_2.push(b);
		points_2.push(c);
	}

	if(numTimesToSubdivide === 3)
	{
		var t1 = subtract(b, a);
	    var t2 = subtract(c, a);
	    var normal = normalize(cross(t1, t2));
	    normal = negate(vec4(normal[0], normal[1], normal[2], 0.0));

	    normals_3.push(normal);
	    normals_3.push(normal);
	    normals_3.push(normal);

	    points_3.push(a);
		points_3.push(b);
		points_3.push(c);
	}

	if(numTimesToSubdivide === 4)
	{
		var d = vec4(a[0], a[1], a[2], 0.0);
	    var e = vec4(b[0], b[1], b[2], 0.0);
	    var f = vec4(c[0], c[1], c[2], 0.0);
		normals_4.push(d);
		normals_4.push(e);
		normals_4.push(f);

		points_4.push(a);
		points_4.push(b);
		points_4.push(c);
	}

	if(numTimesToSubdivide === 5)
	{
		var t1 = subtract(b, a);
    	var t2 = subtract(c, a);
    	var normal = normalize(cross(t1, t2));
    	normal = negate(vec4(normal[0], normal[1], normal[2], 0.0));

   	 	normals_5.push(normal);
   	 	normals_5.push(normal);
    	normals_5.push(normal);

    	points_5.push(a);
		points_5.push(b);
		points_5.push(c);
	}
}


setInterval("increment_rotate();", 40);

function increment_rotate() 
{
	rotate_planets[0] += 7;
	rotate_planets[1] += 4;
	rotate_planets[2] += 2.5;
	rotate_planets[3] += 1;
	render();
}

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	light = mat4();
	light = mult(light, translate(move_planets));
	light = mult(light, rotate(-azimuth, [0.0, 1.0, 0.0]));
	light = mult(light, rotate(pitch, [Math.cos(radians(azimuth)), 0.0, -Math.sin(radians(azimuth))]));
	light = mult(light, translate(vec3(0.0, 0.0, -15.0)));
	gl.uniformMatrix4fv(UNIFORM_lightMatrix, false, flatten(light));

	ctm = lookAt(eye, at, up);
	ctm = mult(ctm, translate(move_planets));
	ctm = mult(ctm, rotate(-azimuth, [0.0, 1.0, 0.0]));
	ctm = mult(ctm, rotate(pitch, [Math.cos(radians(azimuth)), 0.0, -Math.sin(radians(azimuth))]));
	ctm = mult(ctm, translate(vec3(0.0, 0.0, -15.0)));
	ctm = mult(ctm, scale(vec3(2.0, 2.0, 2.0)));
    proj = perspective(fovy, aspect, near, far);

    lightAmbient = vec4(0.7, 0.7, 0.7, 1.0);
	materialAmbient = vec4(1.0, 0.4, 0.0, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);

	lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
	materialDiffuse = vec4(1.0, 0.0, 0.0, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);

	lightSpecular = vec4(0.4, 0.4, 10.4, 1.0);
	materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
	specularProduct = mult(lightSpecular, materialSpecular);

	shininess = 100;
	shadeType = 2.0;

    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm));
    gl.uniformMatrix4fv(UNIFORM_projection, false, flatten(proj));
    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform4fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shadeType, shadeType);
    gl.uniform1f(UNIFORM_shininess,  shininess);

	for(var i = 0; i < points_4.length; i += 3) { 
        gl.drawArrays( gl.TRIANGLES, i, 3 );
    }

    for(var k = 0; k < 4; k++) {

    	//Icy Planet
    	if(k === 0)
    	{
    		numPoints = points_2.length;
    		lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
			materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
			ambientProduct = mult(lightAmbient, materialAmbient);

			lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
			materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
			diffuseProduct = mult(lightDiffuse, materialDiffuse);

			lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
			materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
			specularProduct = mult(lightSpecular, materialSpecular);

			shininess = 70;
			shadeType = 1.0;

			var vBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_2), gl.STATIC_DRAW);
		    
		    var vPosition = gl.getAttribLocation( program, "vPosition");
		    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vPosition);

		    var nBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals_2), gl.STATIC_DRAW);

		    var vNormal = gl.getAttribLocation(program, "vNormal");
		    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vNormal);

    	}

    	//Swamp Planet
    	if(k === 1)
    	{
    		numPoints = points_3.length;
    		lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
			materialAmbient = vec4(0.0, 0.7, 0.2, 1.0);
			ambientProduct = mult(lightAmbient, materialAmbient);

			lightDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
			materialDiffuse = vec4(0.0, 0.7, 0.2, 1.0);
			diffuseProduct = mult(lightDiffuse, materialDiffuse);

			lightSpecular = vec4(0.3, 0.3, 0.3, 1.0);
			materialSpecular = vec4(0.0, 0.7, 0.2, 1.0);
			specularProduct = mult(lightSpecular, materialSpecular);

			shininess = 100;
			shadeType = 2.0;

			var vBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_3), gl.STATIC_DRAW);
		    
		    var vPosition = gl.getAttribLocation( program, "vPosition");
		    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vPosition);

		    var nBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals_3), gl.STATIC_DRAW);

		    var vNormal = gl.getAttribLocation(program, "vNormal");
		    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vNormal);

    	}

    	//Water Planet
    	if(k === 2)
    	{
    		numPoints = points_5.length;
    		lightAmbient = vec4(0.4, 0.4, 0.4, 1.0);
			materialAmbient = vec4(0.0, 0.1, 1.0, 1.0);
			ambientProduct = mult(lightAmbient, materialAmbient);

			lightDiffuse = vec4(0.7, 0.7, 0.7, 1.0);
			materialDiffuse = vec4(0.0, 0.1, 1.0, 1.0);
			diffuseProduct = mult(lightDiffuse, materialDiffuse);

			lightSpecular = vec4(0.9, 0.9, 0.9, 1.0);
			materialSpecular = vec4(0.6, 0.6, 0.6, 1.0);
			specularProduct = mult(lightSpecular, materialSpecular);

			shininess = 90;
			shadeType = 1.0;

			var vBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_5), gl.STATIC_DRAW);
		    
		    var vPosition = gl.getAttribLocation( program, "vPosition");
		    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vPosition);

		    var nBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals_5), gl.STATIC_DRAW);

		    var vNormal = gl.getAttribLocation(program, "vNormal");
		    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vNormal);

    	}

    	//Rusty planet
    	if(k === 3)
    	{
    		numPoints = points_4.length;
    		lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
			materialAmbient = vec4(0.6, 0.3, 0.0, 1.0);
			ambientProduct = mult(lightAmbient, materialAmbient);

			lightDiffuse = vec4(0.4, 0.4, 0.4, 1.0);
			materialDiffuse = vec4(0.6, 0.3, 0.0, 1.0);
			diffuseProduct = mult(lightDiffuse, materialDiffuse);

			lightSpecular = vec4(0.0, 0.0, 0.0, 1.0);
			materialSpecular = vec4(0.0, 0.0, 0.0, 1.0);
			specularProduct = mult(lightSpecular, materialSpecular);

			shininess = 0;
			shadeType = 2.0;

			var vBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(points_4), gl.STATIC_DRAW);
		    
		    var vPosition = gl.getAttribLocation( program, "vPosition");
		    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vPosition);

		    var nBuffer = gl.createBuffer();
		    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
		    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals_4), gl.STATIC_DRAW);

		    var vNormal = gl.getAttribLocation(program, "vNormal");
		    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
		    gl.enableVertexAttribArray(vNormal);

    	}

	    gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm));
	    gl.uniformMatrix4fv(UNIFORM_projection, false, flatten(proj));
	    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
	    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
	    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
	    gl.uniform4fv(UNIFORM_lightPosition,  flatten(lightPosition));
	    gl.uniform1f(UNIFORM_shadeType, shadeType);
	    gl.uniform1f(UNIFORM_shininess,  shininess);

    	ctm = mat4();
    	ctm = mult(ctm, lookAt(eye, at, up));
    	ctm = mult(ctm, translate(move_planets));
    	ctm = mult(ctm, rotate(-azimuth, [0.0, 1.0, 0.0]));
    	ctm = mult(ctm, rotate(pitch, [Math.cos(radians(azimuth)), 0.0, -Math.sin(radians(azimuth))]));
    	ctm = mult(ctm, translate(vec3(0.0, 0.0, -15.0)))
    	ctm = mult(ctm, rotate(rotate_planets[k], [0.0, 1.0, 0.0]));
    	ctm = mult(ctm, translate(translate_planets[k]));
    	ctm = mult(ctm, scale(scale_planet));
    	gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm));
    	for(var i = 0; i < numPoints; i += 3) { 
        	gl.drawArrays( gl.TRIANGLES, i, 3 );
    	}
    }
    //Moon
    numPoints = points_4.length;
	lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
	materialAmbient = vec4(0.3, 0.3, 0.0, 1.0);
	ambientProduct = mult(lightAmbient, materialAmbient);

	lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
	materialDiffuse = vec4(0.3, 0.3, 0.0, 1.0);
	diffuseProduct = mult(lightDiffuse, materialDiffuse);

	lightSpecular = vec4(0.6, 0.6, 0.0, 1.0);
	materialSpecular = vec4(1.0, 1.0, 0.0, 1.0);
	specularProduct = mult(lightSpecular, materialSpecular);

	shininess = 70;
	shadeType = 2.0;

    ctm = mat4();
	ctm = mult(ctm, lookAt(eye, at, up));
	ctm = mult(ctm, translate(move_planets));
	ctm = mult(ctm, rotate(-azimuth, [0.0, 1.0, 0.0]));
	ctm = mult(ctm, rotate(pitch, [Math.cos(radians(azimuth)), 0.0, -Math.sin(radians(azimuth))]));
	ctm = mult(ctm, translate(vec3(0.0, 0.0, -15.0)))
	ctm = mult(ctm, rotate(rotate_planets[3], [0.0, 1.0, 0.0]));
	ctm = mult(ctm, translate(translate_planets[3]));
	ctm = mult(ctm, rotate(rotate_planets[0], [0.0, 1.0, 0.0]));
	ctm = mult(ctm, translate(vec3(1.0, 0.0, 0.0)));
	ctm = mult(ctm, scale(vec3(0.2, 0.2, 0.2)));
    	
	gl.uniformMatrix4fv(UNIFORM_modelViewMatrix, false, flatten(ctm));
    gl.uniformMatrix4fv(UNIFORM_projection, false, flatten(proj));
    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform4fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shadeType, shadeType);
    gl.uniform1f(UNIFORM_shininess,  shininess);

    for(var i = 0; i < numPoints; i += 3) { 
		gl.drawArrays( gl.TRIANGLES, i, 3 );
	}
}