import { UIScene } from "../../ui/UIScene";

export class ShaderChunk {
  vertSource: string;
  fragSource: string;
  constructor(scene:UIScene, public vert: string = "", public vertMain: string = "", public frag: string = "", public fragMain: string = "") {
    this.compose(scene)
  }

  compose(scene: UIScene) {
    this.vertSource = `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 invMatrix;
    
    varying vec3 vNormal; 
    varying vec3 vPosition; 
    ${this.vert}
    void main(void) { 
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
      ${this.vertMain} 

      vNormal= vec3(mat3(invMatrix) * normal); 
      vPosition= vec3(Mmatrix * vec4(position, 1.0)); 

      

    }
    `;
    this.fragSource = `
    precision highp float;

    uniform vec3 uViewPosition; 

    uniform vec4 uAmbientColor;

    uniform vec3 uDirLightDirection;  //平行光方向
    uniform vec3 uDirLightColor;  //平行光颜色
    uniform vec3 uDirLightSpecularColor;  //平行光颜色
    uniform float uDirLightShininess;  //平行光强度

    uniform vec3 uPointLightPosition;// 点光源位置
    uniform vec3 uPointLightColor;// 点光源入射颜色
    uniform vec3 uPointLightSpecularColor;// 点光源高光颜色
    uniform float uPointLightShininess;// 点光源强度
    uniform float uPointLightDistance;// 点光源可传播最远距离
    
    
    uniform vec3 uSpotLightPosition;// 聚光光源位置
    uniform vec3 uSpotLightDirection;// 聚光光源位置
    uniform vec3 uSpotLightColor;// 聚光光源入射颜色
    uniform vec3 uSpotLightSpecularColor;// 聚光高光颜色
    uniform float uSpotLightShininess;// 聚光强度
    uniform float uSpotLightDistance;// 聚光可传播最远距离
    uniform float uSpotLightCutOff;// 聚光光源锥角

    uniform vec3 uLineLightPosition1;// 线光源位置
    uniform vec3 uLineLightPosition2;// 线光源位置
    uniform vec3 uLineLightDirection;///
    uniform vec3 uLineLightColor;// 线光源入射颜色
    uniform float uLineLightDistance;// 线光源可传播最远距离
    uniform float uLineLightCutOff;//

    varying vec3 vNormal; 
    varying vec3 vPosition; 
    ${this.frag}
    void main(void) {
      gl_FragColor = vec4(1., 1., 1., 1.);
 

      ${this.fragMain}

      vec3 nNormal = normalize(vNormal);
      vec3 nPosition = normalize(vPosition.xyz);

      vec3 nDirLightDirection = normalize(uDirLightDirection);
      vec3 nViewPosition = normalize(uViewPosition);
      vec3 viewDirection = normalize(uViewPosition-vPosition.xyz);

      //计算平行光方向向量和顶点法线向量的点积，为避免出现负值，则取>=0的值
      float dirLightDiffuseIntensity = max(dot(nNormal, nDirLightDirection), 0.0); 
      // 计算漫反射光的颜色
      vec3 diffuse1 = uDirLightColor  * dirLightDiffuseIntensity; 

      // 宾氏（Blinn）模型高光 - 镜面反射
      vec3 halfwayDir = normalize(uDirLightDirection + uViewPosition);
      float specularWeighting = pow(max(dot(nNormal, halfwayDir), 0.0), 1./uDirLightShininess);
      // 如果漫反射强度过低则将镜面光置零
      if(dirLightDiffuseIntensity<= 0.) 
      {
        specularWeighting = 0.;
      }
      vec3 specular = uDirLightSpecularColor.rgb * specularWeighting ;//* step(cosTheta,0.0);
  
      

      // 点光
      vec3 nPointLightPosition = normalize(uPointLightPosition);
      vec3 pointLightDir = normalize(uPointLightPosition - vPosition.xyz);// 计算入射光线反方向并归一化
      float pointLightDiffuseIntensity = max(dot(pointLightDir, nNormal), 0.0);// 计算入射角余弦值
      vec3 diffuse2 = uPointLightColor * pointLightDiffuseIntensity;// 计算平行光漫反射颜色vec3(0.);//


      // 冯氏（Phone）模型高光 - 镜面反射
      vec3 reflectionDirection = normalize(reflect(-pointLightDir, nNormal));
      float pShinessWeight = smoothstep(0., uPointLightDistance, distance(uPointLightPosition, vPosition));
      float specularWeighting2 = pow(max(dot(reflectionDirection, viewDirection), 0.0), uPointLightShininess * pShinessWeight);
      // 如果漫反射强度过低则将镜面光置零
      if(pointLightDiffuseIntensity<= 0.) 
      {
        specularWeighting2 = 0.;
      }
      vec3 specular2 = uPointLightSpecularColor.rgb * specularWeighting2;// * step(cosTheta,0.0);

      // 聚光灯
      vec3 nSpotLightPosition = normalize(uSpotLightPosition);
      vec3 someDir = normalize(uSpotLightPosition - vPosition.xyz);// 计算入射光线反方向并归一化
      vec3 nSpotLightDirection = normalize(uSpotLightDirection);
      
      float currentCosThta = max(0.0,dot(-someDir, nSpotLightDirection));// 计算入射角余弦值
      float diffuseIntensity = 0.0;
      if(currentCosThta>cos(radians(uSpotLightCutOff/2.0) )) 
      {
        if(dot(someDir,nNormal) >0.0)
        {
          diffuseIntensity = pow(currentCosThta,1.0);   
        }
      }
      vec3 diffuse3 = uSpotLightColor * diffuseIntensity;// 计算平行光漫反射颜色


      // 线光源
      vec3 lineAB = uLineLightPosition2.xyz - uLineLightPosition1.xyz;// A=>1,B=>2
      vec3 lineAP = vPosition.xyz - uLineLightPosition1.xyz;
      vec3 lineBP = vPosition.xyz - uLineLightPosition2.xyz;
      float minDistance = 0.0;
      // float r = dot(lineAP, lineAB) / pow(length(lineAB), 2.0);
      // if(r<=0.) {
      //   minDistance = length(lineAP);
      // } else if(r >=1.) {
      //   minDistance = length(lineBP);
      // } else {
      // }
      float lineLightIntensity = 0.;
      if(dot(lineAP, lineAB)<0.) {
        minDistance = length(lineAP);
        lineLightIntensity = max(dot(-lineAP, nNormal), 0.0);
      }else if(dot(lineBP, lineAB)>0.) {
        minDistance = length(lineBP);

        lineLightIntensity = max(dot(-lineBP, nNormal), 0.0);
      } else {
        lineLightIntensity = 1.0;
        minDistance = abs(dot(lineAB, lineAP))/length(lineAB);
      }

      vec3 diffuse4 = vec3(0.);
      // if(minDistance <= uLineLightDistance) 
      // {
        
      // }

      // vec3 someLineDir = normalize(uSpotLightPosition - vPosition.xyz);// 计算入射光线反方向并归一化
      // vec3 nLineLightDirection = normalize(uLineLightDirection);
      
      // float lineLightCosThta = max(0.0,dot(-someLineDir, nLineLightDirection));// 计算入射角余弦值
      // float diffuseIntensity = 0.0;
      // if(lineLightCosThta>cos(radians(uLineLightCutOff/2.0) )) 
      // {
      //   if(dot(someLineDir,nNormal) >0.0)
      //   {
      //     diffuseIntensity = pow(currentCosThta,1.0);   
      //   }
      // }


      // if(dot(normalize(uLineLightDirection), nNormal)>0.)
      // {
      //   diffuse4 = uLineLightColor * lineLightIntensity;
      // }

      
      //计算环境光和反射后的平行光的颜色分量之和
      vec3 vLightWeighting = uAmbientColor.rgb + diffuse1 + diffuse2 + diffuse3+diffuse4;  

      gl_FragColor = vec4(vLightWeighting*gl_FragColor.rgb + specular + specular2, gl_FragColor.a);
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