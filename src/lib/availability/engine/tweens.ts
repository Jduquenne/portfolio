import { clamp, easeInOut, lerp, type Easing } from "@/lib/availability/geo/math";

interface Tween {
  target: object;
  key: string;
  from: number;
  to: number;
  duration: number;
  elapsed: number;
  ease: Easing;
  write: (value: number) => void;
}

export class Tweens {
  private tweens: Tween[] = [];

  get active(): boolean {
    return this.tweens.length > 0;
  }

  to<K extends string>(
    target: { [P in K]: number },
    key: K,
    value: number,
    duration: number,
    ease: Easing = easeInOut,
  ): void {
    this.cancel(target, key);
    if (duration <= 0) {
      target[key] = value;
      return;
    }
    this.tweens.push({
      target,
      key,
      from: target[key],
      to: value,
      duration,
      elapsed: 0,
      ease,
      write: (next) => {
        target[key] = next;
      },
    });
  }

  cancel(target: object, key?: string): void {
    this.tweens = this.tweens.filter(
      (tween) => tween.target !== target || (key !== undefined && tween.key !== key),
    );
  }

  update(dt: number): void {
    for (const tween of this.tweens) {
      tween.elapsed += dt;
      const t = clamp(tween.elapsed / tween.duration);
      tween.write(lerp(tween.from, tween.to, tween.ease(t)));
    }
    this.tweens = this.tweens.filter((tween) => tween.elapsed < tween.duration);
  }
}
