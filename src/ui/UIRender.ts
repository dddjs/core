import { UIScene } from './UIScene';
import Base from "../Base";
import { UICanvas } from "./UICanvas";
import { GLTools } from "../tools/GLTools";
import { UICamera } from './UICamera';

export class UIRender extends Base {
  public ctx: WebGLRenderingContext | null;
  
  public scenes: UIScene[] = [];

  public glmode: string = 'triangle';
  public drawArray: boolean = false;
  public isLineMode: boolean = false;
  constructor(public canvas: UICanvas) {
    super()
    this.ctx = canvas.ctx;

    var available_extensions = this.ctx!.getSupportedExtensions();
    console.log('可用的扩展', available_extensions)
    this.enableExtension(this.ctx);
  }

  enableExtension(gl){
    gl.getExtension("OES_standard_derivatives");
    gl.getExtension("OES_element_index_uint");
  }

  drawMode(mode: string, gl: WebGLRenderingContext) {
    let glmode = -1;
    switch (mode) {
      case 'point':
        glmode = gl.POINTS;
        break;
      case 'linestrip':
        glmode = gl.LINE_STRIP;//线带
        break;
      case 'lineloop':
        glmode = gl.LINE_LOOP; //线环
        break;
      case 'line':
        glmode = gl.LINES;//独立线
        break;
      case 'strip':
        glmode = gl.TRIANGLE_STRIP;// 三角形扇
        break;
      case 'fan':
        glmode = gl.TRIANGLE_FAN;// 三角形带
        break;
      case 'triangle':
        glmode = gl.TRIANGLES;// 独立三角形
        break;
      default:
        glmode = gl.TRIANGLE_FAN;
        break;
    }

    return glmode;
  }

  drawType(gl, dataType){
    let _type=-1;
    switch (dataType){
          
      case "Int8Array":
          _type = gl.UNSIGNED_BYTE;
          break;
      case "Uint8Array":
        _type = gl.UNSIGNED_BYTE;
          break;
      case "Int16Array":
        _type = gl.UNSIGNED_SHORT;
          break;
      case "Uint16Array":
        _type = gl.UNSIGNED_SHORT;
          break;
      case "Uint32Array":
        _type = gl.UNSIGNED_INT;
          break;
      case "Float32Array":
      default:
        _type = gl.UNSIGNED_INT;
    }
    return _type;
  }

  renderItem(gl: WebGLRenderingContext, item: any, scene:UIScene, camera:UICamera) {
    let ibo = item.ibo,
      obj = item.obj,
      material = obj._material;
    material.use();
    if (!!material === false) {
      console.warn(`${obj.name} needs the material`)
      return;
    }
    if (material.isReady === false) return;

    material.upload(scene, camera, obj);

    if(ibo) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    } else {
      // gl.bindBuffer(gl.ARRAY_BUFFER, material['config']['position']);
    }
    
    let drawMode = this.drawMode(material.mode, gl);
    gl.lineWidth(5);
    if (this.drawArray||obj._material.drawArray) {
      if (this.isLineMode || scene.isLineMode || ["line", 'lineloop', 'linestrip'].indexOf(material.mode)>-1 ) {
        
        if(["line", 'lineloop', 'linestrip'].indexOf(material.mode)>-1) {
          gl.drawArrays(drawMode, 0, 6);
          // gl.drawArrays(drawMode, 0, 3);
          // gl.drawArrays(drawMode, 0, 2); // 仅画一条线
        } else {
          gl.drawArrays(gl.LINES, 0, 6);
          // gl.drawArrays(gl.LINES, 0, 3);
          // gl.drawArrays(gl.LINES, 0, 2);
        }
        
      } else {
        gl.drawArrays(drawMode, 0, 6);
        // gl.drawArrays(drawMode, 0, 3);
        // gl.drawArrays(drawMode, 0, 2);
      }
    } else {
      let type =  this.drawType(gl, obj.indices.constructor.name)
      if (this.isLineMode || scene.isLineMode || ["line", 'lineloop', 'linestrip'].indexOf(material.mode)>-1 ) {
        // debugger
        if(["line", 'lineloop', 'linestrip'].indexOf(material.mode)>-1){
          gl.drawElements(drawMode, obj.indices.length, type, 0);//
        } else {
          gl.drawElements(gl.LINES, obj.indices.length, type, 0);
        }
      } else {
        gl.drawElements(drawMode, obj.indices.length, type, 0);//
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

  clean(gl: WebGLRenderingContext, scene:UIScene, camera: UICamera) {
    // gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CW)
    // let {clearColor} = scene;
    // gl.disable(gl.CULL_FACE);
    
    
    if(camera.isControlled) {
      let { clearColor,viewport} = scene;
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);
      gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
      gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    } else {
      let { clearColor,viewport} = camera;
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(viewport[0], viewport[1], viewport[2], viewport[3]);
      gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
      gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    }
    
    
    // gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    
    // gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
    // 开启隐藏面消除
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);
    
    
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
      
    scene.cameras.forEach(camera=>{
      // this.setViewport(gl, scene)
      this.clean(gl, scene, camera);
      scene.pool.forEach(item => {
        this.renderItem(gl, item, scene, camera);
      })
    })
   
  }

  renderScene() {
    if (!this.ctx) return;
    let gl = this.ctx;
    gl.enable(gl.CULL_FACE); // 背面踢除
    // gl.frontFace(gl.CW); 
    this.scenes.forEach(scene=>{
      if(scene.disabled) return;
      scene.walkTree((obj) => {
        let material = obj._material;
        if (!material || obj._renderInitial) return;
        material.init(gl, scene);
        obj._renderInitial = true;
        material.config['position'] = GLTools.createVBO(gl, obj.vertices||[], false, true);
        if(obj.normals&&obj.normals.length>0) {
          material.config['normal'] = GLTools.createVBO(gl, obj.normals||[], false, true);
        }
        if(obj.textCoords.length>0){
          material.config['textCoord'] = GLTools.createVBO(gl, obj.textCoords||[], false, true);
        }

        let ibo ;
        if(obj.indices.length>0){
          ibo = GLTools.createVBO(gl, obj.indices, true, true);
        } else {
          material.drawArray = true;
        }
    
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