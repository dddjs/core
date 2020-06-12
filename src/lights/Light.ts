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



  // // 法向量归一化
  //   vec3 normal = normalize(v_normal);
  //   // 计算环境光反射颜色
  //   vec3 ambient = u_ambientColor * u_color.rgb;

  //   // 第一个光源:平行光
  //   vec3 lightDirection = normalize(u_lightPosition);
  //   // 计算法向量和光线的点积
  //   float cosTheta = max(dot(lightDirection, normal), 0.0);


  //   // 计算漫反射光的颜色
  //   vec3 diffuse = u_lightColor  * cosTheta * u_color.rgb;


  //   // 宾氏模型高光
  //   float shininess =100.0;
  //   vec3 specularColor =vec3(1.0,1.0,1.0);
  //   vec3 viewDirection = normalize(u_viewPosition-v_position);
  //   vec3 halfwayDir = normalize(lightDirection + viewDirection);
  //   float specularWeighting = pow(max(dot(normal, halfwayDir), 0.0), shininess);
  //   vec3 specular = specularColor.rgb * specularWeighting * step(cosTheta,0.0);

  //   // 第二个光源:点光源
  //   vec3 lightDirection2 = normalize(u_lightPosition2 - v_position.xyz);
  //   // 计算法向量和光线的点积
  //   float cosTheta2 = max(dot(lightDirection2, normal), 0.0);
  //   // 计算漫反射光的颜色
  //   vec3 diffuse2 = u_lightColor * cosTheta2 * u_color.rgb;

  //   // 冯氏模型高光
  //   float shininess2 =30.0;
  //   vec3 specularColor2 =vec3(1.0,1.0,1.0);
  //   vec3 reflectionDirection = reflect(-lightDirection2, normal);
  //   float specularWeighting2 = pow(max(dot(reflectionDirection, viewDirection), 0.0), shininess2);
  //   vec3 specular2 = specularColor2.rgb * specularWeighting2 * step(cosTheta,0.0);

  //   // 两个光源亮度相加
  //   gl_FragColor = vec4((ambient+diffuse+diffuse2)+specular+specular2,u_color.a);
