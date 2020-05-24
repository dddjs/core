import { Object3d } from './Object3d';
import { Mat4 } from '../math/Mat4';
import { Vec3 } from '../math/Vec3';
export class Camera extends Object3d {
  _projectMatrix: Mat4; // 投影矩阵 - 正交投影|透视投影
  _viewMatrix: Mat4 = Mat4.view(new Vec3(0,0,1), new Vec3(0,0,0), new Vec3(0,1,0));
  constructor(_name: string = "ddd-camera", _pos: Vec3 = new Vec3(0, 0, 0)) {
    super(_name, _pos);
    this.mType = 'Camera';
    this.isCamera = true;
  }

  get viewMatrix() {
    let vm =  this._viewMatrix.clone().leftDot(this._modelMatrix.clone().inverse())
    // console.log(vm)
    return vm;
    // return this._modelMatrix.clone().inverse()
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