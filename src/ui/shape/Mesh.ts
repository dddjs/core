import { Object3d } from "../../core/Object3d";

export class Mesh extends Object3d {
  constructor(name: string = 'plan', v, vn, vt, ind) {
    super(name)

    // console.log(arguments,name)
    this._gemotry.setVertices(v)

    this._gemotry.setTextCoords(vt)
    this._gemotry.setNormals(vn)

    this._gemotry.setIndices(ind)
  }

  public get vertices() {
    return this._gemotry.vertices;
  }

  public get indices() {
    return this._gemotry.indeices;
  }

  public get normals(){
    return this._gemotry.normals;
  }

  // public get colors() {
  //   return this._gemotry.colors;
  // }

  public get textCoords() {
    return this._gemotry.textCoords;
  }
}