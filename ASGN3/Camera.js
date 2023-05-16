class Camera{
    constructor(){
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
        this.tempVar = new Vector3();
    }

    forward(){
        // var f = this.at.sub(this.eye);
        // f = f.normalize();
        // f = f.mul(.1);
        // this.at = this.at.add(f);
        // this.eye = this.eye.add(f);

        this.tempVar.set(this.at);
        this.tempVar.sub(this.eye);
        this.tempVar.normalize();
        this.tempVar.mul(.1);
        this.at.add(this.tempVar);
        this.eye.add(this.tempVar);
    }

    backward(){
        this.tempVar.set(this.at);
        this.tempVar.sub(this.eye);
        this.tempVar.normalize();
        this.tempVar.mul(.1);
        this.at.sub(this.tempVar);
        this.eye.sub(this.tempVar);
    }

    left(){
        this.tempVar.set(this.at);
        this.tempVar.sub(this.eye);
        this.tempVar.normalize();
        let left = Vector3.cross(this.up, this.tempVar);
        left.normalize();
        left.mul(.1);
        this.at.add(left);
        this.eye.add(left);
    }

    right(){
        this.tempVar.set(this.at);
        this.tempVar.sub(this.eye);
        this.tempVar.normalize();
        let right = Vector3.cross(this.up, this.tempVar);
        right.normalize();
        right.mul(.1);
        this.at.sub(right);
        this.eye.sub(right);
    }

    panLeft(){
        // this.tempVar.set(this.at);
        // this.tempVar.sub(this.eye);
        // this.tempVar.normalize();

        // let rotationSpeed = 0.1;

        // // Rotate the 'at' position to the left
        // let cosTheta = Math.cos(rotationSpeed);
        // let sinTheta = Math.sin(rotationSpeed);
        // let newAtX = cosTheta * this.at.x - sinTheta * this.at.z;
        // let newAtZ = sinTheta * this.at.x + cosTheta * this.at.z;
        // this.at.x = newAtX;
        // this.at.z = newAtZ;

        // // Rotate the 'up' vector to the left
        // let newUpX = cosTheta * this.up.x - sinTheta * this.up.z;
        // let newUpZ = sinTheta * this.up.x + cosTheta * this.up.z;
        // this.up.x = newUpX;
        // this.up.z = newUpZ;
        this.tempVar.set(this.at);
        this.tempVar.sub(this.eye);

        let leftpan = new Matrix4();
        leftpan.setRotate(3, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.tempVar = leftpan.multiplyVector3(this.tempVar);
        this.at.set(this.eye);
        this.at.add(this.tempVar);
    }

    panRight(){
        this.tempVar.set(this.at);
        this.tempVar.sub(this.eye);

        let rightpan = new Matrix4();
        rightpan.setRotate(-3, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.tempVar = rightpan.multiplyVector3(this.tempVar);
        this.at.set(this.eye);
        this.at.add(this.tempVar);
    }

    requestCamCoor(){
        // return([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
        return([this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]]);
        // return(this.at.elements);
    }

}