const DDD = require("../src/index.ts");

var client = new DDD.UICanvas(document.getElementById('my_Canvas'), {
  preserveDrawingBuffer: true
})

var render = new DDD.UIRender(client);
var scene = new DDD.UIScene(render);

var alight = new DDD.AmbientLight({color:new DDD.Color(1,0,0,1), intensity: 2.0})
var dlight = new DDD.DirectionalLight({color: new DDD.Color(1,0,0,1), intensity: 2.0, direct: new DDD.Vec3(.5, 0 ,-.5)})
scene.addLight(dlight);


var camera = new DDD.UICamera(scene);
window.camera = camera;
camera.viewport = [0, 0, window.innerWidth, window.innerHeight];


// scene.add(center)
// scene.add(light);
var mesh1 = new DDD.Mesh("mesh1", [

  // 0.0, 1.0, 0.0,//上顶点
  // -1.0, -1.0, 0.0,//左顶点
  // // 1.0, -1.0, 0.0

  -0.7,-0.1,0,
  -0.3,0.6,0,
  -0.3,-0.3,0,
  0.2,0.6,0,
  0.3,-0.3,0,
  0.7,0.6,0

  // -.5, -.3,  0,
  // .5,  -.3,  0,
  // .5,   .3,  0,
  // -.5,   .3,  0

],[
  // 0,0,0,
  // 0,0,0,
  // 0,0,0,
  // 0,0,0,
  // 0,0,0,
  // 0,0,0,
],[],[
  // 0, 1, 2,
  //   0, 2, 3
])
mesh1._material = new DDD.UIColorMaterial({
  uColor: new DDD.Color(1,0,0,1)
})

// mesh1._material.mode = 'linestrip'
// scene.isLineMode = true;
scene.add(mesh1)

var animate = function (time) {
  render.renderScene()
  
  window.requestAnimationFrame(animate);
}
animate(0);
