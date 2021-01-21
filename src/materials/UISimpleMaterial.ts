import { UIMaterial } from "./UIMaterial";
import { SimpleChunk } from "./chunks/SimpleChunk";
import { UIScene } from "../ui/UIScene";

export class UISimpleMaterial extends UIMaterial {
  constructor( config: object = {}) {
    super(config);
  }

  shaderSource(scene: UIScene) {

    this.shader = new SimpleChunk(scene)
  }
}