import { MeshBuild } from "./MeshBuild";
import { Vec3 } from "../../math/Vec3";


export class BoxMeshBuild extends MeshBuild {
  constructor(name:string, public width:number, public height:number, public depth:number, public widthSegments:number, public heightSegments:number, public depthSegments:number){//
    super(name);

    this.width = width || 1;
		this.height = height || 1;
		this.depth = depth || 1;

		// segments

		this.widthSegments = Math.floor( widthSegments ) || 1;
		this.heightSegments = Math.floor( heightSegments ) || 1;
    this.depthSegments = Math.floor( depthSegments ) || 1;
    

     // buffers
		const indices:number[] = [];
		const vertices:number[] = [];
		const normals:number[] = [];
		const uvs:number[] = [];

		// helper variables
		let numberOfVertices = 0;
    let groupStart = 0;
    
    // build each side of the box geometry
    let ret = []
		buildPlane( 'z', 'y', 'x', - 1, - 1, this.depth, this.height, this.width, this.depthSegments, this.heightSegments, 0 ); // px
		buildPlane( 'z', 'y', 'x', 1, - 1, this.depth, this.height, - this.width, this.depthSegments, this.heightSegments, 1 ); // nx
		buildPlane( 'x', 'z', 'y', 1, 1, this.width, this.depth, this.height, this.widthSegments, this.depthSegments, 2 ); // py
		buildPlane( 'x', 'z', 'y', 1, - 1, this.width, this.depth, - this.height, this.widthSegments, this.depthSegments, 3 ); // ny
		buildPlane( 'x', 'y', 'z', 1, - 1,this.width, this.height, this.depth, this.widthSegments, this.heightSegments, 4 ); // pz
    buildPlane( 'x', 'y', 'z', - 1, - 1, this.width, this.height, - this.depth, this.widthSegments, this.heightSegments, 5 ); // nz
    
    // build geometry

		this._gemotry.setIndices( indices );
		this._gemotry.setVertices(vertices );
		this._gemotry.setNormals( normals );
    this._gemotry.setTextCoords( uvs);

    console.log(this._gemotry)
    
    function  buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex){
      const segmentWidth = width / gridX;
        const segmentHeight = height / gridY;
  
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const depthHalf = depth / 2;
  
        const gridX1 = gridX + 1;
        const gridY1 = gridY + 1;
  
        let vertexCounter = 0;
        let groupCount = 0;
  
        const vector = new Vec3();
  
        // generate vertices, normals and uvs
  
        for ( let iy = 0; iy < gridY1; iy ++ ) {
  
          const y = iy * segmentHeight - heightHalf;
  
          for ( let ix = 0; ix < gridX1; ix ++ ) {
  
            const x = ix * segmentWidth - widthHalf;
  
            // set values to correct vector component
  
            vector[ u ] = x * udir;
            vector[ v ] = y * vdir;
            vector[ w ] = depthHalf;
  
            // now apply vector to vertex buffer
  
            vertices.push( vector.x, vector.y, vector.z );
  
            // set values to correct vector component
  
            vector[ u ] = 0;
            vector[ v ] = 0;
            vector[ w ] = depth > 0 ? 1 : - 1;
  
            // now apply vector to normal buffer
  
            normals.push( vector.x, vector.y, vector.z );
  
            // uvs
  
            uvs.push( ix / gridX );
            uvs.push( 1 - ( iy / gridY ) );
  
            // counters
  
            vertexCounter += 1;
  
          }
  
        }
  
        // indices
  
        // 1. you need three indices to draw a single face
        // 2. a single segment consists of two faces
        // 3. so we need to generate six (2*3) indices per segment
  
        for ( let iy = 0; iy < gridY; iy ++ ) {
  
          for ( let ix = 0; ix < gridX; ix ++ ) {
  
            const a = numberOfVertices + ix + gridX1 * iy;
            const b = numberOfVertices + ix + gridX1 * ( iy + 1 );
            const c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
            const d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;
  
            // faces
  
            indices.push( a, b, d );
            indices.push( b, c, d );
  
            // increase counter
  
            groupCount += 6;
  
          }
  
        }
  
        // add a group to the geometry. this will ensure multi material support
  
        // scope.addGroup( groupStart, groupCount, materialIndex );
  
        // calculate new start value for groups
  
        groupStart += groupCount;
  
        // update total number of vertices
  
        numberOfVertices += vertexCounter;
    }

  }

  build(){

   
    
    return true;
  }

  
}