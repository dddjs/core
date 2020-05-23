import { UIMaterial } from "./UIMaterial";
import { ShaderChunk } from "./chunks/ShaderChunk";
import { GLTools } from "../tools/GLTools";
import { ImagesLoaded } from "../tools/ImagesLoaded";


export class UICubeTextureMaterial extends UIMaterial {
  // image map

  constructor(config: Object = {}) {
    super()

    this.config = {
      images: [],
      u_Sampler: null,
      ...config
    }
  }
// https://www.dazhuanlan.com/2019/09/02/6a6bd2460cd9/
  shaderSource() {
    let vert = `
    attribute vec3 normal;
    uniform mat4 Normalmatrix;
    highp vec3 uAmbientColor = vec3(0.2, 0.2, 0.2);
    const vec3 u_LightColor = vec3(1.0, 1.0, 1.0); 
    const vec3 u_LightDir = vec3(1.322, .123, .65); // （平行光源）光源方向一定 与 （点光源）光源位置一定
    //const vec3 u_LightPosition = vec3(2.0, 2.0, 4.0); / / （平行光源）光源方向一定 与 （点光源）光源位置一定
    varying vec3 vLightWeighting;
    varying vec3 v_TexCoord;`,

    vertMain = `
    v_TexCoord = position;
    vec3 v_normal = vec3(Normalmatrix * vec4(normal, 1.0));
    vec3 vnor = normalize(vec3(v_normal));
    vec3 nDir = normalize(u_LightDir);
    // vec3 nDir = normalize(vec3(gl_Position) - u_LightPosition);
    float directional = max(dot( nDir, vnor), 0.0);
    vec3 diffuse = u_LightColor  * directional;
    vec3 ambient = uAmbientColor ;
    vLightWeighting =  ambient + diffuse; 
    `,
      frag = `
    uniform samplerCube u_Sampler;
    varying vec3 v_TexCoord;`,
      fragMain = `
      vec3 ambient = vec3(1.1);
      vec4 finalLightStrength = vec4(ambient,1.0);
      gl_FragColor = textureCube(u_Sampler, v_TexCoord);
      gl_FragColor = vec4(vLightWeighting * gl_FragColor.rgb,gl_FragColor.a) ;
      `;

    this.shader = new ShaderChunk(vert, vertMain, frag, fragMain)
  }

  handle() {
    new ImagesLoaded(this.config['images']).onLoad((images) => {
      let texture = GLTools.createCubeTexture(this.ctx, images, {});
      // if (texture) texture['images'] = images;
      this.config['u_Sampler'] = texture;
      this.isReady = true;
    });
  }
}