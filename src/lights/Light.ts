// 灯光的特性
/***
 * 运动
 * 颜色
 * 强度
 * 距离
 * 角度
 * 附着：漫反射
 * 所属：场景
 * 融合：多光源效果
*/

import { Object3d } from "../core/Object3d";
import { Vec3 } from '../math/Vec3';

export class Light extends Object3d {
  constructor(_name: string = "ddd-Light", _pos: Vec3 = new Vec3(0, 0, 0)){
    super(_name, _pos);
    this.mType = 'Light';
    this.isLight = true;
  }
  
}

// 环境光
export class AmbientLight extends Light {
  constructor(color: String){
    super('ambient-light')

    
  }
}

// 平行光
export class DirectionalLight extends Light {

}

// 点光源
export class PointLight extends Light {

}

// 聚光灯
export class SpotLight extends Light {

}

// 半球灯
export class HemisphericLight extends Light {

}

//
export class AreaLight extends Light {

}