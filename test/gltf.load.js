

function getArrayBuffer(imgUrl) {
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

export function load(gl, url, callback){
  let request = new XMLHttpRequest();
  console.log(gl.FLOAT)
  request.onload = async ()=>{
    let response = request.response;
    let meshes = [];

    let gltf = JSON.parse(response)

    let buffers =  await Promise.all(
      gltf.buffers.map(async (b) => await getArrayBuffer( b.uri)
    ))

    function getComponentSize(componentType)
    {
        switch (componentType)
        {
        case gl.BYTE:
        case gl.UNSIGNED_BYTE:
            return 1;
        case gl.SHORT:
        case gl.UNSIGNED_SHORT:
            return 2;
        case gl.UNSIGNED_INT:
        case gl.FLOAT:
            return 4;
        default:
            return 0;
        }
    }

    function getData( gltf, primitive, w) {  
      let data = [];
       if(primitive>=0) {
  
        let accessor=gltf.accessors[primitive]
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const buffer = buffers[bufferView.buffer];
        const byteOffset = accessor.byteOffset + bufferView.byteOffset;
        const componentSize = getComponentSize(accessor.componentType);
        let componentCount = accessorSizes[accessor.type];
        if(bufferView.byteStride > 0)
        {
          componentCount = bufferView.byteStride / componentSize;
        }

        const arrayLength =  accessor.count * componentCount;
        
        
        switch (accessor.componentType){
          
          case gl.BYTE:
              data = new Int8Array(buffer, byteOffset, arrayLength);
              break;
          case gl.UNSIGNED_BYTE:
              data = new Uint8Array(buffer, byteOffset, arrayLength);
              break;
          case gl.SHORT:
              data = new Int16Array(buffer, byteOffset, arrayLength);
              break;
          case gl.UNSIGNED_SHORT:
              data = new Uint16Array(buffer, byteOffset, arrayLength);
              break;
          case gl.UNSIGNED_INT:
              data = new Uint32Array(buffer, byteOffset, arrayLength);
              break;
          case gl.FLOAT:
              data = new Float32Array(buffer, byteOffset, arrayLength);
              break;
        }

        // if(w)
        // console.log(accessor.componentType, gl.UNSIGNED_BYTE, gl.UNSIGNED_SHORT, gl.UNSIGNED_INT)
      } 
      
      return data;
    } 
    
    gltf.meshes.forEach((mesh,index) => {
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
