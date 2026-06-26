// ===== 日詳細 =====
import { state, key, totalOf } from "./state.js";
import { ANIMALS, GRADE_MK } from "./constants.js";
import { $, show } from "./dom.js";

// 指定日のレコードを詳細シートに表示する
export function openDetail(d){
  const r = state.records[key(state.y, state.m, d)];
  if(!r) return;
  $("detTitle").textContent = `${state.m}がつ ${d}にち`;
  $("detAnimal").textContent = r.animal != null ? ANIMALS[r.animal] : "";
  $("detRows").innerHTML = r.slots.map(s =>
    `<div class="det-row"><span class="slot">${s.slot}</span><span class="mk" style="font-size:20px">${GRADE_MK[s.grade]}</span><span class="dmin">${s.minutes}ぷん</span></div>`).join("");
  $("detTotal").textContent = totalOf(r);
  show("detail");
}
