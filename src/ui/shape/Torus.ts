import { Shape } from "./Shape";

export class Torus extends Shape {
  constructor(name: string = 'torus') {
    super(name)

    let data  = this.torus(32, 32, 1.0, 2.0)
    this._gemotry.setVertices(data.pos)

    this._gemotry.setNormals(data.nor)

    // this._gemotry.setColors(data.col)

    // this._gemotry.setTextCoords()

    this._gemotry.setIndices(data.idx)


  }

  torus(row:number=0, column:number=0, irad:number=0, orad:number=0){
		var pos = new Array(), nor = new Array(),
		    col = new Array(), idx = new Array();
		for(var i = 0; i <= row; i++){
			var r = Math.PI * 2 / row * i;
			var rr = Math.cos(r);
			var ry = Math.sin(r);
			for(var ii = 0; ii <= column; ii++){
				var tr = Math.PI * 2 / column * ii;
				var tx = (rr * irad + orad) * Math.cos(tr);
				var ty = ry * irad;
				var tz = (rr * irad + orad) * Math.sin(tr);
				var rx = rr * Math.cos(tr);
				var rz = rr * Math.sin(tr);
				pos.push(tx, ty, tz);
				nor.push(rx, ry, rz);
				// var tc = this.hsva(360 / column * ii, 1, 1, 1);
				// col.push(tc[0], tc[1], tc[2], tc[3]);
			}
		}
		for(i = 0; i < row; i++){
			for(ii = 0; ii < column; ii++){
				r = (column + 1) * i + ii;
				idx.push(r, r + column + 1, r + 1);
				idx.push(r + column + 1, r + column + 2, r + 1);
			}
		}
		return {pos, nor, col, idx};
	}
}