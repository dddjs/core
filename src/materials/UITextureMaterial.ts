import { UIMaterial } from "./UIMaterial";
import { ShaderChunk } from "./chunks/ShaderChunk";
import { GLTools } from "../tools/GLTools";
import { ImagesLoaded } from "../tools/ImagesLoaded";
import { UIScene } from "../ui/UIScene";


export class UITextureMaterial extends UIMaterial {
  // image map

  constructor(config:  {
    dynamic?: boolean
  }) {
    super(config)

    this.config = {
      image: null,
      u_Sampler: null,
      ...this.config
    }
  }

  shaderSource(scene: UIScene) {
    let vert = `
    attribute vec2 a_TextCoord;
    varying vec2 v_TexCoord;`,
      vertMain = "v_TexCoord = a_TextCoord; ",
      frag = `
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;`,
      fragMain = "gl_FragColor = texture2D(u_Sampler, v_TexCoord);";

    this.shader = new ShaderChunk(scene, vert, vertMain, frag, fragMain)
  }

  handle() {
    let that = this;
    new ImagesLoaded([this.config['image']]).onProgress((image) => {
      let texture = GLTools.createTexture(that.ctx, image, {flip:0});
      that.config['u_Sampler'] = texture;
      that.isReady = true;
    })
  }
}