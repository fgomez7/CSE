class Cube{
    constructor(){
        this.type='cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = -2;
        this.g_vertexBuffer = null;
        this.g_uvBuffer = null;
        this.animalPart = true;

        this.cubeVerts32 = [
            0,0,0, 1,1,0, 1,0,0,
            0,0,0, 0,1,0, 1,1,0,
            0,1,0, 1,1,1, 1,1,0,
            0,1,0, 0,1,1, 1,1,1,
            0,0,0, 0,1,0, 0,1,1,
            0,0,0, 0,1,1, 0,0,1,
            0,0,0, 1,0,0, 1,0,1,
            0,0,0, 1,0,1, 0,0,1,
            1,0,0, 1,1,0, 1,1,1,
            1,0,0, 1,1,1, 1,0,1,
            0,0,1, 1,0,1, 1,1,1,
            0,0,1, 1,1,1, 0,1,1
        ]

        this.cubeUV = [
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,
            1,0, 1,1, 0,1,
            1,0, 0,1, 0,0,
            0,0, 1,0, 1,1,
            0,0, 1,1, 0,1,
            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,
            1,0, 0,0, 0,1,
            1,0, 0,1, 1,1
        ]

        this.vertices32 = new Float32Array(this.cubeVerts32);
        this.uv32 = new Float32Array(this.cubeUV);
    }

    // render() {
    //     var rgba = this.color;

    //     gl.uniform1i(u_whichTexture, this.textureNum);
    
    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //     //pass the matrix to u_modelmatrix attribute
    //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    //     //00 is blue    10 is magenta   11 is white     01 is skyblue
    //     drawTriangle3DUV([0, 0, 0,   1, 1, 0,   1, 0, 0], [0,0, 1,1, 1,0]);
    //     drawTriangle3DUV([0, 0, 0,   0, 1, 0,   1, 1, 0], [0,0, 0,1, 1,1]);
    //     // drawTriangle3d( [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
    //     // drawTriangle3d( [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);//front side

    //     gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    //     drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0],[0,0, 1,1, 1,0]);
    //     drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1],[0,0, 0,1, 1,1]);
    //     // drawTriangle3d( [0, 1, 0, 0, 1, 1, 1, 1, 1]);//top side
    //     // drawTriangle3d( [0, 1, 0, 1, 1, 1, 1, 1, 0]);

    //     drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [1,0, 1,1, 0,1]);
    //     drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [1,0, 0,1, 0,0]);
    //     // // drawTriangle3d( [0, 0, 0, 0, 1, 0, 0, 1, 1]);
    //     // // drawTriangle3d( [0, 0, 0, 0, 1, 1, 0, 0, 1]); //left side

    //     drawTriangle3DUV([0,0,0, 1,0,0, 1,0,1], [0,0, 1,0, 1,1]);
    //     drawTriangle3DUV([0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 0,1]);
    //     // // drawTriangle3d( [0, 0, 0, 1, 0, 0, 1, 0, 1]); //bottom face
    //     // // drawTriangle3d( [0, 0, 0, 1, 0, 1, 0, 0, 1]);

    //     drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1],[0,0, 0,1, 1,1]);
    //     drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
    //     // // drawTriangle3d( [1, 0, 0, 1, 1, 0, 1, 1, 1]);
    //     // // drawTriangle3d( [1, 0, 0, 1, 1, 1, 1, 0, 1]);//right side 

    //     // // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
    //     drawTriangle3DUV([0,0,1, 1,0,1, 1,1,1], [1,0, 0,0, 0,1]);
    //     drawTriangle3DUV([0,0,1, 1,1,1, 0,1,1], [1,0, 0,1, 1,1]);
    //     // // drawTriangle3d( [0, 0, 1, 1, 0, 1, 1, 1, 1]);
    //     // // drawTriangle3d( [0, 0, 1, 1, 1, 1, 0, 1, 1]);//backside
    // }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
    
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //pass the matrix to u_modelmatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        if (!this.animalPart){
            this.normalMatrix.setInverseOf(this.matrix).transpose();
        }
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        //FRONT SIDE
        drawTriangle3dUVNormal( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1] );
        drawTriangle3dUVNormal( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1] );
    
        //00 is blue    10 is magenta   11 is white     01 is skyblue
        //TOP SIDE
        // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        drawTriangle3dUVNormal( [0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0] );
        drawTriangle3dUVNormal( [0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0] );

        //RIGHT SIDE
        // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);
        drawTriangle3dUVNormal([1,1,0, 1,1,1, 1,0,0], [0,1, 1,1, 0,0], [1,0,0, 1,0,0, 1,0,0] );
        drawTriangle3dUVNormal([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0] );
        
        //LEFT SIDE
        // gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);
        drawTriangle3dUVNormal( [0,1,0, 0,1,1, 0,0,0], [1,1, 0,1, 1,0], [-1,0,0, -1,0,0, -1,0,0] );
        drawTriangle3dUVNormal( [0,0,0, 0,1,1, 0,0,1], [1,0, 0,1, 0,0], [-1,0,0, -1,0,0, -1,0,0] );

        //BOTTOM FACE
        // gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);
        drawTriangle3dUVNormal([0,0,0, 1,0,1, 1,0,0], [0,1, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0] );
        drawTriangle3dUVNormal([0,0,0, 0,0,1, 1,0,1], [0,1, 0,0, 1,0], [0,-1,0, 0,-1,0, 0,-1,0] );


        //BACK SIDE
        // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
        drawTriangle3dUVNormal([0,0,1, 1,0,1, 1,1,1], [1,0, 0,0, 0,1], [0,0,1, 0,0,1, 0,0,1] );
        drawTriangle3dUVNormal([0,0,1, 1,1,1, 0,1,1], [1,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1] );
    }

    renderfaster() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
    
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        //pass the matrix to u_modelmatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allvertices = [];  
        var allUVcoordiantes = [];
        allvertices = allvertices.concat([0,0,0, 1,1,0, 1,0,0]);
        allvertices = allvertices.concat([0,0,0, 0,1,0, 1,1,0]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 1,1, 1,0]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 0,1, 1,1]);
        //00 is blue    10 is magenta   11 is white     01 is skyblue
        // drawTriangle3DUV([0, 0, 0,   1, 1, 0,   1, 0, 0], [0,0, 1,1, 1,0]);
        // drawTriangle3DUV([0, 0, 0,   0, 1, 0,   1, 1, 0], [0,0, 0,1, 1,1]);
        // drawTriangle3d( [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
        // drawTriangle3d( [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);//front side

        // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
        allvertices = allvertices.concat([0,1,0, 1,1,1, 1,1,0]);
        allvertices = allvertices.concat([0,1,0, 0,1,1, 1,1,1]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 1,1, 1,0]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 0,1, 1,1]);
        // drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0],[0,0, 1,1, 1,0]);
        // drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1],[0,0, 0,1, 1,1]);
        // drawTriangle3d( [0, 1, 0, 0, 1, 1, 1, 1, 1]);//top side
        // drawTriangle3d( [0, 1, 0, 1, 1, 1, 1, 1, 0]);

        allvertices = allvertices.concat([0,0,0, 0,1,0, 0,1,1]);
        allvertices = allvertices.concat([0,0,0, 0,1,1, 0,0,1]);
        allUVcoordiantes = allUVcoordiantes.concat([1,0, 1,1, 0,1]);
        allUVcoordiantes = allUVcoordiantes.concat([1,0, 0,1, 0,0]);
        // drawTriangle3DUV([0,0,0, 0,1,0, 0,1,1], [1,0, 1,1, 0,1]);
        // drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [1,0, 0,1, 0,0]);
        // // drawTriangle3d( [0, 0, 0, 0, 1, 0, 0, 1, 1]);
        // // drawTriangle3d( [0, 0, 0, 0, 1, 1, 0, 0, 1]); //left side

        allvertices = allvertices.concat([0,0,0, 1,0,0, 1,0,1]);
        allvertices = allvertices.concat([0,0,0, 1,0,1, 0,0,1]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 1,0, 1,1]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 1,1, 0,1]);
        // drawTriangle3DUV([0,0,0, 1,0,0, 1,0,1], [0,0, 1,0, 1,1]);
        // drawTriangle3DUV([0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 0,1]);
        // // drawTriangle3d( [0, 0, 0, 1, 0, 0, 1, 0, 1]); //bottom face
        // // drawTriangle3d( [0, 0, 0, 1, 0, 1, 0, 0, 1]);

        allvertices = allvertices.concat([1,0,0, 1,1,0, 1,1,1]);
        allvertices = allvertices.concat([1,0,0, 1,1,1, 1,0,1]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 0,1, 1,1]);
        allUVcoordiantes = allUVcoordiantes.concat([0,0, 1,1, 1,0]);
        // drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1],[0,0, 0,1, 1,1]);
        // drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);
        // // drawTriangle3d( [1, 0, 0, 1, 1, 0, 1, 1, 1]);
        // // drawTriangle3d( [1, 0, 0, 1, 1, 1, 1, 0, 1]);//right side 

        allvertices = allvertices.concat([0,0,1, 1,0,1, 1,1,1]);
        allvertices = allvertices.concat([0,0,1, 1,1,1, 0,1,1]);
        allUVcoordiantes = allUVcoordiantes.concat([1,0, 0,0, 0,1]);
        allUVcoordiantes = allUVcoordiantes.concat([1,0, 0,1, 1,1]);
        // // gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);
        // drawTriangle3DUV([0,0,1, 1,0,1, 1,1,1], [1,0, 0,0, 0,1]);
        // drawTriangle3DUV([0,0,1, 1,1,1, 0,1,1], [1,0, 0,1, 1,1]);
        // // drawTriangle3d( [0, 0, 1, 1, 0, 1, 1, 1, 1]);
        // // drawTriangle3d( [0, 0, 1, 1, 1, 1, 0, 1, 1]);//backside
        // drawTriangle3DUV(allvertices, allUVcoordiantes);
        drawTriangle3DUV(this.cubeVerts32, this.cubeUV);
    }

    renderfasterV2(){
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (this.g_vertexBuffer == null){
            this.g_vertexBuffer = gl.createBuffer();
            if (!this.g_vertexBuffer){
                console.log('Failed to create the buffer object');
                return -1;
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.g_vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices32, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        
        if (this.g_uvBuffer == null){
            this.g_uvBuffer = gl.createBuffer();
            if (!this.g_uvBuffer){
                console.log('Failed to create buffer object');
                return -1;
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.g_uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uv32, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_UV);


        gl.drawArrays(gl.TRIANGLES, 0, 36);
        
    }


}
