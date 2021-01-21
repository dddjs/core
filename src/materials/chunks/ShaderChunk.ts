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

    uniform vec3 uViewPosition; 
    
    varying vec3 vNormal; 
    varying vec3 vPosition; 
    varying float vDist;
    varying vec3 vEye;
    varying vec3 vPositionEye3;
    ${this.vert}
    void main(void) { 
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.0);

      // 光照模型必须在同一个坐标系中运算, 这里获取视口坐标系的顶点位置
      vec4 vertexPositionEye4 = Vmatrix*Mmatrix*vec4(position, 1.);
      vPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;

      ${this.vertMain} 

      vNormal= vec3(mat3(invMatrix) * normal); 
      vPosition= vec3(Mmatrix * vec4(position, 1.)); 

      
      vDist = gl_Position.w;//distance(vec3(Mmatrix * vec4(position, 1.)), uViewPosition);
      vEye = uViewPosition;
    }
    `;
    this.fragSource = `
    precision highp float;

    uniform vec3 uFogColor;
    uniform vec2 uFogDist;

    

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
    varying float vDist;
    varying vec3 vEye;
    varying vec3 vPositionEye3;
    ${this.frag}
    void main(void) {
      gl_FragColor = vec4(1., 1., 1., 1.);
      
      float fogFactor = clamp((uFogDist.y-vDist)/(uFogDist.y-uFogDist.x), 0., 1.);

      ${this.fragMain}

      vec3 nNormal = normalize(vNormal);
      vec3 nPosition = normalize(vPosition.xyz);

      vec3 nDirLightDirection = normalize(uDirLightDirection);
      vec3 nViewPosition = normalize(vEye);
      vec3 viewDirection = normalize(vEye-vPosition.xyz);

      //计算平行光方向向量和顶点法线向量的点积，为避免出现负值，则取>=0的值
      float dirLightDiffuseIntensity = max(dot(nNormal, -nDirLightDirection), 0.0); 
      // 计算漫反射光的颜色
      vec3 diffuse1 = uDirLightColor * dirLightDiffuseIntensity; 

      // 宾氏（Blinn）模型高光 - 镜面反射
      vec3 halfwayDir = normalize(uDirLightDirection + vEye);
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
      float pointLightDiffuseIntensity = max(dot(-pointLightDir, nNormal), 0.0);// 计算入射角余弦值
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
      // 计算出方向指向光源的向量
      vec3 vectorToLightSource = normalize(uSpotLightPosition - vPosition);
      
      // 通过点积计算出光线的亮度权重
      float spotDiffuseLightWeighting = max(dot(nNormal, vectorToLightSource), .0);

      vec3 diffuse3 = vec3(0.);
      vec3 specular3 = vec3(.0);
      // 只处理亮度大于 0 的区域
      if(spotDiffuseLightWeighting >0.0)
      {
        float spotEffect = dot( normalize(uSpotLightDirection), normalize(-vectorToLightSource));// 计算入射角余弦值
        
        if(spotEffect > cos(radians(uSpotLightCutOff/2.0)))
        {
          const float spotExponent = 1.;
          spotEffect = pow(spotEffect,spotExponent);   

          // 计算出光线通过当前面之后折射出去的向量(r)
          vec3 reflectionVector = normalize(reflect(-vectorToLightSource, nNormal));

          // 眼睛坐标下的相机位于原点, 并沿着负z轴指向, 计算眼坐标中的视向量(v)
          vec3 viewVectorEye = normalize(vPositionEye3);

          // 计算出镜面反射的亮度权重
          float rdotv = max(dot(reflectionVector, viewVectorEye), 0.0);
          float spotSpecularIntensity =  pow(rdotv, uSpotLightShininess);

          diffuse3 = spotEffect * uSpotLightColor * spotDiffuseLightWeighting ;// 计算平行光漫反射颜色
          specular3 =  spotEffect * uSpotLightSpecularColor.rgb * spotSpecularIntensity ;

        }

        
      }

      // vec3 nSpotLightPosition = normalize(uSpotLightPosition);
      // vec3 someDir = normalize(uSpotLightPosition - vPosition.xyz);// 计算入射光线反方向并归一化
      // vec3 nSpotLightDirection = normalize(uSpotLightDirection);
      
      // float currentCosThta = max(0.0,dot(-someDir, nSpotLightDirection));// 计算入射角余弦值
      // float diffuseIntensity = 0.0;
      // if(currentCosThta>cos(radians(uSpotLightCutOff/2.0) )) 
      // {
      //   if(dot(someDir,nNormal) >0.0)
      //   {
      //     diffuseIntensity = pow(currentCosThta,1.);   
      //   }
      // }
      // vec3 diffuse3 = uSpotLightColor * diffuseIntensity;// 计算平行光漫反射颜色
      

      // 线光源
      vec3 lineAB = uLineLightPosition2.xyz - uLineLightPosition1.xyz;// A=>1,B=>2
      vec3 lineAP = vPosition.xyz - uLineLightPosition1.xyz;
      vec3 lineBP = vPosition.xyz - uLineLightPosition2.xyz;
      float minDistance = 0.0;
      float r = dot(lineAP, lineAB) / pow(length(lineAB), 2.0);

      float lineLightIntensity = 0.;
      if(r>=0. && r<=1.)
      {
        vec3 lineCP =lineAP - r*lineAB; // 入射光线方向

        vec3 someLineDir = normalize(lineCP);
        vec3 nLineLightDirection = normalize(uLineLightDirection);
        float lineLightCosThta = max(0.0,dot(someLineDir, nLineLightDirection));
        if(lineLightCosThta>cos(radians(uLineLightCutOff/2.0) )) 
        {
          lineLightIntensity = lineLightCosThta;//max(dot(lineCP, nNormal), 0.0);
        }
      }
      

      vec3 diffuse4 = uLineLightColor * lineLightIntensity;
      // gl_FragColor = vec4(diffuse4.rgb * gl_FragColor.rgb, gl_FragColor.a);
      
      //计算环境光和反射后的平行光的颜色分量之和
      vec3 vLightWeighting = uAmbientColor.rgb  + diffuse3 ;//  + diffuse1 + diffuse2

      vec3 litcolor = vLightWeighting*gl_FragColor.rgb + specular3;//+ specular + specular2 
      
      // gl_FragColor = vec4(mix( litcolor, uFogColor,fogFactor), gl_FragColor.a);
      gl_FragColor = vec4(litcolor, 1.0);
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