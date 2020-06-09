
export class ShaderChunk {
  vertSource: string;
  fragSource: string;
  constructor(public vert: string = "", public vertMain: string = "", public frag: string = "", public fragMain: string = "") {
    this.compose()
  }

  compose() {
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
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    
    //
    // attribute vec3 aBarycentric;
    // varying vec3 vBarycentric;
    varying vec3 vertex;
    ${this.vert}
    void main(void) { 
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
      ${this.vertMain} 
      // vBarycentric = aBarycentric;
      vertex = position;
    }
    `;
    this.fragSource = `#extension GL_OES_standard_derivatives:enable
    precision mediump float;
    uniform vec4 uAmbientColor;
    // varying vec3 vBarycentric;
    // var barycentric = [1,0,0, 1,1,0, 0,0,1, 0,0,0];
    
    varying vec3 vertex;
    ${this.frag}
    void main(void) {
      gl_FragColor = vec4(1., 1., 1., 1.);
      // vec3 d=fwidth(vBarycentric);
      // vec3 a3=smoothstep(vec3(0.0), d*2.0, vBarycentric);
      // gl_FragColor.rgb = mix(vec3(0.,0.,0.),vec3(1.0), min(min(a3.x, a3.y), a3.z));

      // // Pick a coordinate to visualize in a grid
      // vec2 coord = vertex.xz;
    
      // // Compute anti-aliased world-space grid lines
      // vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
      // float line = min(grid.x, grid.y);
    
      // // Just visualize the grid lines directly
      // gl_FragColor = vec4(vec3(1.0 - min(line, 1.0)), 1.0);

      ${this.fragMain}
      gl_FragColor = vec4(uAmbientColor.xyz*gl_FragColor.rgb, gl_FragColor.a);
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