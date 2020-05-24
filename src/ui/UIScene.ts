import { Color } from "../core/Color";
import { Object3d } from "../core/Object3d";
import {UIRender} from './UIRender';
import {UICamera} from './UICamera';

// https://baike.baidu.com/item/%E5%85%AB%E5%8F%89%E6%A0%91/5635733?fr=aladdin
// 八叉树就是用在3D空间中的场景管理，可以很快地知道物体在3D场景中的位置，或侦测与其它物体是否有碰撞以及是否在可视范围内。
export class UIScene {
  public camera: UICamera;
  // 场景视口
  public viewport: number[] = [0.0, 0.0, window.innerWidth, window.innerHeight];
  // 背景色
  public clearColor: Color = new Color(0.5, 0.5, 0.5, 0.9);
  public clearMask: number;
  public clearDepth: number;
  public depthFunc: number;

  public ambientColor: Color = new Color(1,1,1,1);

  public nodes: any[] = [];
  // 渲染目标池
  public pool: Object[] = [];
  constructor(render:UIRender) {
    // DEPTH_TEST: depthFunc
    // BLEND: blendFunc
    render.scenes.push(this)
  }

  //
  setClearColor(r:number=1, g:number=1, b:number=1, a:number=1){
    this.clearColor.r = r;
    this.clearColor.g = g;
    this.clearColor.b = b;
    this.clearColor.a = a;
  }

  setAmbientColor(r:number=1, g:number=1, b:number=1, a:number=1){
    this.ambientColor.r = r;
    this.ambientColor.g = g;
    this.ambientColor.b = b;
    this.ambientColor.a = a;
  }

  //
  getNodeById() {

  }

  getNodeByName() {

  }

  getNodeParent() {

  }

  getNodeParents() {

  }

  getNodeSiblings() {

  }

  walkTree(callback: Function) {
    this.nodes.forEach(node => {
      this.iterator(node, callback)
    });
  }

  iterator(node: Object3d, callback: Function) {
    if (!node) return;
    callback(node)
    node._children.forEach(obj => {
      this.iterator(obj, callback);
    });
  }

  find(node: Object3d) {
    let nodeIndex = this.nodes.indexOf(node);

    if (nodeIndex === -1) {
      return false;
    } else {
      return this.nodes[nodeIndex];
    }
  }

  add(node: Object3d) {
    if (this.find(node) === false) {
      this.nodes.push(node)
    } else {
      console.warn('has one same node here')
    }
  }

  remove(node: Object3d) {
    if (this.find(node) === false) {

      console.warn('has one same node here')
    } else {

      // del the node
    }
  }
}