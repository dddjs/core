import { UIMaterial } from "./UIMaterial";
import { SimpleChunk } from "./chunks/SimpleChunk";
import { GLTools } from "../tools/GLTools";
import { ImagesLoaded } from "../tools/ImagesLoaded";
import { UIScene } from "../ui/UIScene";


export class UITextureMaterial extends UIMaterial {
  // image map

  constructor(config:  {
    dynamic?: boolean
  }) {
    let rConfig = {
      image: null,
      flip: 0,
      ...config
    }

    super(rConfig)
  }

  shaderSource(scene: UIScene) {
    let vert = `
    attribute vec2 textCoord;
    varying vec2 v_TexCoord;`,
      vertMain = "v_TexCoord = textCoord; ",
      frag = `
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;`,
      fragMain = "gl_FragColor = texture2D(u_Sampler, v_TexCoord);";

    this.shader = new SimpleChunk(scene, vert, vertMain, frag, fragMain)
  }

  handle() {
    let that = this;
    new ImagesLoaded([this.config['image']]).onProgress((image) => {
      let texture = GLTools.createTexture(that.ctx, image, {flip:that.config.flip});
      that.config['u_Sampler'] = texture;
      that.isReady = true;
    })
  }
}