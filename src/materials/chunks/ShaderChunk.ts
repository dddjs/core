import { UIScene } from "../../ui/UIScene";

export class ShaderChunk {
  vertSource: string;
  fragSource: string;
  constructor(scene:UIScene, public vert: string = "", public vertMain: string = "", public frag: string = "", public fragMain: string = "") {
    this.compose(scene)
  }

  compose(scene: UIScene) {
    this.vertSource = `
    
    struct DirLight {
      vec3 direction;
  
      vec3 ambient;
      vec3 diffuse;
      vec3 specular;

      float shadowBias;
    };

   

    struct PointLight {
      vec3 position;
  
      float constant;
      float linear;
      float quadratic;
  
      vec3 ambient;
      vec3 diffuse;
      vec3 specular;
    };  

    #define NR_POINT_LIGHTS 4

    // vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
    // {
    //     vec3 lightDir = normalize(light.position - fragPos);
    //     // 漫反射着色
    //     float diff = max(dot(normal, lightDir), 0.0);
    //     // 镜面光着色
    //     vec3 reflectDir = reflect(-lightDir, normal);
    //     float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    //     // 衰减
    //     float distance    = length(light.position - fragPos);
    //     float attenuation = 1.0 / (light.constant + light.linear * distance +
    //                 light.quadratic * (distance * distance));    
    //     // 合并结果
    //     vec3 ambient  = light.ambient  * vec3(texture(material.diffuse, TexCoords));
    //     vec3 diffuse  = light.diffuse  * diff * vec3(texture(material.diffuse, TexCoords));
    //     vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
    //     ambient  *= attenuation;
    //     diffuse  *= attenuation;
    //     specular *= attenuation;
    //     return (ambient + diffuse + specular);
    // }

  

    struct MaterialInfo {
      float shininess;
      vec3 ambient;
      vec3 diffuse;
      vec3 specular;
    };

    uniform MaterialInfo material;


    // vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
    // {
    //     vec3 lightDir = normalize(-light.direction);
    //     // 漫反射着色
    //     float diff = max(dot(normal, lightDir), 0.0);
    //     // 镜面光着色
    //     vec3 reflectDir = reflect(-lightDir, normal);
    //     float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    //     // 合并结果
    //     vec3 ambient  = light.ambient  * vec3(texture(material.diffuse, TexCoords));
    //     vec3 diffuse  = light.diffuse  * diff * vec3(texture(material.diffuse, TexCoords));
    //     vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
    //     return (ambient + diffuse + specular);
    // }

    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    uniform mat4 invMatrix;
    
    varying vec3 v_normal; 
    varying vec3 v_position; 
    ${this.vert}
    void main(void) { 
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
      ${this.vertMain} 

      v_normal=vec3(mat3(invMatrix) * normal); 
      v_position= vec3(Mmatrix * vec4(position, 1.0)); 

      

    }
    `;
    this.fragSource = `
    precision highp float;

    uniform vec3 u_viewPosition; 

    uniform vec4 uAmbientColor;

    uniform vec3 uLightingDirection;  //平行光方向
    uniform vec3 uDirectionalColor;  //平行光颜色

    uniform vec3 u_LightColor;// 点光源入射颜色
    uniform vec3 u_LightPosition;// 点光源位置
    
    

    varying vec3 v_normal; 
    varying vec3 v_position; 
    ${this.frag}
    void main(void) {
      gl_FragColor = vec4(1., 1., 1., 1.);
 

      ${this.fragMain}

      vec3 nNormal = normalize(v_normal);
      vec3 lightDirection = normalize(u_LightPosition);

      // vec3 transformedNormal = (invMatrix * vec4(nNormal, 1.0)).xyz;  //变换后的法线向量

      //计算平行光方向向量和顶点法线向量的点积，为避免出现负值，则取>=0的值
      float cosTheta = max(dot(nNormal, lightDirection), 0.0); 
      // float cosTheta = max(dot(transformedNormal, lightDirection), 0.0); 
      // 计算漫反射光的颜色
      vec3 diffuse1 = uDirectionalColor  * cosTheta; 

      // 宾氏模型高光 - 镜面反射
      float shininess =100.0;
      vec3 specularColor =vec3(1.0,1.0,1.0);
      // vec3 u_viewPosition =vec3(0., 0. ,2.0);
      vec3 viewDirection = normalize(u_viewPosition-v_position.xyz);
      vec3 halfwayDir = normalize(uLightingDirection + viewDirection);
      float specularWeighting = pow(max(dot(nNormal, halfwayDir), 0.0), shininess);
      vec3 specular = specularColor.rgb * specularWeighting ;//* step(cosTheta,0.0);
  

      // 点光
      vec3 dir = normalize(u_LightPosition - v_position.xyz);// 计算入射光线反方向并归一化
      float cosTheta2 = max(dot(dir, nNormal), 0.0);// 计算入射角余弦值
      // vec3 diffuse = u_LightColor * vec3(a_Color) * cosTheta2;// 计算平行光漫反射颜色
      vec3 diffuse2 = u_LightColor * cosTheta2;// 计算平行光漫反射颜色


      // 冯氏模型高光 - 镜面反射
      float shininess2 =30.0;
      vec3 specularColor2 =vec3(1.0,1.0,1.0);
      vec3 reflectionDirection = reflect(-dir, nNormal);
      float specularWeighting2 = pow(max(dot(reflectionDirection, viewDirection), 0.0), shininess2);
      vec3 specular2 = specularColor2.rgb * specularWeighting2;// * step(cosTheta,0.0);

      //计算环境光和反射后的平行光的颜色分量之和
      vec3 vLightWeighting = uAmbientColor.rgb + diffuse1 + diffuse2 ;  

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