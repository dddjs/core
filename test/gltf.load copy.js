

function getBase64(imgUrl) {
  return new Promise((res)=>{
    window.URL = window.URL || window.webkitURL;
    var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      // 至关重要
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response;
          //  把blob转成base64
          let fr = new FileReader();
          fr.onload = function (e) { 
            res(e.target.result)
          };
          fr.readAsArrayBuffer(blob);
        }
    }
    xhr.send();
  })
}

const accessorSizes = {
  'SCALAR': 1,
  'VEC2': 2,
  'VEC3': 3,
  'VEC4': 4,
  'MAT2': 4,
  'MAT3': 9,
  'MAT4': 16
}

export function load(url, callback){
  let request = new XMLHttpRequest();
  request.onload = async ()=>{
    let response = request.response;
    let meshes = [];

    let gltf = JSON.parse(response)

    let buffers =  await Promise.all(
      gltf.buffers.map(async (b) => await getBase64( b.uri)
    ))

    function getData( gltf, primitive) {      
      let accessor=gltf.accessors[primitive]
      const bufferView = gltf.bufferViews[accessor.bufferView];

      return accessor.componentType==5126?
      new Float32Array(buffers[0], (accessor.byteOffset || 0) + (bufferView.byteOffset || 0) , accessor.count*accessorSizes[accessor.type]):
      new Int16Array(buffers[0], (accessor.byteOffset || 0) + (bufferView.byteOffset || 0), accessor.count*accessorSizes[accessor.type]);
    } 
    
    gltf.meshes.forEach(mesh => {
      let name = mesh.name;

      let curMesh = {
        g:name,
        v:[],
        vt:[],
        vn:[],
        ind:[],
      }
      
      curMesh.v = getData( gltf , mesh.primitives[0].attributes['POSITION']);
      curMesh.vn = getData(gltf, mesh.primitives[0].attributes['NORMAL']);
      curMesh.vt = getData( gltf, mesh.primitives[0].attributes['TEXCOORD_0']);
      curMesh.ind = getData( gltf, mesh.primitives[0]['indices']);

      meshes.push(curMesh)

    })

    console.log(meshes)
    callback&& callback(meshes)
  }

  request.open("GET", url, true)
  request.send();
}
