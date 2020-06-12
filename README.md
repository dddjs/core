# dddjs

- [WebGL 基础知识](http://eux.baidu.com/blog/fe/832)

- [webgl 案例](https://wgld.org/s/sample_026/)

- [Webgl S](https://wgld.org/d/webgl/w040.html)

- [WebGL 理论基础](https://webglfundamentals.org/webgl/lessons/zh_cn/)

- [TWGL: A Tiny WebGL helper Library](https://twgljs.org/)

- [Thing.js](http://www.thingjs.com/guide/?m=tutorial)

- [WEBGL 高级技术](https://www.cnblogs.com/w-wanglei/p/6696290.html)

- [WebGL创建一个逼真的下雨动画](http://www.techbrood.com/zh/news/webgl/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8webgl%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E9%80%BC%E7%9C%9F%E7%9A%84%E4%B8%8B%E9%9B%A8%E5%8A%A8%E7%94%BB.html)

- [LooAt](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-camera.html)

- [CSS3 3D 动画](https://www.cnblogs.com/shenzikun1314/p/6390181.html)
- [CSS3 3D](https://www.cnblogs.com/coco1s/p/5414153.html)


```s
attribute vec4 aPosition; 
attribute vec4 aNormal; 
uniform mat4 u_modelMatrix; 
uniform mat4 u_normalMatrix; 
uniform mat4 u_vpMatrix; 
varying vec3 v_normal; 
varying vec3 v_position; 
void main() { 
  gl_Position = u_vpMatrix * u_modelMatrix * aPosition; 
  v_normal=vec3(u_normalMatrix * aNormal); 
  v_position= vec3(u_modelMatrix * aPosition); 
  
}




precision mediump float; 
uniform vec3 u_lightColor; 
uniform vec3 u_lightPosition; 
uniform vec3 u_lightPosition2; 
uniform vec3 u_ambientColor; 
uniform vec3 u_viewPosition; 
uniform vec4 u_color; 
varying vec3 v_normal; 
varying vec3 v_position; 
void main() { 
  vec3 normal = normalize(v_normal); 

  vec3 ambient = u_ambientColor * u_color.rgb; 

  vec3 lightDirection = normalize(u_lightPosition); 
  float cosTheta = max(dot(lightDirection, normal), 0.0); 
  vec3 diffuse = u_lightColor * u_color.rgb * cosTheta; 

  float shininess =100.0; 
  vec3 specularColor =vec3(1.0,1.0,1.0); 
  vec3 viewDirection = normalize(u_viewPosition-v_position); 
  vec3 halfwayDir = normalize(lightDirection + viewDirection); 
  float specularWeighting = pow(max(dot(normal, halfwayDir), 0.0), shininess); 
  vec3 specular = specularColor.rgb * specularWeighting; 
  
  vec3 lightDirection2 = normalize(u_lightPosition2 - v_position.xyz); 
  float cosTheta2 = max(dot(lightDirection2, normal), 0.0); 
  vec3 diffuse2 = u_lightColor * u_color.rgb * cosTheta2; 

  float shininess2 =30.0; 
  vec3 specularColor2 =vec3(1.0,1.0,1.0); 
  vec3 reflectionDirection = reflect(-lightDirection2, normal); 
  float specularWeighting2 = pow(max(dot(reflectionDirection, viewDirection), 0.0), shininess2); 
  vec3 specular2 = specularColor2.rgb * specularWeighting2; 

  gl_FragColor = vec4(diffuse+diffuse2+ambient+specular+specular2,u_color.a); 
  
}
```