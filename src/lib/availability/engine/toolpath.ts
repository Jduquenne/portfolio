import { clamp, lerp } from "@/lib/availability/geo/math";
import { pointAtProgress, type Shape } from "@/lib/availability/geo/shape";
import type { Point } from "@/lib/availability/types";

export type MoveSpec =
  | { kind: "print"; shapeId: string; shape: Shape; minDuration?: number }
  | { kind: "rapid"; to: Point }
  | { kind: "dwell"; duration: number };

interface TimedMove {
  spec: MoveSpec;
  from: Point;
  to: Point;
  start: number;
  duration: number;
}

export interface ProgramEvent {
  at: number;
  run: () => void;
}

export interface ProgramSpeeds {
  /** World units per second while drawing. */
  print: number;
  /** World units per second while travelling without drawing. */
  rapid: number;
}

export interface Program {
  moves: TimedMove[];
  total: number;
  elapsed: number;
  head: Point;
  done: boolean;
  /** Set while the head travels without drawing, so the travel can be shown. */
  rapid: { from: Point; to: Point } | null;
  events: ProgramEvent[];
  fired: Set<ProgramEvent>;
}

export type ProgressSink = (shapeId: string, progress: number) => void;

const MIN_RAPID_SECONDS = 0.08;

/** A toolpath, in the manner of G-code: print moves draw, rapid moves only travel. */
export function createProgram(
  specs: MoveSpec[],
  start: Point,
  speeds: ProgramSpeeds,
  delay = 0,
): Program {
  const moves: TimedMove[] = [];
  let clock = 0;
  let position = start;
  for (const spec of specs) {
    let from = position;
    let to = position;
    let duration = 0;
    if (spec.kind === "print") {
      from = spec.shape.points[0];
      to = spec.shape.points[spec.shape.points.length - 1];
      duration = Math.max(spec.minDuration ?? 0, spec.shape.length / speeds.print);
    } else if (spec.kind === "rapid") {
      to = spec.to;
      duration = Math.max(
        MIN_RAPID_SECONDS,
        Math.hypot(to[0] - from[0], to[1] - from[1]) / speeds.rapid,
      );
    } else {
      duration = spec.duration;
    }
    moves.push({ spec, from, to, start: clock, duration });
    clock += duration;
    position = to;
  }
  return {
    moves,
    total: clock,
    elapsed: -delay,
    head: start,
    done: false,
    rapid: null,
    events: [],
    fired: new Set(),
  };
}

export function moveStart(program: Program, index: number): number {
  return program.moves[index].start;
}

export function moveEnd(program: Program, index: number): number {
  const move = program.moves[index];
  return move.start + move.duration;
}

function headAt(move: TimedMove, progress: number): Point {
  if (move.spec.kind === "print") return pointAtProgress(move.spec.shape, progress);
  return [lerp(move.from[0], move.to[0], progress), lerp(move.from[1], move.to[1], progress)];
}

export function advanceProgram(
  program: Program,
  dt: number,
  onProgress: ProgressSink,
): void {
  if (program.done) return;
  program.elapsed += dt;
  const time = Math.max(0, program.elapsed);

  let current = program.moves[0];
  for (const move of program.moves) {
    if (time >= move.start) current = move;
    if (move.spec.kind === "print") {
      onProgress(move.spec.shapeId, clamp((time - move.start) / move.duration));
    }
  }

  const progress = clamp((time - current.start) / current.duration);
  program.head = headAt(current, progress);
  program.rapid =
    current.spec.kind === "rapid" && progress < 1
      ? { from: current.from, to: program.head }
      : null;

  for (const event of program.events) {
    if (!program.fired.has(event) && program.elapsed >= event.at) {
      program.fired.add(event);
      event.run();
    }
  }

  if (program.elapsed >= program.total) {
    program.done = true;
    program.rapid = null;
    for (const move of program.moves) {
      if (move.spec.kind === "print") onProgress(move.spec.shapeId, 1);
    }
  }
}

/** Plays the rest of the program at once, firing what is left of its events. */
export function completeProgram(program: Program, onProgress: ProgressSink): void {
  if (program.done) return;
  advanceProgram(program, program.total - program.elapsed, onProgress);
}
