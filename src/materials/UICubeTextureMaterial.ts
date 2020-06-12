import { UIMaterial } from "./UIMaterial";
import { ShaderChunk } from "./chunks/ShaderChunk";
import { GLTools } from "../tools/GLTools";
import { ImagesLoaded } from "../tools/ImagesLoaded";
import { UIScene } from "../ui/UIScene";


export class UICubeTextureMaterial extends UIMaterial {
  // image map

  constructor(config: Object = {}) {
    super(config)

    this.config = {
      images: [],
      u_Sampler: null,
      ...this.config
    }
  }
// https://www.dazhuanlan.com/2019/09/02/6a6bd2460cd9/
  shaderSource(scene: UIScene) {
    let vert = `
    varying vec3 v_TexCoord;`,

    vertMain = `
    v_TexCoord = position;
    `,
      frag = `
    uniform samplerCube u_Sampler;
    varying vec3 v_TexCoord;
    `,
      fragMain = `
      gl_FragColor = textureCube(u_Sampler, v_TexCoord);
      `;

    this.shader = new ShaderChunk(scene, vert, vertMain, frag, fragMain)
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