let buffers = [];
let pointsArray = [];
let textures = [];
let objectNumber = 0; // Automatically incremented for each object
const predefinedTextures = [
  "https://images.unsplash.com/photo-1531685250784-7569952593d2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673649934365-6bcbe97ffe77?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1585747889842-2990e19cd7ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1519606247872-0440aae9b827?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://cdn.eso.org/images/publicationjpg/2018_04_24_ES_Supernova_VT_Outside-CC.jpg",
];

async function loadFile(file) {
  const text = await file.text();
  const arrayCopy = text.replaceAll('/', ' ').replaceAll('\n', ' ').split(' ');

  const vertices = [[]];
  let licz_vertices = 0;
  const normals = [[]];
  let licz_normals = 0;
  const coords = [[]];
  let licz_coords = 0;
  const triangles = [];
  let licz_triangles = 0;

  for (let i = 0; i < arrayCopy.length - 1; i++) {
    if (arrayCopy[i] === 'v') {
      vertices.push([]);
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 1]));
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 2]));
      vertices[licz_vertices].push(parseFloat(arrayCopy[i + 3]));
      i += 3;
      licz_vertices++;
    }

    if (arrayCopy[i] === 'vn') {
      normals.push([]);
      normals[licz_normals].push(parseFloat(arrayCopy[i + 1]));
      normals[licz_normals].push(parseFloat(arrayCopy[i + 2]));
      normals[licz_normals].push(parseFloat(arrayCopy[i + 3]));
      i += 3;
      licz_normals++;
    }

    if (arrayCopy[i] === 'vt') {
      coords.push([]);
      coords[licz_coords].push(parseFloat(arrayCopy[i + 1]));
      coords[licz_coords].push(parseFloat(arrayCopy[i + 2]));
      i += 2;
      licz_coords++;
    }

    if (arrayCopy[i] === 'f') {
      triangles.push([]);
      for (let j = 1; j <= 9; j++) {
        triangles[licz_triangles].push(parseFloat(arrayCopy[i + j]));
      }
      i += 9;
      licz_triangles++;
    }
  }

  let vert_array = [];
  for (let i = 0; i < triangles.length; i++) {
    vert_array.push(vertices[triangles[i][0] - 1][0]);
    vert_array.push(vertices[triangles[i][0] - 1][1]);
    vert_array.push(vertices[triangles[i][0] - 1][2]);
    vert_array.push(normals[triangles[i][2] - 1][0]);
    vert_array.push(normals[triangles[i][2] - 1][1]);
    vert_array.push(normals[triangles[i][2] - 1][2]);
    vert_array.push(coords[triangles[i][1] - 1][0]);
    vert_array.push(coords[triangles[i][1] - 1][1]);

    vert_array.push(vertices[triangles[i][3] - 1][0]);
    vert_array.push(vertices[triangles[i][3] - 1][1]);
    vert_array.push(vertices[triangles[i][3] - 1][2]);
    vert_array.push(normals[triangles[i][5] - 1][0]);
    vert_array.push(normals[triangles[i][5] - 1][1]);
    vert_array.push(normals[triangles[i][5] - 1][2]);
    vert_array.push(coords[triangles[i][4] - 1][0]);
    vert_array.push(coords[triangles[i][4] - 1][1]);

    vert_array.push(vertices[triangles[i][6] - 1][0]);
    vert_array.push(vertices[triangles[i][6] - 1][1]);
    vert_array.push(vertices[triangles[i][6] - 1][2]);
    vert_array.push(normals[triangles[i][8] - 1][0]);
    vert_array.push(normals[triangles[i][8] - 1][1]);
    vert_array.push(normals[triangles[i][8] - 1][2]);
    vert_array.push(coords[triangles[i][7] - 1][0]);
    vert_array.push(coords[triangles[i][7] - 1][1]);
  }

  // Create and bind buffer
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert_array), gl.STATIC_DRAW);

  buffers[objectNumber] = buffer;
  pointsArray[objectNumber] = triangles.length * 3;

  // Load texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Flip the texture vertically
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  image.crossOrigin = "";
  image.src = predefinedTextures[objectNumber % predefinedTextures.length];

  textures[objectNumber] = texture;

  objectNumber++; // Increment object number for the next call
}



let points=32;

let gl;




function start() {
  const canvas = document.getElementById("my_canvas");
  //Inicialize the GL contex
  gl = canvas.getContext("webgl2");
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
      in vec2 aTexCoord;
      out vec2 TexCoord;
			out vec3 Color;

			void main(void)
			{
        TexCoord = aTexCoord;
				Color = color;
			  gl_Position = proj * view * model * vec4(position, 1.0);
			}
			`;

  const fsSource = `#version 300 es
		   precision highp float;
		   in vec3 Color;
       in vec2 TexCoord;
		   out vec4 frag_color;
       uniform sampler2D texture1;
       uniform sampler2D texture2;
		   void main(void)
	   	{
          //frag_color = mix(texture(texture1, TexCoord), texture(texture2, TexCoord), 0.5);
          frag_color = texture(texture1, TexCoord);
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
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 8 * 4, 0);

  const color = gl.getAttribLocation(program, "color");
  gl.enableVertexAttribArray(color);
  gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 8 * 4, 3 * 4);

  const texCoord = gl.getAttribLocation(program, "aTexCoord");
  gl.enableVertexAttribArray(texCoord);
  gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8 * 4, 6 * 4);

  gl.enable(gl.DEPTH_TEST);

  let yaw = -90; //rotation around the X axis
  let pitch = 0; //rotation around the Y axis

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

 




  
  gl.uniform1i(gl.getUniformLocation(program, "texture1"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "texture2"), 1);

  let counter = 0;
  const fpsElem = document.getElementById("fps");
  let startTime = 0;
  let elapsedTime = 0;


 // Load objects



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

    // Draw all models
    for (let i = 0; i < buffers.length; i++) {
      drawModel(i);
    }

    window.requestAnimationFrame(draw);


    
  }
  window.requestAnimationFrame(draw);

  const model = mat4.create();
  const kat_obrotu = (0 * Math.PI) / 180; // in radians
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
    let camera_speed = 0.002 * elapsedTime;
    if (pressedKey[37]|| pressedKey[65]) {
      //left

      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x -= cameraPos_tmp.x * camera_speed;
      cameraPos.y -= cameraPos_tmp.y * camera_speed;
      cameraPos.z -= cameraPos_tmp.z * camera_speed;
    }
    if (pressedKey[38]|| pressedKey[87]) {
      //up
      cameraPos.x += camera_speed * cameraFront.x;
      cameraPos.y += camera_speed * cameraFront.y;
      cameraPos.z += camera_speed * cameraFront.z;
    }
    if (pressedKey[39]|| pressedKey[68]) {
      //right
      let cameraPos_tmp = glm.normalize(glm.cross(cameraFront, cameraUp));
      cameraPos.x += cameraPos_tmp.x * camera_speed;
      cameraPos.y += cameraPos_tmp.y * camera_speed;
      cameraPos.z += cameraPos_tmp.z * camera_speed;
    }
    if (pressedKey[40]|| pressedKey[83]) {
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
      // Front face
      -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,  0.0, 0.0, 
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 0.0, 
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0, 
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0, 
      -0.5,  0.5,  0.5,  1.0, 1.0, 0.0,  0.0, 1.0, 
      -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,  0.0, 0.0,
    
      // Back face
      -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0, 
       0.5, -0.5, -0.5,  0.0, 0.0, 1.0,  1.0, 0.0, 
       0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  1.0, 1.0, 
       0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  1.0, 1.0, 
      -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 1.0, 
      -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
    
      // Left face
      -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0, 
      -0.5, -0.5,  0.5,  0.0, 0.0, 1.0,  1.0, 0.0, 
      -0.5,  0.5,  0.5,  0.0, 1.0, 1.0,  1.0, 1.0, 
      -0.5,  0.5,  0.5,  0.0, 1.0, 1.0,  1.0, 1.0, 
      -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 1.0, 
      -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0,
    
      // Right face
       0.5, -0.5, -0.5,  1.0, 0.0, 0.0,  0.0, 0.0, 
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 0.0, 
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0, 
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0, 
       0.5,  0.5, -0.5,  1.0, 1.0, 0.0,  0.0, 1.0, 
       0.5, -0.5, -0.5,  1.0, 0.0, 0.0,  0.0, 0.0,
    
      // Top face
      -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0, 
       0.5,  0.5, -0.5,  1.0, 1.0, 0.0,  1.0, 0.0, 
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0, 
       0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  1.0, 1.0, 
      -0.5,  0.5,  0.5,  0.0, 1.0, 1.0,  0.0, 1.0, 
      -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  0.0, 0.0,
    
      // Bottom face
      -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0, 
       0.5, -0.5, -0.5,  1.0, 0.0, 0.0,  1.0, 0.0, 
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0, 
       0.5, -0.5,  0.5,  1.0, 0.0, 1.0,  1.0, 1.0, 
      -0.5, -0.5,  0.5,  0.0, 0.0, 1.0,  0.0, 1.0, 
      -0.5, -0.5, -0.5,  0.0, 0.0, 0.0,  0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    n_draw = punkty_;
  }
  // Drawing function
  function drawModel(objectNumber) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[objectNumber]);
    VerticesData();
    gl.bindTexture(gl.TEXTURE_2D, textures[objectNumber]);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray[objectNumber]);
  }

  function VerticesData() {
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 8 * 4, 0);

    const color = gl.getAttribLocation(program, "color");
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 8 * 4, 3 * 4);

    const texCoord = gl.getAttribLocation(program, "aTexCoord");
    gl.enableVertexAttribArray(texCoord);
    gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
  }
}
