function start() {
	const canvas = document.getElementById("my_canvas");
//Inicialize the GL contex
	const gl = canvas.getContext("webgl2");
	if (gl === null) {
	alert("Unable to initialize WebGL. Your browser or machine may not support it.");
	return;
}

console.log("WebGL version: " + gl.getParameter(gl.VERSION));
console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
console.log("Vendor: " + gl.getParameter(gl.VENDOR));

const vs = gl.createShader(gl.VERTEX_SHADER);
const fs = gl.createShader(gl.FRAGMENT_SHADER);
const program = gl.createProgram();


	const vsSource = 
			`#version 300 es
			precision highp float;
			in vec2 position;
			void main(void)
			{
			   gl_Position = vec4(position, 0.0, 1.0);
			}
			`;

			const fsSource = 
			`#version 300 es
		   precision highp float;
		   out vec4 frag_color;
		   uniform vec3 uniColor;
		   void main(void)
	   	{
		      frag_color = vec4(uniColor, 1.0);
	   	}
			`;


//compilation vs
		gl.shaderSource(vs, vsSource);		
		gl.compileShader(vs);
		if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(vs));
                }

//compilation fs
		gl.shaderSource(fs, fsSource);     
		gl.compileShader(fs);
		if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
                {
                    alert(gl.getShaderInfoLog(fs));
                }


	gl.attachShader(program,vs);
	gl.attachShader(program,fs);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(program));
	}

   gl.useProgram(program);


// change the amount of the points to 8
const vertices =
[
-0.6, -0.6,
-0.5, 0.2,
-0.3, 0.3,
0.0, 0.5,
0.3, 0.3,
0.5, 0.0,
0.3, -0.3,
0.0, -0.3,
];
var uniColor_loc = gl.getUniformLocation(program, 'uniColor'); 
var maincolor=[0.9,0.6,0.0];
gl.uniform3fv(uniColor_loc, maincolor);
primitives=gl.TRIANGLES;
// send data to CPU from GPU
const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	const position = gl.getAttribLocation(program, "position");
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

// draw the triangle
function draw(){
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(primitives, 0, 8);
	window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);

// Add the event listeners for mousedown, mousemove, and mouseup
window.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
   alert("x ="+x+ " y ="+y);
});

// Add the event listeners for keydown, keyup
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // Left
      alert('left');
    break;
    case 38: // Up
      alert('up');
    break;
    case 39: // Right
      alert('right');
    break;
    case 40: // Down
      alert('down');
    break;

	case 49: //1
		primitives=gl.LINES;
		
	break;
	case 50: //2
		primitives=gl.LINE_STRIP;
	break;
	case 51: //3
		primitives=gl.LINE_LOOP;
	break;
	case 52: //4
		primitives=gl.TRIANGLES;
	break;
	case 53: //5
		primitives=gl.TRIANGLE_STRIP;
	break;
	case 54: //6
		primitives=gl.TRIANGLE_FAN;
	break;	




	case 82: //r
		maincolor=[1.0,0.0,0.0];
		gl.uniform3fv(uniColor_loc, maincolor);
	break;

	case 71: //g
		maincolor=[0.0,1.0,0.0];
		gl.uniform3fv(uniColor_loc, maincolor);
	break;
	case 66: //b
		maincolor=[0.0,0.0,1.0];
		gl.uniform3fv(uniColor_loc, maincolor);
	break;

  }
}, false);




}
