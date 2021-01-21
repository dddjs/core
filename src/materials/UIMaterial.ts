import { GLTools } from "../tools/GLTools";
import { UIScene } from "../ui/UIScene";
import { UICamera } from "../ui/UICamera";

export class UIMaterial {
  // color
  public shader: any | null = null;

  public ctx: WebGLRenderingContext;
  public vertShader: WebGLShader | null;
  public fragShader: WebGLShader | null;
  public program: WebGLProgram | null;
  public locations: Object = {};

  public isReady: boolean = false;
  public drawArray: boolean = false;
  public isLineMode: boolean = false;// 绘制模式
  public mode: String = 'triangle';

  public config: object;
  constructor( config: object = {}) {
    this.config = {
      // uColor: new Color(128/255.0,128/255.0,128/255.0,1),
      // uAmbientColor: new Color(1,1,1,1),
      // aBarycentric: new Float32Array([1,0,0, 1,1,0, 0,0,1, 0,0,0]),
      ...config
    }
  }

  shaderSource(scene: UIScene) {
    // let vert = `
    // uniform vec4 uColor;
    
    // varying vec4 vColor;`,
    //   vertMain = "vColor = uColor;",
    //   frag = "varying vec4 vColor;",
    //   fragMain = "gl_FragColor = vColor;";

    // this.shader = new SimpleChunk(scene,vert, vertMain, frag, fragMain)
  }

  handle() {
    this.isReady = true;
  }

  init(ctx: WebGLRenderingContext, scene: UIScene) {
    this.ctx = ctx;
    this.shaderSource(scene)
    if (!this.shader) return;
    // this.config.aBarycentric = GLTools.createVBO(ctx, this.config.aBarycentric, false, true);
    this.vertShader = GLTools.createShader(ctx, this.shader.vertSource, ctx.VERTEX_SHADER);
    this.fragShader = GLTools.createShader(ctx, this.shader.fragSource, ctx.FRAGMENT_SHADER);
    if (this.vertShader && this.fragShader) {
      this.program = GLTools.createProgram(ctx, this.vertShader, this.fragShader)
    }
    this.analySource(this.shader.vertSource);
    this.analySource(this.shader.fragSource);
    this.handle()
  }

  analySource(source: string) {
    let shaderTypeReg = /(attribute|uniform)\s\S+\s\S+;/g;
    // 标准化 shader
    // 斩掉单行注释和多行注释
    source = source.replace(/\/\/[^]*?\n/g, "").replace(/\/\*[^]*?\*\//g, '')
    let format = source.replace(/[\s]+/g, ' ');
    // 去 换行
    format = format.replace(/[\r\n]/g, "");
    // 去 首尾空格
    format = format.replace(/(^\s*)|(\s*$)/g, "")
    // 去 ; 左右空格
    format = format.replace(/\s*;\s*/g, ';');
    let matchs = format.match(shaderTypeReg);
    matchs && matchs.forEach(record => {
      record = record.replace(';', '');
      let ret = record.split(' ');
      let value: WebGLUniformLocation | null = null;
      if (ret[0] === "uniform") {
        value = this.getUniformLocation(ret[2]);
      } else if (ret[0] === "attribute") {
        value = this.getAttribLocation(ret[2]);
      }
      if (value !== null) {
        this.locations[ret[2]] = {
          prefix: ret[0],// uniform, attribute
          type: ret[1], // bool, ivec, bvec, vec
          value: value // 在shader 中 位置
        }
      } else {
        // throw new Error()
        console.error(`${record}; declared but its value is never read`)
      }
    })
  }

  getUniformLocation(name: string) {
    if (this.program) {
      return this.ctx.getUniformLocation(this.program, name);
    }
    return null;
  }

  getAttribLocation(name: string) {
    if (this.program) {
      return this.ctx.getAttribLocation(this.program, name);
    }
    return null;
  }

  use() {
    this.ctx.useProgram(this.program);
    if (this.config['dynamic'] === true) this.handle()
  }

  location(name: string) {
    return this.locations[name] && this.locations[name].value;
  }

  upload(scene: UIScene, camera:UICamera, obj) {
    for (const item in this.locations) {
      if (this.locations.hasOwnProperty(item)) {
        switch (item) {
          case 'Pmatrix': {
            this.uploadItem(item, camera!._projectMatrix.elements)
          }
            break;
          case 'Vmatrix': {
            this.uploadItem(item, camera!.viewMatrix.elements)
          }
            break;
          case 'Mmatrix': {
            this.uploadItem(item, obj.getMatrixOnWorld().elements)
          }
            break;
          case 'invMatrix': {
            // 法线矩阵：模型矩阵逆转置矩阵
            let mMat = obj.getMatrixOnWorld();
            let invMatrix = mMat.clone().inverse().transpose();
            this.uploadItem(item, invMatrix.elements)
          }break;
          case 'uViewPosition':{
            this.uploadItem(item, camera._position.elements)
          } break;
          case 'uColor':{
            this.uploadItem(item, this.config[item].elements)
          } break;
          case 'uAmbientColor':{
            this.uploadItem(item, scene.ambientColor.elements)
          } break;
          // 雾化
          case 'uFogColor':{
            this.uploadItem(item, [.0,.5,.5])// [.137,.231,.423]
          } break;
          case 'uFogDist':{
            this.uploadItem(item, [25,44])
          } break;
          // 平行光
          case 'uDirLightDirection':{
            this.uploadItem(item, [0, 0.6, -.5])
          } break;
          case 'uDirLightColor':{
            this.uploadItem(item, [.5,.5,.5])
          } break;
          case 'uDirLightSpecularColor':{
            this.uploadItem(item, [1,1,1])
          } break;
          case 'uDirLightShininess':{
            this.uploadItem(item, .01)
          } break;

          // 点光
          case 'uPointLightPosition':{
            this.uploadItem(item, [0, .6, 1])
          } break;
          case 'uPointLightColor':{
            this.uploadItem(item, [1,1,1])
          } break;
          case 'uPointLightSpecularColor':{
            this.uploadItem(item, [0,1,1])
          } break;
          case 'uPointLightShininess':{
            this.uploadItem(item, 100)
          } break;
          case 'uPointLightDistance':{
            this.uploadItem(item, 1)
          } break;
          // 聚光灯
          case 'uSpotLightPosition':{
            this.uploadItem(item, [0, .8, 1])
          } break;
          case 'uSpotLightDirection':{
            this.uploadItem(item, [0, .8, -1])
          } break;
          case 'uSpotLightColor':{
            this.uploadItem(item, [1,0,0])
          } break;
          case 'uSpotLightSpecularColor':{
            this.uploadItem(item, [0,1,1])
          } break;
          case 'uSpotLightShiness':{
            this.uploadItem(item, 100)
          } break;
          case 'uSpotLightDistance':{
            this.uploadItem(item, 1)
          } break;
          case 'uSpotLightCutOff':{//锥形体的夹角
            this.uploadItem(item, 20)
          } break;
          // 线光源
          case 'uLineLightPosition1':{
            this.uploadItem(item, [-1, 1, .8])
          }break;
          case 'uLineLightPosition2':{
            this.uploadItem(item, [1, 1, .8])
          }break;
          case 'uLineLightDirection':{
            this.uploadItem(item, [.0, .2, -1])
          } break;
          case 'uLineLightColor':{
            this.uploadItem(item, [1, 1, 1])
          } break;
          case 'uLineLightCutOff':{
            this.uploadItem(item, 5)
          } break;
          // 面光源
          case 'uAreaLightPosition':{
            this.uploadItem(item, [-1, 1, .8])
          }break;
          case 'uAreaLightWidth':{
            this.uploadItem(item, 1)
          }break;
          case 'uAreaLightHeight':{
            this.uploadItem(item, 1)
          }break;
          case 'uAreaLightDirection':{
            this.uploadItem(item, [.0, .2, -1])
          } break;
          case 'uAreaLightColor':{
            this.uploadItem(item, [1, 1, 1])
          } break;
          // case 'uAreaLightCutOff':{
          //   this.uploadItem(item, 5)
          // } break;

          default: {
            this.uploadItem(item, this.config[item])
          }
        }
      }
    }
  }

  uploadItem(name: string, v) {
    let gl = this.ctx;
    let location = this.locations[name],
      prefix = location.prefix,
      type = location.type;

      switch (type) {
      case 'bool':
      case 'int':
      case 'float': {
        if (prefix == 'attribute') {
          gl.bindBuffer(gl.ARRAY_BUFFER, v);
          gl.vertexAttribPointer(location.value, 1, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(location.value);
        } else {
          gl.uniform1f(location.value, v);
        }
      } break;
      case 'vec2':
      case 'bvec2':
      case 'ivec2': {
        if (prefix == 'attribute') {
          gl.bindBuffer(gl.ARRAY_BUFFER, v);
          gl.vertexAttribPointer(location.value, 2, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(location.value);
        } else {
          gl.uniform2fv(location.value, v);
        }
      } break;

      case 'vec3':
      case 'bvec3':
      case 'ivec3': {
        if (prefix == 'attribute') {
          gl.bindBuffer(gl.ARRAY_BUFFER, v);
          gl.vertexAttribPointer(location.value, 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(location.value);
        } else {
          gl.uniform3fv(location.value, v);
        }
      } break;
      case 'vec4':
      case 'bvec4':
      case 'ivec4': {
        if (prefix == 'attribute') {
          gl.bindBuffer(gl.ARRAY_BUFFER, v);
          gl.vertexAttribPointer(location.value, 3, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(location.value);
        } else {
          gl.uniform4fv(location.value, v);
        }
      } break;
      case 'mat2': {
        gl.uniformMatrix2fv(location.value, false, v)
      } break;
      case 'mat3': {
        gl.uniformMatrix3fv(location.value, false, v)
      } break;
      case 'mat4': {
        gl.uniformMatrix4fv(location.value, false, v)
      } break;
      case 'sampler2D':
        if (v) {
          gl.activeTexture(gl.TEXTURE0 + v.unit);
          gl.bindTexture(gl.TEXTURE_2D, v);
          gl.uniform1i(location.value, v.unit);
        } break;
      case 'samplerCube':
        if (v) {
          gl.activeTexture(gl.TEXTURE0 + v.unit);
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, v);
          gl.uniform1i(location.value, v.unit);
        } break;
      default:
        throw new TypeError('')
    }
  }

}