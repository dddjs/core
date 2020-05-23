import { Quaternion } from './../math/Quaternion';
import Base from "../Base";
import { Vec3 } from "../math/Vec3";
import { Mat4 } from "../math/Mat4";
import { Euler } from "../math/Euler";
import { UIMaterial } from "../materials/UIMaterial";
import { Gemotry } from "./Gemotry";

export class Object3d extends Base {
  public uuid: Symbol = Symbol('uuid');
  public _children: any = [];
  public _parent: any = null;
  public _position: Vec3 = new Vec3();
  public _scale: Vec3 = new Vec3(1, 1, 1);
  public _quaternion: Quaternion = new Quaternion();
  public _euler: Euler = new Euler();
  public _modelMatrix: Mat4 = Mat4.E;
  public _modelMatrixOnWorld: Mat4 = Mat4.E;
  public _lastModelMatrix: Mat4 = Mat4.E;


  public _gemotry: Gemotry = new Gemotry();
  public _material: UIMaterial | null = null;
  public _renderInitial: boolean = false;

  protected isCamera: boolean = false;
  protected isRightHand: boolean = true;
  public _transformOnWorld: boolean = false;// true 公转， false 自转
  constructor(public _name: string, _pos: Vec3 = new Vec3(0, 0, 0)) {
    super()

    this._modelMatrix.onChange(()=>{
      this._lastModelMatrix = this._lastModelMatrix.clone().inverse().rightDot(this._modelMatrix);
    })

    this._position.onChange(() => {
      this._modelMatrix.compose(this._position, this._quaternion, this._scale).trigger()
    })

    this._scale.onChange(() => {
      this._modelMatrix.compose(this._position, this._quaternion, this._scale).trigger()
    })

    this._quaternion.onChange(() => {
      this._modelMatrix.compose(this._position, this._quaternion, this._scale).trigger()
    })

    this._euler.onChange(() => {
      let q = this._euler.quaternion();
      this._quaternion.mul(q.x, q.y, q.z, q.w).trigger()
    });

    this.setPosition(_pos.x, _pos.y, _pos.z);
  }

  get name() {
    return this._name;
  }

  get position() {
    return this._position;
  }

  setPosition(x: number = 0, y: number = 0, z: number = 0) {
    this._position.set(x, y, z).trigger()
  }

  getMatrixOnWorld(){
    if(this._parent==null) {
      this._modelMatrixOnWorld =  this._modelMatrix
    } else {
      this._modelMatrixOnWorld =  this._parent.getMatrixOnWorld().leftDot(this._modelMatrix)
    }
    
    return this._modelMatrixOnWorld.clone()
  }

  translateOnAxis(axis: Vec3, distance) {
    let qx = this._quaternion.x, qy = this._quaternion.y, qz = this._quaternion.z, qw = this._quaternion.w;
    let dis = axis.clone().fromQuaternion(qx, qy, qz, qw).mul(distance);
    this._position.add(dis.x, dis.y, dis.z).trigger();
    return this;
  }

  // translate(x: number = 0, y: number = 0, z: number = 0) {
  //   let qx = this._quaternion.x, qy = this._quaternion.y, qz = this._quaternion.z, qw = this._quaternion.w;
  //   let Vx = new Vec3(1, 0, 0).fromQuaternion(qx, qy, qz, qw).mul(x);
  //   let Vy = new Vec3(0, 1, 0).fromQuaternion(qx, qy, qz, qw).mul(y);
  //   let Vz = new Vec3(0, 0, 1).fromQuaternion(qx, qy, qz, qw).mul(z);
  //   this._position.add(Vx.x, Vx.y, Vx.z).add(Vy.x, Vy.y, Vy.z).add(Vz.x, Vz.y, Vz.z).trigger();
  //   return this;
  // }

  // 平移只在自己的轴上
  translateX(val: number) {
    return this.translateOnAxis(new Vec3(1, 0, 0), val);
  }

  translateY(val: number) {
    return this.translateOnAxis(new Vec3(0, 1, 0), val);
  }

  translateZ(val: number) {
    return this.translateOnAxis(new Vec3(0, 0, 1), val);
  }

  scaling(x: number, y: number, z: number) {
    this._scale.x *= x;
    this._scale.y *= y;
    this._scale.z *= z;
    this._scale.trigger()
    return this;
  }

  // 缩放只在自己轴上
  scaleX(val: number) {
    return this.scaling(val, 1, 1);
  }

  scaleY(val: number) {
    return this.scaling(1, val, 1);
  }

  scaleZ(val: number) {
    return this.scaling(1, 1, val);
  }

  rotateOnWorldAxis(axis: Vec3, angle_in_rad: number){
    axis.normalize();
    let x = axis.x, y = axis.y, z = axis.z;
    let u = this.position.x, v = this.position.y, w = this.position.z;
    let t = angle_in_rad;

    let nx = u *Math.cos(t) + (y * w - z * v) *Math.sin(t) + x *(x * u + y * v + z * w)*( 1- Math.cos(t));
		let ny = v *Math.cos(t) + (z * u - x * w) *Math.sin(t) + y *(x * u + y * v + z * w)*( 1- Math.cos(t));
    let nz = w *Math.cos(t) + (x * v - y * u) *Math.sin(t) + z *(x * u + y * v + z * w)*( 1- Math.cos(t));
    
    this.setPosition(nx, ny, nz)
  }

  rotateOnWorldAnyAxis(p1: Vec3, p2:Vec3, angle_in_rad:number){
    var rotationMatrix = new Mat4(); 
    rotationMatrix.makeRotationAnyAxis(p1, p2, angle_in_rad); 

    var x = this.position.x, y = this.position.y, z = this.position.z, w = 1;
    var e = rotationMatrix.elements;
    
		let nx = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		let ny = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		let nz = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;

    this.setPosition(nx, ny, nz)

  }


  rotate(axis: Vec3, angle_in_rad: number, onWorld: boolean = false) {
    this._transformOnWorld = onWorld;
    // assumes axis is normalized
    let q = new Quaternion();
    q.fromAxisAngle(axis, angle_in_rad);
    
    if (onWorld) {
      this._quaternion.leftmul(q.x, q.y, q.z, q.w).trigger()
    } else {
      this._quaternion.mul(q.x, q.y, q.z, q.w).trigger()
    }
// console.log(q, this._quaternion)

    return this;
  }

  // 
  rotateX(angle_in_rad: number, onWorld: boolean = false) {
    // assumes axis is normalized
    return this.rotate(new Vec3(1, 0, 0), angle_in_rad, onWorld)
  }

  rotateY(angle_in_rad: number, onWorld: boolean = false) {
    // assumes axis is normalized
    return this.rotate(new Vec3(0, 1, 0), angle_in_rad, onWorld)
  }

  rotateZ(angle_in_rad: number, onWorld: boolean = false) {
    // assumes axis is normalized
    return this.rotate(new Vec3(0, 0, 1), angle_in_rad, onWorld)
  }
  //滚转角，俯仰角，航向角（roll, pitch, yaw)
  pitch(val: number) {//俯仰角
    this._euler.pitch = val;
    this._euler.trigger();
    return this;
  }

  yaw(val: number) {//航向角
    this._euler.yaw = val;
    this._euler.trigger();
    return this;
  }

  roll(val: number) {//滚转角
    this._euler.roll = val;
    this._euler.trigger();
    return this;
  }

  lookAt(x: number = 0, y: number = 0, z: number = 0) {
    let target = new Vec3(x, y, z),
      eye = this._position,
      up = new Vec3(0, 1, 0);

    let zAxis = eye.clone().sub(target.x, target.y, target.z);
    if(!this.isCamera) {
      zAxis.mul(-1)
    }
    if (zAxis.length() === 0) {

      // eye and target are in the same position

      zAxis.z = 1;

    }
    let NZ = zAxis.normalize();

    let xAxis = up.clone().cross(NZ.x, NZ.y, NZ.z);
    if (xAxis.length() === 0) {

      // up and z are parallel

      if (Math.abs(up.z) === 1) {

        NZ.x += 0.0001;

      } else {

        NZ.z += 0.0001;

      }

      NZ = NZ.normalize();
      xAxis = up.clone().cross(NZ.x, NZ.y, NZ.z);

    }
    let UX = xAxis.normalize();

    let yAxis = NZ.clone().cross(UX.x, UX.y, UX.z);
    let VY = yAxis.normalize()

    let r = new Mat4(
      UX.x, UX.y, UX.z, 0,
      VY.x, VY.y, VY.z, 0,
      NZ.x, NZ.y, NZ.z, 0,
      0,
      0,
      0,
      1,
    )

    r = r.transpose()

    this._quaternion.fromMat4(r).trigger()
  }

  followAt(obj: Object3d, distance: number = 0) {
    let target = obj._position;

    target.onChange((v)=>{
      
      this.lookAt(v.x, v.y, v.z)
    
      let p = this._position;
      let len = p.clone().sub(v.x,v.y, v.z).length();
      let feth = distance/len;

      let np = p.clone().sub(v.x, v.y, v.z).mul(feth).clone().add(v.x, v.y, v.z);
      // console.log(v, feth, len)
      this.setPosition(np.x, np.y, np.z)
    })

    
  }

  /**
   * 
   *  */

  add(obj: Object3d) {
    if (this === obj||this._children.indexOf(obj)>-1) {
      console.warn('this is the same with obj')
      return
    }
    obj._parent = this;
    this._children.push(obj)
  }

  // end

  clone() {
    return new Object3d('node');
  }

  toString() {
    return '()';
  }

}