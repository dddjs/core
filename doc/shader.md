### 变量类型

Shader有下面几种变量类型：

- `void` 和C语言的void一样，无类型
- `bool` 布尔
- `int` 有符号的int
- `float` 浮点数
- `vec2`, `vec3`, `vec4` 2，3，4维向量，如果你不知道什么是向量，可以理解为2，3，4长度的数组。
- `bvec2`, `bvec3`, `bvec4`  2，3，4维布尔值的向量。
- `ivec2`, `ivec3`, `ivec4` 2，3，4维int值的向量。
- `mat2`, `mat3`, `mat4` 2x2, 3x3, 4x4 �浮点数的矩阵，如果你不了解矩阵，后面会有一篇文章单独介绍矩阵。
- `sampler2D` 纹理，后面会详细介绍。
- `samplerCube` Cube纹理，后面会详细介绍。

### 变量精度

细心的读者可能会发现同样是`varying`变量，在Fragment Shader中多了一个`mediump`修饰符。`mediump`表示的是变量类型的精度。因为Fragment Shader是逐像素执行，所以会尽量控制计算的复杂度。对于不需要过高精度的变量，可以手动指定精度从而提高性能。精度主要分为下面3种。

- `highp`, 16bit，浮点数范围`(-2^62, 2^62)`，整数范围`(-2^16, 2^16)`
- `mediump`, 10bit，浮点数范围`(-2^14, 2^14)`，整数范围`(-2^10, 2^10)`
- `lowp`, 8bit，浮点数范围`(-2, 2)`，整数范围`(-2^8, 2^8)`
   如果你想所有的float都是高精度的，可以在Shader顶部声明`precision highp float;`，这样你就不需要为每一个变量声明精度了。

### 运算符

Shader可以使用所有C语言的运算符。不过要注意的是二元运算比如加法，乘法等，只能用在两个类型相同的变量上，比如float只能和float相加。因为Shader不会为你进行隐式的类型转换，这样会增加GPU的负担。我们表示float变量时，需要自行增加小数点，比如浮点数5要写成5.0，否则会被认定为整数。下面是能够使用的运算符，读者可以当做参考。



![img](https:////upload-images.jianshu.io/upload_images/2949750-6cde500bba3b3b91.png?imageMogr2/auto-orient/strip|imageView2/2/w/399/format/webp)

### uniform变量

uniform变量会被所有Shader共享，比如有3个顶点，Vertex Shader会被执行3次，每次访问的uniform变量都是同一个由js代码设定好的值。下面是本文使用的设定uniform `elapsedTime`的js代码。



```bash
  elapsedTimeUniformLoc = gl.getUniformLocation(program, 'elapsedTime');
  gl.uniform1f(elapsedTimeUniformLoc, elapesdTime);
```

首先获取uniform `elapsedTime`在Shader中的位置，然后设置它的值。`uniform1f`是`uniformXXX`函数簇里面用来设置一个`float`类型uniform的方法。通过`uniformXXX`里的XXX很容易看出来这个方法是设置什么类型的uniform的，下面是常见的几种格式。

- `uniform{n}{type}`  n表示数目1~4，type表示类型，`float`是`f`，`int`是`i`，`unsigned int`是`ui`。所以设置一个整数就是 `uniform1i`。
- `uniform{n}{type}v`  相比于上面的多了一个v，表示向量，所以传递的参数就是类型为type，维度为n的向量。
- `uniformMatrix{n}{type}v` 这个用来设置类型为type nxn的矩阵。
   上面这些方法会在后面的文章中用到，这里大致了解即可。

### varying变量

`varying`变量是Vertex Shader和Fragment Shader的桥梁，Fragment Shader中的`varying`变量由Vertex Shader中的`varying`变量自动插值计算出来。因为Fragment Shader是逐像素执行，某些使用`varying`变量的效果在Fragment Shader中实现会更加细腻，比如光照效果。

### 向量的访问

当我们拥有一个`vec4`变量，我们可以有很多种方法访问它内部的值。

- `vec4.x`,`vec4.y`,`vec4.z`,`vec4.w` 通过x，y，z，w可以分别取出4个值。
- `vec4.xy`,`vec4.xx`,`vec4.xz`,`vec4.xyz` 任意组合可以取出多种维度的向量。
- `vec4.r`,`vec4.g`,`vec4.b`,`vec4.a` 还可以通过r，g，b，a分别取出4个值，同上可以任意组合。
- `vec4.s`,`vec4.t`,`vec4.p`,`vec4.q` 还可以通过s，t，p，q分别取出4个值，同上可以任意组合。
   `vec3`和`vec2`也是同样，无非就是少了几个变量，比如`vec3`只有x，y，z。`vec2`只有x，y。

### 内置方法

有很多内置方法可以使用，如果可以选择内置方法实现算法，避免自己写代码再实现一遍，因为内置的方法能够得到更好的硬件支持。下面是可用的方法表格。



![img](https:////upload-images.jianshu.io/upload_images/2949750-2c48a2d2459d5524.png?imageMogr2/auto-orient/strip|imageView2/2/w/738/format/webp)



### 预处理命令`#define`、`#ifdef`、`#if`、`#include`

```
#define PI 3.14//圆周率
#define RECIPROCAL_PI 0.318//圆周率倒数
float add(){
  float f = PI*100.0;//预处理的时候会把PI符号自动替换为3.14
  return f;
}

#if 10 > 0
vec3 v3 = vec3(1.0,1.0,0.0);
#endif
```




# 内置函数



```swift
radians(degree) : 角度变弧度；
degrees(radian) : 弧度变角度；
sin(angle), cos(angle), tan(angle)
asin(x): arc sine, 返回弧度 [-PI/2, PI/2];
acos(x): arc cosine,返回弧度 [0, PI];
atan(y, x): arc tangent, 返回弧度 [-PI, PI];
atan(y/x): arc tangent, 返回弧度 [-PI/2, PI/2];
pow(x, y): x的y次方；
exp(x): 指数, log(x)：
exp2(x): 2的x次方， log2(x):
sqrt(x): x的根号； inversesqrt(x): x根号的倒数
abs(x): 绝对值
sign(x): 符号, 1, 0 或 -1
floor(x): 底部取整
ceil(x): 顶部取整
fract(x): 取小数部分
mod(x, y): 取模， x - y*floor(x/y)
min(x, y): 取最小值
max(x, y): 取最大值
clamp(x, min, max):  min(max(x, min), max);
mix(x, y, a): x, y的线性混叠， x(1-a) + y*a;
step(edge, x): 如 x
smoothstep(edge0, edge1, x): threshod  smooth transition时使用。 edge0<=edge0时为0.0， x>=edge1时为1.0
length(x): 向量长度
distance(p0, p1): 两点距离， length(p0-p1);
dot(x, y): 点积，各分量分别相乘 后 相加
cross(x, y): 差积，x[1]*y[2]-y[1]*x[2], x[2]*y[0] - y[2]*x[0], x[0]*y[1] - y[0]*x[1]
normalize(x): 归一化， length(x)=1;
faceforward(N, I, Nref): 如 dot(Nref, I)< 0则N, 否则 -N
reflect(I, N): I的反射方向， I -2*dot(N, I)*N, N必须先归一化
refract(I, N, eta): 折射，k=1.0-eta*eta*(1.0 - dot(N, I) * dot(N, I)); 如k<0.0 则0.0，否则 eta*I - (eta*dot(N, I)+sqrt(k))*N
matrixCompMult(matX, matY): 矩阵相乘, 每个分量 自行相乘， 即 r[i][j] = x[i][j]*y[i][j];
                           矩阵线性相乘，直接用 *
lessThan(vecX, vecY): 向量 每个分量比较 x < y
lessThanEqual(vecX, vecY): 向量 每个分量比较 x<=y
greaterThan(vecX, vecY): 向量 每个分量比较 x>y
greaterThanEqual(vecX, vecY): 向量 每个分量比较 x>=y
equal(vecX, vecY): 向量 每个分量比较 x==y
notEqual(vecX, vexY): 向量 每个分量比较 x!=y
any(bvecX): 只要有一个分量是true， 则true
all(bvecX): 所有分量是true， 则true
not(bvecX): 所有分量取反
texture2D(sampler2D, coord): texture lookup
texture2D(sampler2D, coord, bias): LOD bias, mip-mapped texture
texture2DProj(sampler2D, coord):
texture2DProj(sampler2D, coord, bias):
texture2DLod(sampler2D, coord, lod):
texture2DProjLod(sampler2D, coord, lod):
textureCube(samplerCube, coord):
textureCube(samplerCube, coord, bias):
textureCubeLod(samplerCube, coord, lod):  
```

# 内置常量



```cpp
const mediump int gl_MaxVertexAttribs = 8;
const mediump int gl_MaxVertexUniformVectors = 128;
const mediump int gl_MaxVaryingVectors = 8;
const mediump int gl_MaxVertexTextureImageUnits = 0;
const mediump int gl_MaxCombinedTextureImageUnits = 8;
const mediump int gl_MaxTextureImageUnits = 8;
const mediump int gl_MaxFragmentUnitformVectors = 16;
const mediump int gl_MaxDrawBuffers = 1;
```

# 内置变量



```cpp
gl_Position: 用于vertex shader, 写顶点位置；被图元收集、裁剪等固定操作功能所使用；
           其内部声明是：highp vec4 gl_Position;
gl_PointSize: 用于vertex shader, 写光栅化后的点大小，像素个数；
           其内部声明是：mediump float gl_Position;
gl_FragColor: 用于Fragment shader，写fragment color；被后续的固定管线使用；
            mediump vec4 gl_FragColor;
gl_FragData: 用于Fragment shader，是个数组，写gl_FragData[n] 为data n；被后续的固定管线使用；
            mediump vec4 gl_FragData[gl_MaxDrawBuffers];
gl_FragColor和gl_FragData是互斥的，不会同时写入；
gl_FragCoord: 用于Fragment shader,只读， Fragment相对于窗口的坐标位置 x,y,z,1/w; 这个是固定管线图元差值后产生的；z 是深度值; mediump vec4 gl_FragCoord;
gl_FrontFacing: 用于判断 fragment是否属于 front-facing primitive；只读；
              bool gl_FrontFacing;   
gl_PointCoord: 仅用于 point primitive; mediump vec2 gl_PointCoord;
```

# 精度



```undefined
highp, mediump, lowp
```

# 定义



```cpp
默认：无修饰符，普通变量读写， 与外界无连接；
const：常量 const vec3 zAxis = vec3(0.0, 0.0, 1.0);
attribute: 申明传给vertex shader的变量；只读；不能为array或struct；attribute vec4 position;
uniform: 表明整个图元处理中值相同；只读； uniform vec4 lightPos;
varying: 被差值；读写； varying vec3 normal;
in, out, inout;
```

# 外部调用



```csharp
1、uint CreateShader(enum type) : 创建空的shader object; 
type: VERTEX_SHADER, 
2、void ShaderSource(uint shader, sizeicount, const **string, const int *length)：加载shader源码进shader object；可能多个字符串 
3、void CompileShader(uint shader)：编译shader object； 
shader object有状态 表示编译结果 
4、void DeleteShader( uint shader )：删除 shader object; 
5、void ShaderBinary( sizei count, const uint *shaders, 
enum binaryformat, const void *binary, sizei length ): 加载预编译过的shader 二进制串； 
6、uint CreateProgram( void )：创建空的program object， programe object组织多个shader object，成为executable; 
7、void AttachShader( uint program, uint shader )：关联shader object和program object； 
8、void DetachShader( uint program, uint shader )：解除关联； 
9、void LinkProgram( uint program )：program object准备执行，其关联的shader object必须编译正确且符合限制条件； 
10、void UseProgram( uint program )：执行program object； 
11、void ProgramParameteri( uint program, enum pname, 
int value )： 设置program object的参数； 
12、void DeleteProgram( uint program )：删除program object；
```


### Shader 的组织
- 通用
   - 某固定功能（直接选取）
   - 通用功能：预先定义，根据模型数据来调用（调用机制和方法重要）
- 自定义
   - 遇到一个定义一个