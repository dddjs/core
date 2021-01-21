const DDD = require("../src/index.ts");

var mycanvas = document.getElementById('my_Canvas')
var client = new DDD.UICanvas(mycanvas, {
  preserveDrawingBuffer: true
})

var render = new DDD.UIRender(client);
var scene = new DDD.UIScene(render);

var alight = new DDD.AmbientLight({color:new DDD.Color(1,0,0,1), intensity: 2.0})
var dlight = new DDD.DirectionalLight({color: new DDD.Color(1,0,0,1), intensity: 2.0, direct: new DDD.Vec3(.5, 0 ,-.5)})
scene.addLight(dlight);


var camera = new DDD.UICamera(scene);
window.camera = camera;
camera.viewport = [0, 0, 800, 800];

var box = new DDD.BoxMeshBuild('box', 1, 1, 1);
box.scaling(8, 8, 8)
// box.translateZ(10)
box._material = new DDD.UICubeTextureMaterial({
  images: [
    'assets/sky01/rt.jpg', // right
    'assets/sky01/lf.jpg', // left
    'assets/sky01/up.jpg', // top
    'assets/sky01/dn.jpg', // bottom
    'assets/sky01/bk.jpg', //back
    'assets/sky01/ft.jpg', // front
  ],
});
scene.add(box);

var plane = new DDD.Plane("plane", 1,1);
// plane.setPosition(0,0,0)
plane._material = new DDD.UITextureMaterial({
  image: "assets/miao256.jpg",
  flip: 1
})
// box._material.mode = 'lineloop';



scene.add(plane);

// camera._position.z = 3;
console.log(camera,box)
// box.rotateX(-0.1)
// box.rotateZ(-0.1)
var animate = function (time) {
  render.renderScene()

  // box.rotateY(-0.001)

  // box.scaling(1.02, 1.02, 1.02)

  // camera.rotateY(-0.001)

  // plane.translateZ(.0001);

  

  // console.log(camera._position)
  
  window.requestAnimationFrame(animate);
}
animate(0);

mycanvas.addEventListener('webgl', (e) => {
  console.log(e.webglX, e.webglY, e.webgldrag)
  if (e.webgldrag) {
    
  }

  // let r = scene2.findNodeByName("mod");

  // console.log(r);
  // if(e.webglke)
  if (e.webglkeydown) {
    // console.log(e.webglkeyCode, e.webglkey)
    switch (e.webglkey.toLocaleLowerCase()) {
      case 'arrowleft':
      case 'a':
        {
          // box2.translateX(-0.1)
          box.rotateY(0.01)
        }
        break;
      case 'arrowdown':
      case 's':
        {
          // box2.translateZ(-0.1)
          box.rotateX(-0.01)
        }
        break;
      case 'arrowright':
      case 'd':
        {
          box.rotateY(-0.01)
        }
        break;
      case 'arrowup':
      case 'w':
        {
          // box2.translateZ(0.1)
          box.rotateX(0.01)
        }
        break;
    }
  }

})