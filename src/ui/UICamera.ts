import { Camera } from "../core/Camera";
import { Mat4 } from "../math/Mat4";
import { fovy } from "../tools/index";
import { Vec3 } from "../math/Vec3";
import { UIScene } from "./UIScene";
import { Color } from "../core/Color";


export class UICamera extends Camera {
  public isControlled:boolean = false;

  // 场景视口
  public viewport: number[] = [0.0, 0.0, 100, 100];
  // 背景色
  public clearColor: Color = new Color(0.0, 0.0, 0.0, 0.0);

  constructor(scene: UIScene) {
    super('UI Camera', new Vec3(0,0,20));
    scene.cameras.push(this);
    if(scene.camera==null) {
      scene.camera = this;
      this.isControlled = true;//场景主视口相机，默认使用场景视口；其它场景相机使用自己的视口
    }
    
    
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