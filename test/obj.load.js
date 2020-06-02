



export function objLoad(url, callback){
  let request = new XMLHttpRequest();
  request.onload = ()=>{
    let response = request.response;
    let lines=response.match(/^(v|vt|vn|f|g|o).*/mg);
    var meshes = []

    let sMesh = false;
    let curMesh ={
      v:[],
      vt:[],
      vn:[],
      ind:[],
      g:''
    };
    let cuV = 0,cuVn = 0, cuVt = 0;
    function splitFaceIndices(str) {
      var pieces = str.split('/');
      return({v: parseInt(pieces[0]) - cuV -1 ,
              vt: parseInt(pieces[1]) - cuVt -1,
              vn: parseInt(pieces[2]) - cuVn -1
          });
    }
    let v=[], vn=[], vt=[];
    lines.forEach(line=>{
      if(sMesh==false&&line.match(/^v\s+/)) {
        sMesh = true;
        cuV+=v.length;
        cuVt+=vt.length;
        cuVn+=vn.length;
        curMesh = {
          v:[],
          vt:[],
          vn:[],
          ind:[],
          g:''
        }
        v=[], vn=[], vt=[];
        meshes.push(curMesh)
      } else if(sMesh==true&&!line.match(/^v\s+/)){
        sMesh = false;
      }

      let r = line.split(/\s+/);
      let tp = r.shift();
      if(tp=="v") {
        // curMesh.v.push(+r[0],+r[1], +r[2]);
        v.push({
          x: +r[0],
          y: +r[1],
          z: +r[2],
        })
        // cuV++;
      } else if(tp=="vt") {
        // curMesh.vt.push(+r[0],+r[1]);
        vt.push({
          x: +r[0],
          y: +r[1],
          // z: +r[2],
        })
        // cuVt++;
      } else if(tp=="vn") {
        // curMesh.vn.push(+r[0],+r[1], +r[2]);
        vn.push({
          x: +r[0],
          y: +r[1],
          z: +r[2],
        })
        // cuVn++;
      } else if(tp=="f") {
        var inds1 = splitFaceIndices(r[0]);
        var indsi1 = splitFaceIndices(r[1]);
        
        // curMesh.ind.push(ind,ind+1)
        // debugger
        for (let i = 2, len = r.length; i < len; i++) {
          if(r[i]) {
            const indsi = splitFaceIndices(r[i]);
            let ind=curMesh.ind.length;
            curMesh.ind.push(ind);
            // debugger
            curMesh.v.push(v[inds1.v].x,v[inds1.v].y,v[inds1.v].z)
            if(inds1.vn>=0) {
              curMesh.vn.push(vn[inds1.vn].x,vn[inds1.vn].y,vn[inds1.vn].z)
            // } else {
            //   console.log(r, inds1)
            }
            if(inds1.vt>=0) {
              curMesh.vt.push(vt[inds1.vt].x,vt[inds1.vt].y)
            // } else {
            //   console.log(r, inds1)
            }

            curMesh.ind.push(ind+1);
            curMesh.v.push(v[indsi1.v].x,v[indsi1.v].y,v[indsi1.v].z)
            if(indsi1.vn>=0) {
              curMesh.vn.push(vn[indsi1.vn].x,vn[indsi1.vn].y,vn[indsi1.vn].z)
            // } else {
            //   console.log(r, indsi1)
            }
            if(indsi1.vt>=0) {
              curMesh.vt.push(vt[indsi1.vt].x,vt[indsi1.vt].y)
            // } else {
            //   console.log(r, indsi1)
            }

            curMesh.ind.push(ind+2);
            curMesh.v.push(v[indsi.v].x,v[indsi.v].y,v[indsi.v].z)
            if(indsi.vn>=0) {
              curMesh.vn.push(vn[indsi.vn].x,vn[indsi.vn].y,vn[indsi.vn].z)
            // } else {
            //   console.log(r, indsi)
            }
            if(indsi.vt>=0) {
              curMesh.vt.push(vt[indsi.vt].x,vt[indsi.vt].y)
            // } else {
            //   console.log(r, indsi)
            }

            indsi1 = indsi;
          }
          
        }

      } else if(tp=="g") {
        curMesh.g = r[0];
      } else if(tp=="o") {
        curMesh.g = r[0];
      }

    })

   
    console.log(meshes)
    callback&& callback(meshes)
  }

  request.open("GET", url, true)
  request.send();
}
