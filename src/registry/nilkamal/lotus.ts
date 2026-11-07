import { clamp, mix, TAU, type Point } from './engine/math';

type Petal = { x: number; y: number; width: number; base: number; shade: number; phase: number };
export const PETALS: readonly Petal[] = [
  { x: -165, y: -95, width: 44, base: -12, shade: .25, phase: 1 },
  { x: 165, y: -95, width: 44, base: 12, shade: .3, phase: 2 },
  { x: -110, y: -166, width: 38, base: -8, shade: .38, phase: 3 },
  { x: 110, y: -166, width: 38, base: 8, shade: .5, phase: 4 },
  { x: -55, y: -201, width: 34, base: -5, shade: .48, phase: 5 },
  { x: 55, y: -201, width: 34, base: 5, shade: .7, phase: 6 },
  { x: 0, y: -214, width: 34, base: 0, shade: .85, phase: 7 },
  { x: -193, y: -45, width: 34, base: -8, shade: .43, phase: 8 },
  { x: 193, y: -45, width: 34, base: 8, shade: .7, phase: 9 },
  { x: -134, y: -119, width: 46, base: -10, shade: .75, phase: 10 },
  { x: 134, y: -119, width: 46, base: 10, shade: .8, phase: 11 },
  { x: -67, y: -156, width: 39, base: -4, shade: .75, phase: 12 },
  { x: 67, y: -156, width: 39, base: 4, shade: 1, phase: 13 },
  { x: 0, y: -153, width: 36, base: 0, shade: .65, phase: 14 },
  { x: -140, y: -29, width: 30, base: -4, shade: .7, phase: 15 },
  { x: 140, y: -29, width: 30, base: 4, shade: .85, phase: 16 },
  { x: -94, y: -64, width: 38, base: -6, shade: .86, phase: 17 },
  { x: 94, y: -64, width: 38, base: 6, shade: 1, phase: 18 },
  { x: -36, y: -72, width: 30, base: -3, shade: .7, phase: 19 },
  { x: 36, y: -72, width: 30, base: 3, shade: .9, phase: 20 },
];

function petalPath(c: CanvasRenderingContext2D, p: Petal, bend: number) {
  const x = p.x + bend, y = p.y;
  const curl = Math.sin(p.phase * 3.7) * 3;
  c.beginPath(); c.moveTo(p.base - 7, 4);
  c.bezierCurveTo(p.base + x * .12 - p.width * 1.05, y * .14, x * .73 - p.width * .85, y * .74, x + curl, y);
  c.bezierCurveTo(x * .95 + p.width * .52, y * .74, x * .44 + p.width * 1.2, y * .13, p.base + 7, 4);
  c.quadraticCurveTo(p.base, 12, p.base - 7, 4);
  c.closePath();
}

export function drawLotus(c: CanvasRenderingContext2D, options: { time: number; wind: number; snow: number; wetness: number; bloom: number; hover: number; flash: number; pointer: Point | null; texture: CanvasPattern }) {
  const { time, wind, snow, wetness, bloom, hover, flash, pointer, texture } = options;
  c.save(); c.scale(mix(.44, 1, bloom), mix(.72, 1, bloom));
  for (const [index, original] of PETALS.entries()) {
    if (index === 14) {
      // The seed head sits behind the short front row.
      for (let i = 0; i < 45; i++) {
        const a = i * 2.399, r = Math.sqrt(i / 45) * 27;
        const x = Math.cos(a) * r, y = -41 + Math.sin(a) * r * .37;
        c.strokeStyle = 'rgba(236,202,110,.65)'; c.lineWidth = .85;
        c.beginPath(); c.moveTo(x * .65, -7); c.quadraticCurveTo(x * 1.12, y + 10, x, y - 9); c.stroke();
        c.fillStyle = i % 3 ? '#f7dda0' : '#af9f65'; c.beginPath(); c.ellipse(x, y - 9, 1.6, 2.3, 0, 0, TAU); c.fill();
      }
    }
    const localHover = pointer ? clamp(1 - Math.hypot(pointer.x - original.x * .75, pointer.y - original.y * .72) / 83) : 0;
    const p = { ...original, width: original.width * 1.14, x: original.x * mix(.16, 1, bloom), y: original.y * mix(.86, 1, bloom) - localHover * 13 };
    const bend = Math.sin(time * 1.15 + p.phase) * (1.5 + wind * 2.6) + hover * Math.sign(p.x) * 6 + localHover * Math.sign(p.x || 1) * 17;
    const x = p.x + bend;
    petalPath(c, p, bend);
    const g = c.createLinearGradient(p.base - 20, 12, x + 20, p.y);
    const light = p.shade + flash * .35;
    g.addColorStop(0, '#0b2445');
    g.addColorStop(.27, `rgb(${Math.round(11 + light * 7)},${Math.round(40 + light * 18)},${Math.round(117 + light * 28)})`);
    g.addColorStop(.65, `rgb(${Math.round(27 + light * 23)},${Math.round(84 + light * 38)},${Math.round(169 + light * 40)})`);
    g.addColorStop(.9, `rgb(${Math.round(58 + light * 36)},${Math.round(126 + light * 43)},${Math.round(201 + light * 34)})`);
    g.addColorStop(1, `rgb(${Math.round(137 + light * 34)},${Math.round(199 + light * 24)},${Math.min(255, Math.round(235 + light * 15))})`);
    c.fillStyle = g; c.fill();
    c.strokeStyle = 'rgba(153,207,236,.32)'; c.lineWidth = .7; c.stroke();
    c.save(); c.clip();
    for (let v = -7; v <= 7; v++) {
      c.strokeStyle = `rgba(177,220,246,${v === 0 ? .22 : .065 + (v % 3 === 0 ? .035 : 0)})`; c.lineWidth = v === 0 ? .7 : .4;
      c.beginPath(); c.moveTo(p.base, 7);
      c.bezierCurveTo(p.base + x * .2 + v * 3, p.y * .32, x * .78 + v * p.width * .1, p.y * .72, x, p.y + 2); c.stroke();
    }
    const sheen = c.createLinearGradient(x - p.width, p.y, x + p.width, 0);
    sheen.addColorStop(0, 'rgba(0,7,37,.24)'); sheen.addColorStop(.34, 'rgba(194,230,255,.17)'); sheen.addColorStop(.56, 'rgba(173,226,255,.025)'); sheen.addColorStop(.86, 'rgba(0,13,48,.27)');
    c.fillStyle = sheen; c.fillRect(-240, -225, 480, 250);
    c.save(); c.globalAlpha = .11; c.fillStyle = texture; c.fillRect(-240, -225, 480, 250); c.restore();
    if (wetness > .03) {
      for (let d = 0; d < 3; d++) {
        const t = .35 + d * .18, dx = x * t + Math.sin(index * 7 + d * 3) * 6, dy = p.y * t;
        const r = (1.5 + (index % 3) * .6) * wetness;
        c.fillStyle = 'rgba(126,214,255,.28)'; c.beginPath(); c.ellipse(dx, dy, r, r * 1.35, -.18, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(187,240,255,.65)'; c.lineWidth = .55; c.stroke();
        c.fillStyle = '#d6f4ff'; c.beginPath(); c.arc(dx - r * .25, dy - r * .4, r * .3, 0, TAU); c.fill();
      }
    }
    if (snow > .02) {
      c.strokeStyle = `rgba(238,249,255,${clamp(snow * 3)})`; c.lineCap = 'round'; c.lineWidth = 2 + snow * 10;
      c.beginPath(); c.moveTo(x, p.y + 2);
      if (x < 0) c.bezierCurveTo(x * .73 - p.width * .85, p.y * .74, p.base + x * .12 - p.width * 1.05, p.y * .14, p.base - 7, 4);
      else c.bezierCurveTo(x * .95 + p.width * .52, p.y * .74, x * .44 + p.width * 1.2, p.y * .13, p.base + 7, 4);
      c.stroke();
      for (let d = 0; d < 10; d++) {
        const t = .45 + d * .042;
        c.fillStyle = `rgba(255,255,255,${snow * .6})`;
        c.beginPath(); c.arc(x * t + Math.sin(d * 4 + index) * p.width * .23, p.y * t, .6 + snow * 1.2, 0, TAU); c.fill();
      }
    }
    c.restore();
  }
  c.restore();
}
