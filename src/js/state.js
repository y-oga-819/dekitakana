// ===== アプリ状態とデータモデル =====
import { ANIMALS, GOAL_MINUTES } from "./constants.js";

// records[key] = { slots:[{slot, minutes, grade}], animal: index|null }
// drawCount["y-m"] = その月にガチャを引いた回数
export const state = { y:2026, m:6, records:{}, drawCount:{} };

// 年月日からレコードのキーを作る
export const key = (y, m, d) => `${y}-${m}-${d}`;

// レコードの合計練習分数
export const totalOf = r => r ? r.slots.reduce((a, x) => a + x.minutes, 0) : 0;

// 月ごと: シャッフルしたボックス（ダブり無し）を固定シードで再現する。
// 同じ年月なら常に同じ並びになり、ガチャ結果が再現できる。
export function boxFor(y, m){
  let seed = y * 100 + m, arr = ANIMALS.map((_, i) => i);
  for(let i = arr.length - 1; i > 0; i--){
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor(seed / 233280 * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---- サンプルデータ（6月）----
(function seed(){
  const s = [
    [3,[["あさ",10,"maru"],["がっこうのあと",15,"hanamaru"],["ねるまえ",5,"maru"]]],
    [5,[["あさ",10,"hanamaru"],["がっこうのあと",15,"hanamaru"],["おふろのまえ",5,"maru"]]],
    [6,[["がっこうのあと",10,"maru"],["ねるまえ",5,"sankaku"]]],
    [9,[["あさ",10,"maru"],["がっこうのあと",15,"hanamaru"],["ごはんのまえ",5,"hanamaru"]]],
    [10,[["あさ",5,"sankaku"]]],
    [12,[["あさ",10,"hanamaru"],["がっこうのあと",20,"hanamaru"]]],
    [13,[["がっこうのあと",15,"maru"],["おふろのまえ",10,"maru"],["ねるまえ",5,"hanamaru"]]],
    [16,[["あさ",10,"maru"],["がっこうのあと",10,"sankaku"]]],
    [19,[["あさ",10,"hanamaru"],["がっこうのあと",15,"hanamaru"],["おふろのまえ",5,"maru"]]],
    [20,[["がっこうのあと",10,"maru"]]],
    [23,[["あさ",10,"hanamaru"],["がっこうのあと",15,"maru"],["ねるまえ",5,"maru"]]],
    [24,[["あさ",10,"maru"],["がっこうのあと",10,"hanamaru"]]],
    [26,[["あさ",10,"hanamaru"],["がっこうのあと",15,"hanamaru"],["ごはんのまえ",5,"hanamaru"]]],
  ];
  const box = boxFor(2026, 6);
  let draw = 0;
  s.forEach(([d, slots]) => {
    const total = slots.reduce((a, x) => a + x[1], 0);
    const rec = { slots: slots.map(x => ({ slot:x[0], minutes:x[1], grade:x[2] })), animal:null };
    if(total >= GOAL_MINUTES){ rec.animal = box[draw]; draw++; }
    state.records[key(2026, 6, d)] = rec;
  });
  state.drawCount["2026-6"] = draw;
})();
