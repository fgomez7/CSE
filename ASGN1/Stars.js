class Star{
    constructor(){
        this.type='star';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 7;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        var segments = this.segments;

        //pass the color of a point to u_fragcolor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        var d = size/200.0;

        let angleStep=360/segments;
        for(var angle = 0; angle < 360; angle=angle+angleStep){
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
            let pt1 = [centerPt[0] + vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1]+vec2[1]];
            
            //calculate positions of the second set of triangles
            let pt3 = [centerPt[0] - vec2[0], centerPt[1] - vec2[1]]; 
            let pt4 = [centerPt[0] - vec1[0], centerPt[1] - vec1[1]];

            let pt5 = [(centerPt[0] + vec1[0] + vec2[0]) * 2, (centerPt[1] + vec1[1] + vec2[1]) * 2];

            // drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
            // drawTriangle([pt3[0], pt3[1], pt2[0], pt2[1], pt4[0], pt4[1]]);
            // drawTriangle( [pt3[0], pt3[1], pt1[0], pt1[1], pt2[0], pt2[1]]); // draw the second set of triangles
            drawTriangle( [pt5[0], pt5[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
        }
    }
}
