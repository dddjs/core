import { Shape } from "./Shape";

export class Box extends Shape {
  constructor(name: string = 'box', public width:number = 2, public height:number = 2, public depth:number = 2, public widthSegments:number = 1, public heightSegments:number = 1, public depthSegments:number = 1) {
    super(name)
    this._gemotry.setVertices([
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0
    ])

    // this._gemotry.setColors([
    //   5, 3, 7, 1, 5, 3, 7, 1, 5, 3, 7, 1, 5, 3, 7, 1,
    //   1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1,
    //   0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
    //   1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
    //   1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
    //   0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
    // ])

    this._gemotry.setNormals([
      0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,//z轴正方向——面1
    1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,//x轴正方向——面2
    0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,//y轴正方向——面3
    -1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,//x轴负方向——面4
    0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,//y轴负方向——面5
    0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1//z轴负方向——面6

      

      // 0.0, -1.0,  0.0,
      // 0.0, -1.0,  0.0,
      // 0.0, -1.0,  0.0,
      // 0.0, -1.0,  0.0,

      // 1.0,  0.0,  0.0,
      // 1.0,  0.0,  0.0,
      // 1.0,  0.0,  0.0,
      // 1.0,  0.0,  0.0,

      // -1.0,  0.0,  0.0,
      // -1.0,  0.0,  0.0,
      // -1.0,  0.0,  0.0,
      // -1.0,  0.0,  0.0,

      // 0.0,  0.0,  1.0,
      // 0.0,  0.0,  1.0,
      // 0.0,  0.0,  1.0,
      // 0.0,  0.0,  1.0,

      // 0.0,  0.0, -1.0,
      // 0.0,  0.0, -1.0,
      // 0.0,  0.0, -1.0,
      // 0.0,  0.0, -1.0,

      // 0.0,  1.0,  0.0,
      // 0.0,  1.0,  0.0,
      // 0.0,  1.0,  0.0,
      // 0.0,  1.0,  0.0,
    ])

    this._gemotry.setTextCoords([
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
      1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
    ])

    this._gemotry.setIndices([
      0, 1, 2, 
      0, 2, 3, 
      4, 5, 6, 
      4, 6, 7, 
      
      8, 9, 10, 
      8, 10, 11, 
      12, 13, 14, 
      12, 14, 15, 16, 17, 18, 16, 18, 19, 20,
      21, 22, 20, 22, 23
    ])


    widthSegments = Math.floor( widthSegments ) || 1;
		heightSegments = Math.floor( heightSegments ) || 1;
    depthSegments = Math.floor( depthSegments ) || 1;
    

  }

  buildMesh(){

    
    return {
      v:[],
      vt:[],
      vn:[],
      ind:[],
    }
  }

}