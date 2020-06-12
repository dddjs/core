export class Gemotry {
  private _vertices: Float32Array;
  private _normals: Float32Array;
  // private _colors: Float32Array;
  private _textCoords: Float32Array;
  private _indices: Uint8Array|Uint16Array|Uint32Array;

  setVertices(data: number[] = []) {
    this._vertices = Array.isArray(data)?new Float32Array(data):data;
  }

  setNormals(data: number[] = []) {
    this._normals = Array.isArray(data)?new Float32Array(data):data;
  }

  // setColors(data: number[] = []) {
  //   this._colors = new Float32Array(data)
  // }

  setTextCoords(data: number[] = []) {
    
    this._textCoords = Array.isArray(data)?new Float32Array(data):data;
  }

  setIndices(data: number[] = []) {
    this._indices = Array.isArray(data)?new Uint16Array(data):data;
  }

  get vertices() {
    return this._vertices;
  }

  get normals() {
    return this._normals;
  }

  // get colors() {
  //   return this._colors;
  // }

  get textCoords() {
    return this._textCoords;
  }

  get indeices() {
    return this._indices;
  }
}