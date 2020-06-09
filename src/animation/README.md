# [Android动画](https://blog.csdn.net/u013478336/article/details/52207314?locationNum=14&fps=1)

[Android 动画源码](https://www.androidos.net.cn/android/9.0.0_r8/xref/frameworks/base/core/java/android/view/animation/)


动画特性：
1. 动画的始末态
1. 动画的中间态（插值，暂停）
1. 动画的重启重置
1. 动画的重复性
1. 动画的时间相关性

涉及属性：
1. 单属性（value）
1. 双属性（position.xy, rotation.xy, scaling.xy）
1. 三属性(position.xyz, rotation.xyz, scaling.xyz)
1. 多属性(color.rgba等)

平移，旋转，缩放等动画，都可以通过插值动画 与 目标的 直接组合，为什么要重新写一个动画类，除了可以直接实现对应的动画外，还有可以赋其它能，如单独锁定x|y|z轴，同时也可以给其它动画如关键帧动画方便组合,如线性动画，控制方向


关键帧动画，可以组合各种动画；；模型导出的关键帧动画需要特殊解析