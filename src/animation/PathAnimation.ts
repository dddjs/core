import { Animation } from './Animation';
import { Object3d } from '../core/Object3d';
import { Vec3 } from '../math/Vec3';



// https://www.jianshu.com/p/2412d00a0ce4
export class PathAnimation extends Animation {
  path: Path|null = null;
  headDirection: Vec3 = new Vec3(0,1,0);
  nowDirection: Vec3 = new Vec3();
  preDirection: Vec3 = new Vec3(0,1,0)
  lastRotPosition: Vec3|null = null;
  isRotAuto: boolean = false;
  constructor(target: Object3d, _canStop: boolean) {
    super(target, _canStop);
  
  }


  applyTransformation(interpolatedTime){
    if(interpolatedTime >= 0 && interpolatedTime <= 1 && this.path !== null && this._target !== null) {
      let tmp:Vec3 = this.path.getPosition();
      let pos = tmp.clone();

      if(this.lastRotPosition == null && this.isRotAuto) {
        this.lastRotPosition = pos.clone();
      }

      if(this.isRotAuto) {
        let prepos:Vec3|undefined = this.lastRotPosition!.clone();

        let toler = 0.0001; // Radian
        this.nowDirection = pos.clone().sub(prepos!.x+0.0001, prepos!.y+0.0002, prepos!.z+0.0003);

        let dEquals = this.nowDirection.equals(this.preDirection, toler);// 待处理
        let dLength = this.nowDirection.length() >= toler;
        // 有转向且移动, 避免原地转向
        if(!dEquals && dLength) {
          let axis = this.preDirection.clone().cross(this.nowDirection.x, this.nowDirection.y, this.nowDirection.z);
          let angle = this.preDirection.angle(this.nowDirection) // 待处理

          this._target.rotate(axis, angle);
          this.lastRotPosition = pos.clone();
        }
      }
    }
  }

  setRotAuto(isRotAuto) {
    this.isRotAuto = isRotAuto;
  }

  setHeadDirection(direction){
    if(direction == null) return false;

    
    this.preDirection = this.headDirection;
    this.headDirection = direction.clone();

    return true;
  }

  getPath() {
    return this.path;
  }

  setPath(path) {
    if(path==null) return false;
    this.path = path;
    return true;
  }
}

class Path {
  pathName: string;
  controlPoints: number[] = [];
  constructor(){}

  getPosition(){ return new Vec3()}

  addControlPoint(){}

  generatePath(){}

  releaseResource(){}
}