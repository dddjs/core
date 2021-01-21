import { UIMaterial } from "./UIMaterial";
import { SimpleChunk } from "./chunks/SimpleChunk";
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
    // attribute vec2 textCoord;
    varying vec3 vTexCoord;`,

    vertMain = `
    vTexCoord = normalize(position.xyz);
    `,
      frag = `
    uniform samplerCube u_Sampler;
    varying vec3 vTexCoord;
    `,
      fragMain = `
      gl_FragColor = textureCube(u_Sampler, vec3(vTexCoord));
      `;

    this.shader = new SimpleChunk(scene, vert, vertMain, frag, fragMain)
  }

  handle() {
    new ImagesLoaded(this.config['images']).onLoad((images) => {
      console.log(images.map(i=>i.src))
      let texture = GLTools.createCubeTexture(this.ctx, images, {flip:0});
      // if (texture) texture['images'] = images;
      this.config['u_Sampler'] = texture;
      this.isReady = true;
    });
  }
}