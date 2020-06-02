import { Camera } from "../core/Camera";
import { Mat4 } from "../math/Mat4";
import { fovy } from "../tools/index";
import { Vec3 } from "../math/Vec3";
import { UIScene } from "./UIScene";

export class UICamera extends Camera {
  constructor(scene: UIScene) {
    super('UI Camera', new Vec3(0,0,20));
    scene.camera = this;
    
    // let near = 1;
    // let far = 1000;
    // let width = 2;
    // let height =2;
    // let fov = fovy(height, near);

    this._projectMatrix = Mat4.perspective(60, window.innerWidth/(2*window.innerHeight), .1, 1000); // 透视投影fovy(4, 1)
    // this._projectMatrix = Mat4.perspective(fov, width/height, near, far, this.isRightHand); // 透视投影fovy(4, 1)
    // this._projectMatrix = Mat4.perspectiveWHNF(width, height, near, far, this.isRightHand); // 透视投影
    // this._projectMatrix = Mat4.perspectiveLRTBNF(-width/2, width/2, height/2, -height/2, near, far, this.isRightHand); // 透视投影
    // this._projectMatrix = Mat4.orthographicWHNF(width, height, near, far, this.isRightHand) // 正交投影
    // this._projectMatrix = Mat4.orthographicLRTBNF(-width/2, width/2, height/2, -height/2, near, far, this.isRightHand) // 正交投影
  }
}