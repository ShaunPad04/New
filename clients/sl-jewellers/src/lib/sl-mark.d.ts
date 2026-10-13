export interface SlMarkHandle {
  supported: boolean;
  canvas: HTMLCanvasElement | null;
  ready: Promise<boolean>;
  start(): void;
  stop(): void;
  destroy(): void;
  setRotation(x: number, y: number): void;
  setScrollProgress(p: number): void;
  setScrub(p: number): void;
  /** Switch the idle turn off (it eases to a standstill) or on. */
  setIdleSpin(on: boolean): void;
  burst(): boolean;
  readonly bursting: boolean;
  readonly running: boolean;
}
export const POSTER_ROTATION: { x: number; y: number };
export function mount(el: HTMLElement, options?: Record<string, unknown>): SlMarkHandle;
export default mount;
