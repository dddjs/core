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
  constructor(color: String, intensity ){
    super('ambient-light')

    
  }
}

// 平行光
export class DirectionalLight extends Light {
  // color — 环境光颜色；
  // intensity – 光照强度。
  constructor(color, intensity){
    super()
  }
}

// 点光源
export class PointLight extends Light {
// color — 环境光颜色；
// intensity – 光照强度；
// distance – 设置光距离物体的距离；
// decay – 设置光的衰减量。
  constructor(color,intensity,distance, decay){
    super()
  }
}

// 聚光灯
export class SpotLight extends Light {
  // angle — 聚光灯的张角；
  // exponent – 光强在偏离目标的衰减指数
  constructor(color, intensity, distance, angle, penumbra, decay){
    super()
  }
}

// 半球灯, 自然光线
export class HemisphericLight extends Light {
  // skyColor — 场景上方的光的颜色；
  // groundColor – 场景下方的光的颜色；
  // intensity – 光照强度。
  constructor(skyColor, groundColor, intensity){
    super()
  }
}

//
export class AreaLight extends Light {

}
