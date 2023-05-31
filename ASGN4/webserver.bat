python -m http.server




var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {
    // gl_FragColor = u_FragColor;
    // gl_FragColor = vec4(v_UV, 1.0, 1.0);
    // gl_FragColor = texture2D(u_Sampler0, v_UV);

    if (u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal + 1.0)/2.0, 1.0); //set the color to whatever the normal i 
    }
    else if (u_whichTexture == -2){              // use color
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1){       // use uv debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0){        // use texture 0
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } 
    else if (u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else{                                 // error, put redish
      gl_FragColor = vec4(1,.2,.2,1);
    }

    // vec3 lightVector = vec3(v_VertPos) - u_lightPos;
    // float r = length(lightVector);
    // // if (r < 1.0){
    // //   gl_FragColor = vec4(1,0,0,1);
    // // } else if (r < 2.0) {
    // //   gl_FragColor = vec4(0,1,0,1);
    // // }
    // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);

    float nDotL = max(dot(N,L), 0.0);

    //Reflection
    vec3 R = reflect(-L, N);

    //eye 
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    //specular
    // float specular = pow(max(dot(E,R), 0.0), 10.0) * 0.7;
    // vec3 specular1 = vec3(gl_FragColor.rgb) * specular;

    // vec3 specular = vec3(0.0);

    // float specularStrength = pow(max(dot(E, R), 0.0), 64.0) * 0.7;

    // specular += specularStrength * vec3(1.0, 1.0, 1.0);

    float specularStrength = pow(max(dot(E, reflect(-L, N)), 0.0), 64.0);
    vec3 specular = specularStrength * vec3(1.0, 1.0, 1.0) * 0.7;

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    // vec3 diffuse = vec3(1.0, 1.0, 0.9) * vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.2;
    // gl_FragColor = vec4(specular + vec3(gl_FragColor), 1.0);
    // gl_FragColor = vec4(specular + diffuse, 1.0);
    gl_FragColor = vec4(specular + ambient, 1.0);

    if (u_lightOn){
      if (u_whichTexture == 0){
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      }else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }

  }`