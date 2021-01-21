import { UIScene } from "../../ui/UIScene";

export class SimpleChunk {
  vertSource: string;
  fragSource: string;
  constructor(scene:UIScene, public vert: string = "", public vertMain: string = "", public frag: string = "", public fragMain: string = "") {
    this.compose(scene)
  }

  compose(scene: UIScene) {
    this.vertSource = `
    precision highp float;
    attribute vec3 position;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;

    ${this.vert}
    void main(void) { 
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);

      ${this.vertMain} 
    }
    `;
    this.fragSource = `
    precision highp float;

    ${this.frag}
    void main(void) {
      gl_FragColor = vec4(1., 1., 1., 1.);
      ${this.fragMain}
    }
    `;
  }
}