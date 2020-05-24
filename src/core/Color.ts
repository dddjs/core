import Base from "../Base";

// webgl 颜色【0-1】，真【0-255】
export class Color extends Base {
  elements: number[];
  constructor( r: number = 1, g: number = 1, b: number = 1, a: number = 1) {// 默认白色
    super()

    this.elements = [r,g,b,a];
  }

  get r(){
    return this.elements[0];
  }

  set r(val:number){
    this.elements[0] = val;
  }

  get g(){
    return this.elements[1];
  }

  set g(val:number){
    this.elements[1] = val;
  }

  get b(){
    return this.elements[2];
  }

  set b(val:number){
    this.elements[2] = val;
  }

  get a(){
    return this.elements[3];
  }

  set a(val:number){
    this.elements[3] = val;
  }

  //

  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  toString() {
    return `Color(${this.r}${this.g}${this.b}${this.a})`;
  }
}