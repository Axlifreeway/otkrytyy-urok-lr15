// Звуки лабораторных: короткие тоны WebAudio, без файлов.
let ac = null;
export const sound = {muted: false};
function tone(f, d, o = {}) {
  if (sound.muted) return;
  try {
    ac = ac || new AudioContext();
  } catch (e) {
    return;
  }
  const t = ac.currentTime + (o.at || 0),
    osc = ac.createOscillator(),
    g = ac.createGain();
  osc.type = o.type || 'sine';
  osc.frequency.setValueAtTime(f, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(o.vol || 0.12, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + d);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t);
  osc.stop(t + d + 0.02);
}
export const SFX = {
  yes: () => {
    tone(660, 0.08, {type: 'triangle'});
    tone(990, 0.1, {type: 'triangle', at: 0.07});
  },
  no: () => tone(220, 0.09, {type: 'triangle', vol: 0.08}),
  unk: () => {
    tone(440, 0.07, {vol: 0.08});
    tone(415, 0.1, {vol: 0.08, at: 0.08});
  },
  pop: () => tone(520, 0.09, {to: 1000, vol: 0.1}),
  ok: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.2, {type: 'triangle', at: i * 0.08})),
  err: () => {
    tone(160, 0.3, {type: 'square', vol: 0.1});
    tone(120, 0.35, {type: 'square', vol: 0.09, at: 0.15});
  },
  rew: () => {
    for (let i = 0; i < 8; i++) tone(900 - i * 80, 0.05, {type: 'square', vol: 0.05, at: i * 0.05});
  },
  unlock: () => [392, 523, 659].forEach((f, i) => tone(f, 0.15, {type: 'triangle', at: i * 0.06})),
};
