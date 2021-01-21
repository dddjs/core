import { UIMaterial } from "./UIMaterial";
import { SimpleChunk } from "./chunks/SimpleChunk";
import { Color } from "../core/Color";
import { UIScene } from "../ui/UIScene";

export class UIColorMaterial extends UIMaterial{

  constructor( config: object = {}) {
    
    let rConfig = {
      uColor: new Color(1.0,1.0,1.0,1),
      ...config
    }
    super(rConfig);
  }

  shaderSource(scene: UIScene) {
    let vert = `uniform vec4 uColor;varying vec4 vColor;`,
      vertMain = "vColor = uColor;",
      frag = "varying vec4 vColor;",
      fragMain = "gl_FragColor = vColor;";

    this.shader = new SimpleChunk(scene, vert, vertMain, frag, fragMain)
  }


}