//Drawrectangle.js
function handleDrawOperationEvent(event){
    event.preventDefault();

    var canvas = document.getElementById('example');
    if (!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    //get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    handleDrawEvent(event);

    const x = (parseFloat(document.getElementById("x").value));
    const y = (parseFloat(document.getElementById("y").value));
    const i = (parseFloat(document.getElementById("i").value));
    const j = (parseFloat(document.getElementById("j").value));

    const op = document.getElementById("operation").value;
    const sc = document.getElementById("scalar").value;
    // console.log(sc);
    
    var v1 = new Vector3([x, y, 0.0]);//instantiate a vector v1
    var v2 = new Vector3([i, j, 0.0]);
    var v3;

    if (op == "add"){
        v3 = v1.add(v2);
    }
    else if (op == "subtract"){
        v3 = v1.sub(v2);
    }
    else if (op == "multiply"){
        v3 = v1.mul(sc);
        let v4 = v2.mul(sc);
        drawVector(v4, 'green');
    }
    else if (op == "divide"){
        v3 = v1.div(sc);
        let v4 = v2.div(sc);
        drawVector(v4, 'green');
    }
    else if (op == "magnitude"){
        console.log("Magnitude v1: ", v1.magnitude());
        console.log("Magnitude v2: ", v2.magnitude());
        return
    }
    else if (op == "normalize"){
        v3 = v1.normalize();
        let v4 = v2.normalize();
        drawVector(v4, 'green');
    }
    else if (op == "angleBetween"){
        console.log("Angle: ", Math.acos(Vector3.dot(v1, v2)/(v1.magnitude() * v2.magnitude())) * 180 / Math.PI);
        return
    }
    else if (op == "area"){
        v3 = Vector3.cross(v1, v2);
        let ar = v3.magnitude() / 2;
        console.log("Area of the traingle: ", ar);
        return
    }
    drawVector(v3, 'green');
}

function main(){
    //retrieve canvas element
    var canvas = document.getElementById('example');
    if (!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    //get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');
    //Draw a blue rectangle 
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; //blue color
    ctx.fillRect(0, 0, canvas.width, canvas.height); //fill rectangle with blue color

    var v1 = new Vector3([2.25, 2.25, 0.0]);//instantiate a vector v1

    drawVector(v1, 'red');
}

function drawVector(v, color){
    var canvas = document.getElementById('example');
    if (!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    //get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    var x = v.elements[0] * 20;
    var y = v.elements[1] * 20;
    //Draw line to end point of vector
    ctx.lineTo(200 + x, 200 - y);
    ctx.stroke();
}

function handleDrawEvent(x_and_y){
    event.preventDefault();

    var canvas = document.getElementById('example');
    if (!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    //get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    const x = parseFloat(document.getElementById("x").value);
    const y = parseFloat(document.getElementById("y").value);
    const i = parseFloat(document.getElementById("i").value);
    const j = parseFloat(document.getElementById("j").value);

    var v1 = new Vector3([x, y, 0.0]);//instantiate a vector v1
    var v2 = new Vector3([i, j, 0.0]);
    drawVector(v1, 'red');
    drawVector(v2, 'blue');
}

