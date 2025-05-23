function start() {
  const canvas = document.getElementById("my_canvas");
  //Inicialize the GL contex
  const gl = canvas.getContext("webgl2");
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock;
  document.exitPointerLock =
    document.exitPointerLock || document.mozExitPointerLock;
  canvas.onclick = function () {
    canvas.requestPointerLock();
  };
  // Hook pointer lock state change events for different browsers
  document.addEventListener("pointerlockchange", lockChangeAlert, false);
  document.addEventListener("mozpointerlockchange", lockChangeAlert, false);
  function lockChangeAlert() {
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas
    ) {
      console.log("The pointer lock status is now locked");
      document.addEventListener("mousemove", set_camera_mouse, false);
    } else {
      console.log("The pointer lock status is now unlocked");
      document.removeEventListener("mousemove", set_camera_mouse, false);
    }
  }
  //****************************************************************

  console.log("WebGL version: " + gl.getParameter(gl.VERSION));
  console.log("GLSL version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
  console.log("Vendor: " + gl.getParameter(gl.VENDOR));

  const vs = gl.createShader(gl.VERTEX_SHADER);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();

  const vsSource = `#version 300 es
			precision highp float;
			in vec3 position;
			in vec3 color;
			uniform mat4 model;
			uniform mat4 view;
			uniform mat4 proj;
			out vec3 Color;

			void main(void)
			{
				Color = color;
			   gl_Position = proj * view * model * vec4(position, 1.0);
			}
			`;

  const fsSource = `#version 300 es
		   precision highp float;
		   in vec3 Color;
		   out vec4 frag_color;
		   void main(void)
	   	{
		   	frag_color=vec4(Color, 1.0);
		      //frag_color = vec4(1.0, 0.5, 0.25, 1.0);
	   	}
			`;

  //compilation vs
  gl.shaderSource(vs, vsSource);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vs));
  }

  //compilation fs
  gl.shaderSource(fs, fsSource);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fs));
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  var n_draw = 3;
  cube();

  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 6 * 4, 0);

  const color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
  gl.enable(gl.DEPTH_TEST);


  let yaw =-90;  //rotation around the X axis
  let pitch=0;   //rotation around the Y axis

  function set_camera_mouse(e) {
    //Determine the change in mouse position, relative to the last frame
    let xoffset = e.movementX;
    let yoffset = e.movementY;
    let sensitivity = 0.1;
    var cameraSpeed = 0.05 * elapsedTime;
    xoffset *= sensitivity;
    yoffset *= sensitivity;
    //Update the angles
    yaw += xoffset * cameraSpeed;
    pitch -= yoffset * cameraSpeed;
    //Limitations for the camera
    if (pitch > 89.0) pitch = 89.0;
    if (pitch < -89.0) pitch = -89.0;
    //Euler angles
    let front = glm.vec3(1, 1, 1);
    front.x = Math.cos(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
    front.y = Math.sin(glm.radians(pitch));
    front.z = Math.sin(glm.radians(yaw)) * Math.cos(glm.radians(pitch));
    cameraFront = glm.normalize(front);

  }








  let counter = 0;
  const fpsElem = document.getElementById("fps");
  let startTime = 0;
  let elapsedTime = 0;

  function draw() {
    elapsedTime = performance.now() - startTime;
    startTime = performance.now();
    counter++;
    var cameraSpeed = 0.05 * elapsedTime;
    let fFps = 1000 / elapsedTime;
    // limit the refresh rate of the text to about 1/second
    if (counter > fFps) {
      fpsElem.textContent = fFps.toFixed(1);
      counter = 0;
    }
    
    set_camera();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n_draw);
  window.requestAnimationFrame(draw);

    // setTimeout(() => { requestAnimationFrame(draw);}, 1000 / 50); //fps limiter 
  }
  window.requestAnimationFrame(draw);

  const model = mat4.create();
  const kat_obrotu = (24 * Math.PI) / 180; // in radians
  mat4.rotate(model, model, kat_obrotu, [0, 0, 1]);

  let uniModel = gl.getUniformLocation(program, "model");
  gl.uniformMatrix4fv(uniModel, false, model);

  const view = mat4.create();
  mat4.lookAt(view, [0, 0, 3], [0, 0, -1], [0, 1, 0]);
  let uniView = gl.getUniformLocation(program, "view");
  gl.uniformMatrix4fv(uniView, false, view);

  const proj = mat4.create();
  mat4.perspective(
    proj,
    (60 * Math.PI) / 180,
    canvas.width / canvas.height,
    0.1,
    100
  );
  let uniProj = gl.getUniformLocation(program, "proj");
  gl.uniformMatrix4fv(uniProj, false, proj);

  //   // Add the event listeners for mousedown, mousemove, and mouseup
  //   window.addEventListener("mousedown", (e) => {
  //     x = e.offsetX;
  //     y = e.offsetY;
  //     alert("x =" + x + " y =" + y);
  //   });

  ///



  

  var pressedKey = {};
  window.onkeyup = function (e) {
    pressedKey[e.keyCode] = false;
  };
  window.onkeydown = function (e) {
    pressedKey[e.keyCode] = true;
  };

  let cameraPos = glm.vec3(0, 0, 3);
  let cameraFront = glm.vec3(0, 0, -1);
  let cameraUp = glm.vec3(0, 1, 0);
  let angleOfRotation = 0.0;

  function set_camera() {
    let camera_speed = 0.002*elapsedTime;
    if (pressedKey[37]) {
      //left
      
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x-=cameraPos_tmp.x * camera_speed;
      cameraPos.y-=cameraPos_tmp.y * camera_speed;
      cameraPos.z-=cameraPos_tmp.z * camera_speed;  
    }
    if (pressedKey[38]) {
      //up
      cameraPos.x += camera_speed * cameraFront.x;
      cameraPos.y += camera_speed * cameraFront.y;
      cameraPos.z += camera_speed * cameraFront.z;
      
    }
    if (pressedKey[39]) {
      //right
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x+=cameraPos_tmp.x * camera_speed;
      cameraPos.y+=cameraPos_tmp.y * camera_speed;
      cameraPos.z+=cameraPos_tmp.z * camera_speed; 
    }
    if (pressedKey[40]) {
      //down
      cameraPos.x -= camera_speed * cameraFront.x;
      cameraPos.y -= camera_speed * cameraFront.y;
      cameraPos.z -= camera_speed * cameraFront.z;
    }

    let cameraFront_tmp = glm.vec3(1, 1, 1);
    cameraFront_tmp.x = cameraPos.x + cameraFront.x;
    cameraFront_tmp.y = cameraPos.y + cameraFront.y;
    cameraFront_tmp.z = cameraPos.z + cameraFront.z;

    mat4.lookAt(view, cameraPos, cameraFront_tmp, cameraUp);
    gl.uniformMatrix4fv(uniView, false, view);
  }

  function cube() {
    let punkty_ = 36;

    var vertices = [
      -0.5, -0.5, -0.5, 0.0, 0.0, 0.0, 0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 0.5, 0.5,
      -0.5, 0.0, 1.0, 1.0, 0.5, 0.5, -0.5, 0.0, 1.0, 1.0, -0.5, 0.5, -0.5, 0.0,
      1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 0.0, 0.0,

      -0.5, -0.5, 0.5, 0.0, 0.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 0.5, 0.5,
      0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, -0.5, 0.5, 0.5, 0.0,
      1.0, 0.0, -0.5, -0.5, 0.5, 0.0, 0.0, 0.0,

      -0.5, 0.5, 0.5, 1.0, 0.0, 1.0, -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, -0.5, -0.5,
      -0.5, 0.0, 1.0, 0.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, -0.5, -0.5, 0.5,
      0.0, 0.0, 0.0, -0.5, 0.5, 0.5, 1.0, 0.0, 1.0,

      0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, -0.5,
      -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.5, 0.0,
      0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0,

      -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.5,
      -0.5, 0.5, 1.0, 0.0, 1.0, 0.5, -0.5, 0.5, 1.0, 0.0, 1.0, -0.5, -0.5, 0.5,
      0.0, 0.0, 0.0, -0.5, -0.5, -0.5, 0.0, 1.0, 0.0,

      -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.5, 0.5,
      0.5, 1.0, 0.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, -0.5, 0.5, 0.5, 0.0,
      0.0, 0.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    n_draw = punkty_;
  }
}
