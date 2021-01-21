import { UIScene } from "../../ui/UIScene";

export class ShaderChunk {
  vertSource: string;
  fragSource: string;
  constructor(scene:UIScene, public vert: string = "", public vertMain: string = "", public frag: string = "", public fragMain: string = "") {
    this.compose(scene)
  }

  compose(scene: UIScene) {
    this.vertSource = `
    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 invMatrix;

    uniform float shininess;

    uniform vec3 posLightPosition;
    uniform vec4 posAmbientProduct;
    uniform vec4  posDiffuseProduct;
    uniform vec4  posSpecularProduct;

    uniform vec3 dirLightPosition;
    uniform vec4 dirAmbientProduct;
    uniform vec4  dirDiffuseProduct;
    uniform vec4  dirSpecularProduct;

    uniform vec3 spotLightPosition;
    uniform vec4 spotAmbientProduct;
    uniform vec4  spotDiffuseProduct;
    uniform vec4  spotSpecularProduct;
    uniform vec4 spotLightDirection;
    uniform float spotLightCutOff;
    
    varying vec4 fColor;
    varying vec4 fColorSpecular;

    ${this.vert}
    void main(void) { 
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
      ${this.vertMain} 

      vec3 N= normalize(vec3(mat3(invMatrix) * normal)); 
      vec3 pos= vec3(Mmatrix * vec4(position, 1.0)); 

      // directional light
      vec3 dirLight=dirLightPosition.xyz;
      vec3 dirL=normalize(dirLight);
      vec3 dirE=normalize(-pos);
      vec3 dirH=normalize(dirL+dirE);
      vec4 dirAmbient=dirAmbientProduct;
      float dirKd=max(dot(dirL,N),0.0);
      vec4 dirDiffuse=dirKd*dirDiffuseProduct;
      
      float dirKs=pow(max(dot(N,dirH),0.0), shininess);
      vec4 dirSpecular=dirKs*dirSpecularProduct;
      if(dot(dirL,N)<0.0){
        dirSpecular=vec4(0.0,0.0,0.0,1.0);
      }

      // positional light
      vec3 posLight=posLightPosition.xyz;
      vec3 posL=normalize(posLight-pos);
      vec3 posE=normalize(-pos);
      vec3 posH=normalize(posL+posE);
      vec4 posAmbient=posAmbientProduct;
      float posKd=max(dot(posL,N),0.0);
      vec4 posDiffuse=posKd*posDiffuseProduct;

      float posKs=pow(max(dot(N,posH),0.0), shininess);
      vec4 posSpecular=posKs*posSpecularProduct;
      if(dot(posL,N)<0.0){
        posSpecular=vec4(0.0,0.0,0.0,1.0);
      }

      //spotlight
      vec3 spotLight=spotLightPosition.xyz;
      vec3 spotL=normalize(spotLight);
      vec3 spotE=normalize(-pos);
      vec3 spotH=normalize(spotL+spotE);
      vec3 spotD=spotLightDirection.xyz;
      vec4 spotAmbient=spotAmbientProduct;
      float spotKd=max(dot(spotL,N),0.0);
      vec4 spotDiffuse=spotKd*spotDiffuseProduct;
      float spotKs=pow(max(dot(N,spotH),0.0), shininess);
      vec4 spotSpecular=spotKs*spotSpecularProduct;
      if(dot(spotL,N)<0.0){
        spotSpecular=vec4(0.0,0.0,0.0,1.0);
      }
      float lEffect= dot(normalize(spotD), -spotH);
      if(lEffect>cos(spotLightCutOff))
      {
        vec4 ambient=posAmbient+dirAmbient+spotAmbient;
        vec4 diffuse=posDiffuse+dirDiffuse+spotDiffuse;
        vec4 specular=posSpecular+dirSpecular+spotSpecular;


        fColor = ambient + diffuse;
        fColorSpecular = specular;
        fColor.a = 1.0;
        fColorSpecular.a = 1.0;
      } else{
        vec4 ambient=posAmbient+dirAmbient;
        vec4 diffuse=posDiffuse+dirDiffuse;
        vec4 specular=posSpecular+dirSpecular;


        fColor = ambient + diffuse;
        fColorSpecular = specular;
        fColor.a = 1.0;
        fColorSpecular.a = 1.0;
      }

    }
    `;
    this.fragSource = `
    precision highp float;

    varying vec4 fColor;
    varying vec4 fColorSpecular;
    ${this.frag}
    void main(void) {
      gl_FragColor = vec4(1., 1., 1., 1.);
 

      ${this.fragMain}

     
      gl_FragColor = vec4((fColor.rgb)*gl_FragColor.rgb+ fColorSpecular.rgb, gl_FragColor.a);
    }
    `;
  }

  hasColor() {
    this.vert += `attribute vec4 color;varying   vec4 vColor;`;
    this.vertMain += `vColor = color;`;
    this.frag += `varying vec4 vColor;`;
    this.fragMain += `gl_FragColor = vColor;`;
  }
}