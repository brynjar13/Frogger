"use strict";

var gl;

var vPosition;
var rColor;

var stop = false;

// variables for the enemies
var enemy1_pos;
var enemy2_pos;
var enemy3_pos;
var enemy4_pos;
var enemy5_pos;
var enemy1_color = vec4(1.0, 0.0, 0.0, 1.0);  
var enemy2_color = vec4(0.8, 0.0, 0.7, 1.0);  
var enemy3_color = vec4(0.6, 0.3, 0.0, 1.0);  
var enemy4_color = vec4(0.6, 0.5, 0.1, 1.0);  
var enemy5_color = vec4(0.6, 0.3, 0.8, 1.0);  
var enemy1_speed = Math.random() * 0.02 + 0.01;
var enemy2_speed = Math.random() * 0.02 + 0.01;
var enemy3_speed = Math.random() * 0.02 + 0.01;
var enemy4_speed = Math.random() * 0.02 + 0.01;
var enemy5_speed = Math.random() * 0.02 + 0.01;
var enemy1_dir = 1;
var enemy2_dir = -1;
var enemy3_dir = 1;
var enemy4_dir = -1;
var enemy5_dir = 1;

var frog_pos;
var frog_cur_dir = "UP";

var frog_buffer;
var street_buffer;
var enemy1_buffer;
var enemy2_buffer;
var enemy3_buffer;
var enemy4_buffer;
var enemy5_buffer;

var street_color = vec4(0.0, 0.0, 0.0, 1.0);
var frog_color = vec4(0.0, 1.0, 0.0, 1.0);

window.onload = function init() {
    var canvas = document.getElementById("gameCanvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        console.log("WebGL is not enabled in your browser");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    var program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // vinstri, toppur, hægri

    var frog_vertices = [
        vec2(-0.1, -1.0),
        vec2(0.0, -0.8),
        vec2(0.1, -1.0)
    ];

    var street_vertices = [
        vec2(-1.0, 0.6),
        vec2(1.0, 0.6),
        vec2(1.0, -0.4),
        vec2(-1.0, -0.4)
    ]

    var enemy1_vertices = [
        vec2(-1.0, 0.6),
        vec2(-0.6, 0.6),
        vec2(-0.6, 0.4),
        vec2(-1.0, 0.4)
    ];

    var enemy2_vertices = [
        vec2(0.6, 0.4),
        vec2(1.0, 0.4),
        vec2(1.0, 0.2),
        vec2(0.6, 0.2)
    ];

    var enemy3_vertices = [
        vec2(-1.0, 0.2),
        vec2(-0.6, 0.2),
        vec2(-0.6, -0.0),
        vec2(-1.0, -0.0)
    ];

    var enemy4_vertices = [
        vec2(0.6, 0.0),
        vec2(1.0, 0.0),
        vec2(1.0, -0.2),
        vec2(0.6, -0.2)
    ];

    var enemy5_vertices = [
        vec2(-1.0, -0.2),
        vec2(-0.6, -0.2),
        vec2(-0.6, -0.4),
        vec2(-1.0, -0.4)
    ];


    frog_pos = frog_vertices;
    enemy1_pos = enemy1_vertices;
    enemy2_pos = enemy2_vertices;
    enemy3_pos = enemy3_vertices;
    enemy4_pos = enemy4_vertices;
    enemy5_pos = enemy5_vertices;

    frog_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, frog_buffer);

    street_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, street_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(street_vertices), gl.STATIC_DRAW);

    enemy1_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy1_buffer);

    enemy2_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy2_buffer);

    enemy3_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy3_buffer);

    enemy4_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy4_buffer);

    enemy5_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy5_buffer);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray( vPosition );

    rColor = gl.getUniformLocation(program, "rcolor");

    document.addEventListener("keydown", handleMovement);
    document.addEventListener("keydown", restartGame);


    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, street_buffer);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( rColor, flatten(street_color) );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if (enemy1_pos[0][0] > 1.0 && enemy1_pos[3][0] > 1.0) {
        enemy1_dir = -1;
    }
    if (enemy1_pos[1][0] < -1.0 && enemy1_pos[2][0] < -1.0) {
        enemy1_dir = 1;
    }
    moveEnemy(enemy1_pos, enemy1_speed, enemy1_dir);
    checkCollisionWithPlayer(enemy1_pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy1_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy1_pos), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(rColor, flatten(enemy1_color));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if (enemy2_pos[0][0] > 1.0 && enemy2_pos[3][0] > 1.0) {
        enemy2_dir = -1;
    }
    if (enemy2_pos[1][0] < -1.0 && enemy2_pos[2][0] < -1.0) {
        enemy2_dir = 1;
    }
    moveEnemy(enemy2_pos, enemy2_speed, enemy2_dir);
    checkCollisionWithPlayer(enemy2_pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy2_pos), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(rColor, flatten(enemy2_color));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if (enemy3_pos[0][0] > 1.0 && enemy3_pos[3][0] > 1.0) {
        enemy3_dir = -1;
    }
    if (enemy3_pos[1][0] < -1.0 && enemy3_pos[2][0] < -1.0) {
        enemy3_dir = 1;
    }
    moveEnemy(enemy3_pos, enemy3_speed, enemy3_dir);
    checkCollisionWithPlayer(enemy3_pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy3_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy3_pos), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(rColor, flatten(enemy3_color));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if (enemy4_pos[0][0] > 1.0 && enemy4_pos[3][0] > 1.0) {
        enemy4_dir = -1;
    }
    if (enemy4_pos[1][0] < -1.0 && enemy4_pos[2][0] < -1.0) {
        enemy4_dir = 1;
    }
    moveEnemy(enemy4_pos, enemy4_speed, enemy4_dir);
    checkCollisionWithPlayer(enemy4_pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy4_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy4_pos), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(rColor, flatten(enemy4_color));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if (enemy5_pos[0][0] > 1.0 && enemy5_pos[3][0] > 1.0) {
        enemy5_dir = -1;
    }
    if (enemy5_pos[1][0] < -1.0 && enemy5_pos[2][0] < -1.0) {
        enemy5_dir = 1;
    }
    moveEnemy(enemy5_pos, enemy5_speed, enemy5_dir);
    checkCollisionWithPlayer(enemy5_pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, enemy5_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy5_pos), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(rColor, flatten(enemy5_color));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, frog_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(frog_pos), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( rColor, flatten(frog_color) );
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!stop) {
        window.requestAnimationFrame(render);
    }
}

function handleMovement(event) {
    switch(event.key) {
        case "ArrowUp":
            if (frog_cur_dir !== "UP") {
                flip();
            } 
            if (frog_pos[1][1] + 0.2 > 1.0) {
                return;
            }
            frog_pos[0][1] = frog_pos[0][1] + 0.2;
            frog_pos[1][1] = frog_pos[1][1] + 0.2;
            frog_pos[2][1] = frog_pos[2][1] + 0.2;
            roundVertices(frog_pos);
            break;
        case "ArrowDown":
            if (frog_cur_dir !== "DOWN") {
                flip();
            }
            if (frog_pos[1][1] - 0.2 < -1.0) {
                return;
            }
            frog_pos[0][1] = frog_pos[0][1] - 0.2;
            frog_pos[1][1] = frog_pos[1][1] - 0.2;
            frog_pos[2][1] = frog_pos[2][1] - 0.2;
            roundVertices(frog_pos);
            break;
        case "ArrowRight":
            if (frog_pos[0][0] + 0.2 > 1.0 || frog_pos[2][0] + 0.2 > 1.0) {
                return;
            } 
            frog_pos[0][0] = frog_pos[0][0] + 0.2;
            frog_pos[1][0] = frog_pos[1][0] + 0.2;
            frog_pos[2][0] = frog_pos[2][0] + 0.2;
            break;
        case "ArrowLeft":
            if (frog_pos[0][0] - 0.2 < -1.0 || frog_pos[2][0] - 0.2 < -1.0) {
                return;
            } 
            frog_pos[0][0] = frog_pos[0][0] - 0.2;
            frog_pos[1][0] = frog_pos[1][0] - 0.2;
            frog_pos[2][0] = frog_pos[2][0] - 0.2;
            break;
        default:
            break;
    }
}

function flip() {
    if (frog_cur_dir === "UP") {
        let top = frog_pos[1][1];
        let bottom = frog_pos[0][1];
        frog_pos[1][1] = bottom;
        frog_pos[0][1] = top;
        frog_pos[2][1] = top;
        frog_cur_dir = "DOWN";
    } else {
        let bottom = frog_pos[1][1];
        let top = frog_pos[0][1];
        frog_pos[1][1] = top;
        frog_pos[0][1] = bottom;
        frog_pos[2][1] = bottom;
        frog_cur_dir = "UP";
    }
}

function get_enemy_dir(enemy_pos) {
    var dir = 1;
    if (enemy_pos[0][0] > 1.0 && enemy_pos[3][0] > 1.0) {
        dir = -1;
    }
    if (enemy_pos[0][0] < -1.0 && enemy_pos[3][0] < -1.0) {
        dir = 1;
    }
    return dir;
}

function moveEnemy(enemy_pos, speed, dir) {
    enemy_pos[0][0] += speed * dir;
    enemy_pos[1][0] += speed * dir;
    enemy_pos[2][0] += speed * dir;
    enemy_pos[3][0] += speed * dir;
}

function checkCollisionWithPlayer(enemy_pos) {
    if (frog_cur_dir == "UP") {
        if (enemy_pos[2][1] === frog_pos[0][1] && (frog_pos[0][0] > enemy_pos[0][0] && frog_pos[0][0] < enemy_pos[1][0])) {
            stop = true;
        }
    } else {
        if (enemy_pos[0][1] === frog_pos[0][1] && (frog_pos[0][0] > enemy_pos[0][0] && frog_pos[0][0] < enemy_pos[1][0])) {
            stop = true;
        }
    }
}

function roundVertices(vertices) {
    for (let i = 0; i < vertices.length; i++) {
        vertices[i][1] = parseFloat(vertices[i][1].toFixed(2)); // Round to 2 decimal places
    }
}

function restartGame(event) {
    if (event.key === "Enter" && stop) {
        // Reset the game state
        stop = false;
        frog_cur_dir = "UP";
        enemy1_speed = Math.random() * 0.02 + 0.01;
        enemy2_speed = Math.random() * 0.02 + 0.01;
        enemy3_speed = Math.random() * 0.02 + 0.01;
        enemy4_speed = Math.random() * 0.02 + 0.01;
        enemy5_speed = Math.random() * 0.02 + 0.01;

        var frog_vertices = [
            vec2(-0.1, -1.0),
            vec2(0.0, -0.8),
            vec2(0.1, -1.0)
        ];

        var enemy1_vertices = [
            vec2(-1.0, 0.6),
            vec2(-0.6, 0.6),
            vec2(-0.6, 0.4),
            vec2(-1.0, 0.4)
        ];
    
        var enemy2_vertices = [
            vec2(0.6, 0.4),
            vec2(1.0, 0.4),
            vec2(1.0, 0.2),
            vec2(0.6, 0.2)
        ];
    
        var enemy3_vertices = [
            vec2(-1.0, 0.2),
            vec2(-0.6, 0.2),
            vec2(-0.6, -0.0),
            vec2(-1.0, -0.0)
        ];

        frog_pos = frog_vertices;
        enemy1_pos = enemy1_vertices;
        enemy2_pos = enemy2_vertices;
        enemy3_pos = enemy3_vertices;

        // Re-bind the buffers with updated data
        gl.bindBuffer(gl.ARRAY_BUFFER, frog_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(frog_pos), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, enemy1_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy1_pos), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, enemy2_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy2_pos), gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, enemy3_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(enemy3_pos), gl.DYNAMIC_DRAW);

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Call the render function to restart the game loop
        render();
    }
}