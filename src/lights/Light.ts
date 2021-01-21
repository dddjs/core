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
import { Color } from "../core/Color";

export class Light extends Object3d {
public color:Color = new Color(1,1,1,1);
public intensity:number = 1.0;
constructor({name="", position=new Vec3(),  color, intensity}){
    super("light", position);
    this.mType = 'Light';
    this.isLight = true;
  }

  getColor(){
    return [this.color.r, this.color.g, this.color.b, this.color.a]
  }

  getDirection(){}

  getIntensity() {
    return this.intensity;
  }
}

// 环境光
export class AmbientLight extends Light {
  constructor({color, intensity} ){
    super({name: 'ambient-light', color, intensity})
  }

}

// 平行光
export class DirectionalLight extends Light {
  // color — 环境光颜色；
  // intensity – 光照强度。
  public direct: Vec3;
  constructor({color, intensity, direct} ){
    super({name: 'direct-light', color, intensity})
    this.direct = direct;
  }

  getDirection(){
    return [this.direct.x, this.direct.y, this.direct.z];
  }
}

// 点光源
export class PointLight extends Light {
// color — 环境光颜色；
// intensity – 光照强度；
// distance – 设置光距离物体的距离；
// decay – 设置光的衰减量。
  constructor(color,intensity,distance, decay){
    super({name: 'point-light', color, intensity})
  }
}

// 聚光灯
export class SpotLight extends Light {
  // angle — 聚光灯的张角；
  // exponent – 光强在偏离目标的衰减指数
  constructor(color, intensity, distance, angle, penumbra, decay){
    super({name: 'spot-light', color, intensity})
  }
}

// 半球灯, 自然光线
export class HemisphericLight extends Light {
  // skyColor — 场景上方的光的颜色；
  // groundColor – 场景下方的光的颜色；
  // intensity – 光照强度。
  constructor(skyColor, groundColor, intensity){
    super({name: 'hemispheric-light', color, intensity})
  }
}

//
export class AreaLight extends Light {
  constructor(){
    super({name: 'area-light'})
  }
}
