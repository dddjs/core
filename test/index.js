const gltfLoader = require('./gltf.load.js');
const loader = require('./obj.load.js');
const DDD = require("../src/index.ts");




// canvas-->image
function convertCanvasToImage(canvas) {
  //新Image对象,可以理解为DOM;
  var image = new Image();
  //canvas.toDataURL返回的是一串Base64编码的URL,当然,浏览器自己肯定支持
  //指定格式PNG
  image.src = canvas.toDataURL("image/jpeg");
  return image;
}



var mycanvas = document.getElementById('my_Canvas');
var client = new DDD.UICanvas(mycanvas, {
  preserveDrawingBuffer: true
})


// camera.translateX(-1)
var render = new DDD.UIRender(client);

var scene2 = new DDD.UIScene(render);
var scene = new DDD.UIScene(render);

scene2.disabled = true;

// scene.viewport = [0,0,window.innerWidth/2.0, window.innerHeight]
// scene.isLineMode = true;//

// scene2.viewport = [window.innerWidth/2.0, 0, window.innerWidth/2.0, window.innerHeight]
// scene2.viewport = [window.innerWidth/2.0, 0, window.innerWidth/2.0, window.innerHeight]
// scene2.clearColor = new DDD.Color()
// scene2.setClearColor(1,0,0,1)
// scene.setAmbientColor(.8,0.8,0.8,1)
// scene.ambientColor = new DDD.Color(.8,0.8,0.8,1)//(0,0,0,1);//
// scene2.clearColor
// scene2.add(center)

var alight = new DDD.AmbientLight({color:new DDD.Color(1,0,0,1), intensity: 2.0})
var dlight = new DDD.DirectionalLight({color: new DDD.Color(1,0,0,1), intensity: 2.0, direct: new DDD.Vec3(.5, 0 ,-.5)})
scene.addLight(dlight);

var camera2 = new DDD.UICamera(scene2);
var camera2_1 = new DDD.UICamera(scene2);
var camera = new DDD.UICamera(scene);
window.camera = camera;

camera.viewport = [0, 0, window.innerWidth, window.innerHeight];
camera2.viewport = [0, 0, window.innerWidth, window.innerHeight];
camera2_1.viewport = [window.innerWidth-100, 0, 100, 100];
// camera2_1.rotateY(1, true);
camera2_1.rotateOnWorldAxis( DDD.Vec3.X, Math.PI/2.0)
camera2_1.lookAt(0,0,0)


// scene2.camera = camera;
gltfLoader.load(client.ctx,'./plane.gltf', (meshes)=>{
  // gltfLoader.load(client.ctx,'./Squirtle.gltf', (meshes)=>{
  // gltfLoader.load(client.ctx,'./jian/index.gltf', (meshes)=>{
    // gltfLoader.load(client.ctx,'./elphant/index.gltf', (meshes)=>{
    // gltfLoader.load(client.ctx,'./pcube.gltf', (meshes)=>{
      // gltfLoader.load('./gubi/index.gltf', (meshes)=>{
// loader.objLoad('./elphant/index.obj', (meshes)=>{
  // loader.objLoad('./Squirtle.obj', (meshes)=>{
  // loader.objLoad('./jian/index.obj', (meshes)=>{
  // loader.objLoad('./Squirtle.obj', (meshes)=>{
  // loader.objLoad('./gubi/index.obj', (meshes)=>{
  // loader.objLoad('./plane.obj', (meshes)=>{
  // loader.objLoad('./magnolia.obj', (meshes)=>{
  let pare = new DDD.Mesh("Squirtle",[],[],[],[]);
  // let loader = new THREE.GLTFLoader();/*实例化加载器*/
  //  loader.load('./elphant/index.gltf',function (obj) {

  //     console.log(obj);
  //     // obj.scene.children
  //     let objMeshes = obj.scene.children;
  //     let count=0;
      meshes.forEach(({v, vn, vt, ind, g}, index)=>{
        var mesh = new DDD.Mesh(g, v, vn, vt, ind)
        // mesh.setPosition(0,0,0)
        console.log(mesh)
        mesh._material = new DDD.UIMaterial({
          color: new DDD.Color(1,1,0,1)
        })
        // mesh._material = new DDD.UITextureMaterial({
        //   // image: "assets/momo.png",
        //   // image: `./gb/0.jpg`,
        //   // image: `./gubi/tietu2.JPG`,
        //   image: `./elphant/elphant/1.jpeg`,
        //   // image: `./tex/${g}.png`,
        //   // image: `./jian/chartlet/0.png`,
        // });
        // mesh._material.mode = 'line'
        // mesh._material.isLineMode  = true;
        // mesh.scaling(.05,.05,.05)
        // mesh.scaling(.5,.5,.5)
        // mesh.rotateX(-45)
    
        // 加载 glTF 格式的模型
        // setTimeout(()=>{
        //   console.log('ind',index, '比较开始')
        //   objMeshes[index].geometry.attributes.position.array.forEach((p,i)=>{
        //     if(p!==v[i]) console.log(index,'v',i,'----', p,v[i]); else count++;
        //   })

        //   objMeshes[index].geometry.attributes.uv.array.forEach((p,i)=>{
        //     if(p!==vt[i]) console.log(index,'vt',i,'----', p,vt[i]); else count++;
        //   })

        //   objMeshes[index].geometry.attributes.normal.array.forEach((p,i)=>{
        //     if(p!==vn[i]) console.log(index,'vn',i,'----', p,vn[i]); else count++;
        //   })

        //   objMeshes[index].geometry.index.array.forEach((p,i)=>{
        //     if(p!==ind[i]) console.log(index,'index',i,'----', p,ind[i]); else count++;
        //   })
        //   console.log('ind',index, '比较结束', count)
        // },0)
        
    
    
        pare.add(mesh)
      })
    // },function (xhr) {


    // },function (error) {


    // })

  
  // pare.scaling(.01,.01,.01)
  pare.scaling(.5,.5,.5)
  // pare.scaling(.05,.05,.05)
  scene2.add(pare)
})
// gltfLoader.load('./Squirtle.gltf', (meshes)=>{
//   // gltfLoader.load('./elphant/index.gltf', (meshes)=>{
//     let pare = new DDD.Mesh("Squirtle",[],[],[],[]);
//   meshes.forEach(({v, vn, vt, ind, g})=>{
//     var mesh = new DDD.Mesh(g, v, vn, vt, ind)
//     // mesh.setPosition(0,0,0)
//     console.log(mesh)
//     // mesh._material = new DDD.UIMaterial({
//     //   color: new DDD.Color(1,1,0,1)
//     // })
//     mesh._material = new DDD.UITextureMaterial({
//       // image: "assets/momo.png",
//       // image: `./gb/0.jpg`,
//       // image: `./gubi/tietu2.JPG`,
//       // image: `./elphant/elphant/1.jpeg`,
//       image: `./tex/${g}.png`,
//       // image: `./jian/chartlet/0.png`,
//     });
//     // mesh._material.mode = 'fan'
//     // mesh.scaling(.05,.05,.05)
//     // mesh.scaling(.5,.5,.5)
//     // mesh.rotateX(-45)
//     pare.add(mesh)
//   })
//   // pare.scaling(.01,.01,.01)
//   pare.scaling(.5,.5,.5)
//   // pare.scaling(.05,.05,.05)
//   scene2.add(pare)
// })


let light = new DDD.PointLight("light", new DDD.Vec3(1,1,3));


console.log(light)


var pickBtn = document.getElementById('pick');
var continer = document.getElementById('convertedImg');
pickBtn.addEventListener('click', function () {
  var img = convertCanvasToImage(mycanvas);
  continer.appendChild(img)
})

var colorMaterial = new DDD.UIMaterial({});
var mapMaterial = new DDD.UITextureMaterial({
  image: "assets/miao256.jpg",
});

var bbb = new DDD.BoxMeshBuild("bbb");
bbb._material = new DDD.UIMaterial({
  // colorMaterial
});
// scene2.add(bbb)

var obj = new DDD.Plane();
// obj.scaling(0.25, 0.2, .2);
obj.setPosition(0, 0, 0)
obj._material = new DDD.UIVideoMaterial({
  dynamic: true,
  autoPlay: true,
  video: "assets/vedio.mp4",
});
// render.addRenderObject(obj);

var videoBtn = document.getElementById('video')
videoBtn.addEventListener('click', function () {
  if (obj._material._videoPausing) {
    obj._material.play();
  } else {
    obj._material.pause();
  }
})

var center = new DDD.Shape("_cener_");
center._material = colorMaterial;
// render.addRenderObject(center)


scene.add(center)
// scene.add(light);



var t = new DDD.Torus();
t._material = new DDD.UIMaterial({uColor: new DDD.Color(1,1,0,1)});
t.scaling(.1,.1,.1)
// t.setPosition(1,-1,0)
t.rotateX(Math.PI/2.)
// center.add(t); 
// scene2.add(t);

var box = new DDD.BoxMeshBuild('box');

box.scaling(0.2, 0.2, 0.2)
// box.rotateX(0.25)
// box.rotateY(0.25)
box.setPosition(1, 1, 0)
// box.lookAt(.8, .8, 1)
box._material = new DDD.UIMaterial({});
// render.addRenderObject(box);
// box._material.isLineMode = false;


var box5 = new DDD.BoxMeshBuild('box5');
var cubeMap = new DDD.UIShaderMaterial({});
box5._material = cubeMap
box5.scaling(0.2, 0.2, 0.2);
// box5.rotateX(0.25);
// box5.rotateY(0.25);
box5.setPosition(-1, -1, 0)
// box5.lookAt(-.8, -.8, 1)




new DDD.ImagesLoaded([
  'assets/xneg.jpg',
  'assets/xneg.jpg',
  'assets/xpos.jpg',
  'assets/ypos.jpg',
  'assets/zneg.jpg',
  'assets/zpos.jpg',
]).onLoad((images) => {
  cubeMap.config['u_Sampler'] = DDD.GLTools.createCubeTexture(client.gl, images, {});
  // render.addRenderObject(box5);
})


var box2 = new DDD.BoxMeshBuild('box2' , 1,1,1, 3,3,3);
box2.scaling(0.2, 0.2, 0.2);
// box2.rotateX(0.25);
// box2.rotateY(0.25);
box2.setPosition(-.8, 0, 0)
// box2.lookAt(-.8, 0, 1)
box2._material = new DDD.UICubeTextureMaterial({
  images: [
    'assets/right.jpg',
    'assets/left.jpg',
    'assets/top.jpg',
    'assets/bottom.jpg',
    'assets/back.jpg',
    'assets/front.jpg',
  ],
});


var box3 = new DDD.BoxMeshBuild('box3');
box3.scaling(0.2, 0.2, 0.2);
// box3.rotateX(0.25);
// box3.rotateY(0.25);
box3.setPosition(0, -.8, 0)
box3._material = mapMaterial;


var ball = new DDD.Ball();
ball.scaling(0.2, 0.2, 0.2)
// ball.setPosition(.8, -.8, 0)
ball.rotateX(0.25);
ball.rotateY(0.25);
ball._material = colorMaterial;


var obj1 = new DDD.Plane();
obj1._material = new DDD.UIMultiTexturesMaterial({
  texture0: "assets/miao256.jpg",
  texture1: "assets/circle.gif",
});
obj1.scaling(0.2, 0.2, 1.0);
obj1.setPosition(0, .8, 0)
// obj1.lookAt(0, .8, 1)




var axis = new DDD.AxesHelper();
axis.scaling(4, 4, 4)
axis._material = new DDD.UIMaterial({});
axis._material.isLineMode = true;

var axis1 = new DDD.AxesHelper('a1');
axis1.scaling(4, 4, 4)
axis1._material = new DDD.UIMaterial({});
axis1._material.isLineMode = true;

var axis2 = new DDD.AxesHelper('a2');
axis2.scaling(4, 4, 4)
axis2._material = new DDD.UIMaterial({});
axis2._material.isLineMode = true;

var axis3 = new DDD.AxesHelper('a3');
axis3.scaling(4, 4, 4)
axis3._material = new DDD.UIMaterial({});
axis3._material.isLineMode = true;

var axis4 = new DDD.AxesHelper();
axis4.scaling(4, 4, 4)
axis4._material = new DDD.UIMaterial({});
axis4._material.isLineMode = true;

box2.add(axis1);
box5.add(axis2);
box3.add(axis3);



// var texture = new DDD.UITexture(client.gl);
// console.log(texture)




var obj3 = new DDD.Plane();
obj3._material = new DDD.UIAudioMaterial({
  audio: 'assets/SuperMario.mp3',
});
obj3.scaling(0.2, 0.2, 1.0);
obj3.setPosition(0, .8, 0)
// obj1.lookAt(0, .8, 1)

var audioBtn = document.getElementById('audio')
audioBtn.addEventListener('click', function () {
  if (obj3._material._audioPausing) {
    obj3._material.play();
  } else {
    obj3._material.pause();
  }
})

var animation = new DDD.Animation(true)
animation._duration = 20000;
animation._repeatCount = 40;
animation._startOffset = 1000;
animation._repeatMode = 'reverse'
animation._fillBefore = false;
animation._fillAfter = true;
animation.applyTransformation = (interpolatedTime) => {
  // console.log('...', interpolatedTime * 2 - 1, interpolatedTime * 2 - 1)
  // obj.setPosition(interpolatedTime * 2 - 1, interpolatedTime * 2 - 1, 0)
  // obj.setPosition(0, 0, interpolatedTime * 2 - 1)
  // box3.followAt(obj)
}


// camera.followAt(ball, 10)

animation.registerAnimationStartListener((ani) => {
  // console.log('start...')
}).registerAnimationEndListener((ani) => {
  // console.log('end...', ani._oneMoreTime, ani._started, ani._ended, ani._more)
}).registerAnimationRepeatListener((ani) => {
  // console.log('repeat...', ani._repeated)
}).registerAnimationProgressListener((ani, progress) => {
  // console.log('animation', progress)
  ball.setPosition(0, 0, (progress * 2 - 1.0) * 10)
  // box3.followAt(ball)
  // camera1.followAt(ball, 10)
})


animation.start()

let ani = new DDD.ValueAnimation();
ani.valueFrom = 2;
ani.valueTo = 52;
ani._duration = 2000;
ani._startOffset = 2000;
// ani._repeatCount = 200;
ani._fillEnabled = true;
ani._fillBefore = false;
ani._fillAfter = false;
ani.setInterpolator(new DDD.BounceInterpolator());
ani
  .registerAnimationStartListener((ani) => {
    // console.log('start...')
  }).registerAnimationProgressListener((ani, progress) => {
    // console.log('value animation', progress * 2 - 1.0, ani.getValue() * 2.0 / 52.0 - 1, 0)
    var pointer = new DDD.Ball();
    pointer.scaling(0.01, 0.01, 0.01)
    pointer._material = colorMaterial;
    pointer.setPosition(progress * 2 - 1.0, ani.getValue() * 2.0 / 52.0 - 1, 0)

    box5.lookAt(progress * 2 - 1.0, ani.getValue() * 2.0 / 52.0 - 1, 2)
    // camera.lookAt(progress * 2 - 1.0, ani.getValue() * 2.0 / 52.0 - 1, 2)
    // camera.followAt(pointer, 20)
    // camera.followAt(pointer)
    
    center.add(pointer)
  });
ani.start()

center.add(axis)
center.add(box)
center.add(box2)
center.add(box3)
center.add(box5)
center.add(ball)
center.add(obj)
center.add(obj1)
center.add(obj3)

// box2.add(obj)
var ball2 = new DDD.Ball();
ball2._material = colorMaterial;

ball2.scaling(0.2, 0.2, 0.2)
ball2.setPosition(-1,1,.3)
obj1.add(ball2);

// ball2.scaling(0.04000000000000001, 0.04000000000000001, 0.2)
// //ball2.setPosition(-1,1.1600000000000001,.3)
// ball2.setPosition(-.2,1,.3)
// center.add(ball2);

let pos = new DDD.Vec3(), q = new DDD.Quaternion(), s = new DDD.Vec3(1,1,1);
// ball2._modelMatrix.clone().rightDot(obj1._modelMatrix.clone()).decompose(pos, q, s)
// obj1._modelMatrix.clone().decompose(pos, q, s)
obj.getMatrixOnWorld().decompose(pos, q, s)

let ang = 0.01;
var animate = function (time) {
  render.renderScene()
  // obj.rotateZ(-0.01)
  // box.rotateZ(-0.01)
  box2.rotateY(-0.01)
  // box5.rotateZ(-0.01)
  ball.rotateZ(-0.01)
  // center.rotateZ(-0.1)
  // camera.followAt(ball)
  // camera.lookAt(obj1.position.x,obj1.position.y,obj1.position.z)
  // obj1.lookAt(camera.position.x,camera.position.y,camera.position.z)
  // console.log(box.r)
  // camera2_1.rotateOnWorldAxis( DDD.Vec3.X, ang)
  // camera.rotateOnWorldAnyAxis( new DDD.Vec3(.1,.1,1), new DDD.Vec3(.1,.1,0), ang)
  // camera2_1.lookAt(0,0,0)
  // camera.followAt(box2)
  // obj1.rotateZ(ang)
  // ang+=0.01
  // console.log(box._quaternion)
  let mod = scene2.findNodeByName("Squirtle")
  if(mod){
    mod.rotateY(-0.01)
  }
  
  animation.updateAnimation();
  ani.updateAnimation();
  window.requestAnimationFrame(animate);
}
animate(0);

mycanvas.addEventListener('webgl', (e) => {
  // console.log(e.webglX, e.webglY, e.webgldrag)
  if (e.webgldrag) {
    obj.lookAt(e.webglX, e.webglY, 2)
    obj1.lookAt(e.webglX, e.webglY, 2)
    box.lookAt(e.webglX, e.webglY, 2)
    box2.lookAt(e.webglX, e.webglY, 2)
    box3.lookAt(e.webglX, e.webglY, 2)
    // box5.lookAt(e.webglX, e.webglY, 2)
    box5.lookAt(box2.position.x, box2.position.y, box2.position.z)
  }

  let r = scene2.findNodeByName("mod");

  console.log(r);
  // if(e.webglke)
  if (e.webglkeydown) {
    // console.log(e.webglkeyCode, e.webglkey)
    switch (e.webglkey.toLocaleLowerCase()) {
      case 'arrowleft':
      case 'a':
        {
          box2.translateX(-0.1)
        }
        break;
      case 'arrowdown':
      case 's':
        {
          box2.translateZ(-0.1)
        }
        break;
      case 'arrowright':
      case 'd':
        {
          box2.translateX(0.1)
        }
        break;
      case 'arrowup':
      case 'w':
        {
          box2.translateZ(0.1)
        }
        break;
    }
  }

})
// }

