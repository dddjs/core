import { Animation } from './Animation';
import { Object3d } from '../core/Object3d';

// https://www.jianshu.com/p/2412d00a0ce4
export class TranslateAnimation extends Animation {
  xDeltaFrom: number = 0;// 初始值
  yDeltaFrom: number = 0;// 初始值
  zDeltaFrom: number = 0;// 初始值
  xDeltaTo: number = 0;// 结束值
  yDeltaTo: number = 0;// 结束值
  zDeltaTo: number = 0;// 结束值

  xDelta: number | null = null;
  yDelta: number | null = null;
  zDelta: number | null = null;
  constructor(target: Object3d, _canStop: boolean) {
    super(target, _canStop);
  }

  setAlpha(xDeltaFrom: number, yDeltaFrom: number, zDeltaFrom: number, xDeltaTo: number, yDeltaTo: number, zDeltaTo: number) {
    this.xDeltaFrom = xDeltaFrom;
    this.yDeltaFrom = yDeltaFrom;
    this.zDeltaFrom = zDeltaFrom;
    this.xDeltaTo = xDeltaTo;
    this.yDeltaTo = yDeltaTo;
    this.zDeltaTo = zDeltaTo;
  }

  applyTransformation(interpolatedTime) {

    if (this.xDeltaFrom != this.xDeltaTo) {
      this.xDelta = this.xDeltaFrom + ((this.xDeltaTo - this.xDeltaFrom) * interpolatedTime);
    }
    if (this.yDeltaFrom != this.yDeltaTo) {
      this.yDelta = this.yDeltaFrom + ((this.yDeltaTo - this.yDeltaFrom) * interpolatedTime);
    }
    if (this.zDeltaFrom != this.zDeltaTo) {
      this.zDelta = this.zDeltaFrom + ((this.zDeltaTo - this.zDeltaFrom) * interpolatedTime);
    }
  }

  getxDelta() {
    return this.xDelta;
  }

  getyelta() {
    return this.yDelta;
  }

  getzelta() {
    return this.zDelta;
  }

  hasAlpha() {
    return true;
  }
}