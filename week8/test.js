let buffers = [];
let pointsArray = [];
let textures = [];

async function loadFile(file, objectNumber, textureSrc) {
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
  image.src = textureSrc;

  textures[objectNumber] = texture;
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

// Example usage in the `start` function
function start() {
  // ...existing code...

  // Load objects
  loadFile(file1, 0, "texture1.png");
  loadFile(file2, 1, "texture2.png");
  loadFile(file3, 2, "texture3.png");

  function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all models
    for (let i = 0; i < buffers.length; i++) {
      drawModel(i);
    }

    window.requestAnimationFrame(draw);
  }

  window.requestAnimationFrame(draw);
}