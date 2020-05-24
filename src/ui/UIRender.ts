import { UIScene } from './UIScene';
import Base from "../Base";
import { UICanvas } from "./UICanvas";
import { GLTools } from "../tools/GLTools";

export class UIRender extends Base {
  public ctx: WebGLRenderingContext | null;
  
  public scenes: UIScene[] = [];

  public glmode: string = 'triangle';
  public drawArray: boolean = false;
  public isLineMode: boolean = false;
  constructor(public canvas: UICanvas) {
    super()
    this.ctx = canvas.ctx;
  }

  // getTargetMatrix(obj) {
  //   if (obj._parent) {
  //     return obj._modelMatrix.clone().rightDot(this.getTargetMatrix(obj._parent))
  //   }
  //   return obj._modelMatrix;
  // }

  drawMode(mode: string, gl: WebGLRenderingContext) {
    let glmode = -1;
    switch (mode) {
      case 'point':
        glmode = gl.POINTS;
        break;
      case 'linestrip':
        glmode = gl.LINE_STRIP;
        break;
      case 'lineloop':
        glmode = gl.LINE_LOOP;
        break;
      case 'line':
        glmode = gl.LINES;
        break;
      case 'strip':
        glmode = gl.TRIANGLE_STRIP;
        break;
      case 'fan':
        glmode = gl.TRIANGLE_FAN;
        break;
      case 'triangle':
        glmode = gl.TRIANGLES;
        break;
      default:
        glmode = gl.TRIANGLES;
        break;
    }

    return glmode;
  }


  renderItem(gl: WebGLRenderingContext, item: any, scene:UIScene) {
    let ibo = item.ibo,
      obj = item.obj,
      material = obj._material;
    material.use();
    if (!!material === false) {
      console.warn(`${obj.name} needs the material`)
      return;
    }
    if (material.isReady === false) return;

    material.upload(scene, obj);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    let drawMode = this.drawMode(material.mode, gl);
    if (this.drawArray) {
      if (this.isLineMode || obj._material.isLineMode) {
        gl.lineWidth(5);
        gl.drawArrays(gl.LINES, 0, 6);
      } else {
        gl.drawArrays(drawMode, 0, 6);
      }
    } else {
      if (this.isLineMode || obj._material.isLineMode) {
        gl.lineWidth(5);
        gl.drawElements(gl.LINES, obj.indices.length, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawElements(drawMode, obj.indices.length, gl.UNSIGNED_SHORT, 0);
      }
    }
  }

  setViewport(gl: WebGLRenderingContext, scene:UIScene) {
    // gl.enable(gl.CULL_FACE);
    // gl.frontFace(gl.CW)
    let { clearColor,viewport} = scene;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);
    gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
  }

  clean(gl: WebGLRenderingContext, scene:UIScene) {
    // gl.enable(gl.CULL_FACE);
    // gl.frontFace(gl.CW)
    // let {clearColor} = scene;
    let { clearColor,viewport} = scene;
    gl.enable(gl.SCISSOR_TEST);
    
    gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);
    gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    
    // gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    // gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    // 开启隐藏面消除
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    
    gl.clearDepth(1.0);
    // gl.clearStencil(0);

    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// gl.STENCIL_BUFFER_BIT
    // void gl.colorMask(red, green, blue, alpha);
    gl.disable(gl.SCISSOR_TEST);
    // // 启用多边形偏移，避免深度冲突
    // gl.enable(gl.POLYGON_OFFSET_FILL);
    // //设置偏移量
    // gl.polygonOffset(1.0, 1.0);
  }

  render(scene:UIScene) {
    if (this.ctx === null) return;
    let gl = this.ctx;
      this.clean(gl, scene);
    // this.scenes.forEach(scene=>{
      // this.setViewport(gl, scene)
      scene.pool.forEach(item => {
        this.renderItem(gl, item, scene);
      })
    // })
   
  }

  renderScene() {
    if (!this.ctx) return;
    let gl = this.ctx;
    // this.clean(gl,null);
    this.scenes.forEach(scene=>{
      scene.walkTree((obj) => {
        let material = obj._material;
        if (!material || obj._renderInitial) return;
        material.init(gl);
        obj._renderInitial = true;
        material.config['position'] = GLTools.createVBO(gl, obj.vertices, false, true);
        // material.config['color'] = GLTools.createVBO(gl, obj.colors, false, true);
        if(obj.normals&&obj.normals.length>0) {
          material.config['normal'] = GLTools.createVBO(gl, obj.normals, false, true);
        }
        if(obj.textCoords.length>0){
          material.config['a_TextCoord'] = GLTools.createVBO(gl, obj.textCoords, false, true);
        }
        
        let ibo = GLTools.createVBO(gl, obj.indices, true, true);
        scene.pool.push({
          obj,
          ibo,
          name: obj.name,
        });
      })
      this.render(scene)
    })
    
  }

  clone() {
  }

  toString() {
    return '()';
  }
}