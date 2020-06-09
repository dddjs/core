import { Object3d } from "../../core/Object3d";


export  class MeshBuild extends Object3d {
  constructor(name: string){
    super(name)

    this.build();
  }

  build(){
    return true;
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