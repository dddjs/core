import { Object3d } from './Object3d';
import { Mat4 } from '../math/Mat4';
import { Vec3 } from '../math/Vec3';
export class Camera extends Object3d {
  _projectMatrix: Mat4; // 投影矩阵 - 正交投影|透视投影
  _viewMatrix: Mat4;
  constructor(_name: string = "ddd-camera", _pos: Vec3 = new Vec3(0, 0, 0)) {
    super(_name, _pos);
    this.isRightHand = true;
    
    // 
    // let vM = Mat4.view(_pos, new Vec3(0, 0, -100), new Vec3(0, 1, 0), this.isRightHand)
    // this._viewMatrix = this._modelMatrix.inverse();

    // this._modelMatrix.onChange(() => {
    //   console.log('_modelMatrix.onChange')
    //   let t = this._modelMatrix.inverse()
    //   if (t)
    //     this._viewMatrix = t;//vM.clone().rightDot(t);

    //     console.log(this._viewMatrix)
    // })
    
  }

  get viewMatrix() {
    return this._modelMatrix.clone().inverse();
  }

  get className() {
    return 'Camera';
  }

  clone() {
    return new Camera();
  }

  toString() {
    return `Camera()`
  }
}