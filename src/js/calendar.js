// ===== カレンダー描画 =====
import { state, key, totalOf } from "./state.js";
import { ANIMALS, GRADE_MK, TODAY, GOAL_MINUTES } from "./constants.js";
import { $ } from "./dom.js";
import { openDetail } from "./detail.js";

// 月の日数
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
// 月初の曜日（0=日）
const firstDow = (y, m) => new Date(y, m - 1, 1).getDay();

// その月に獲得済みのどうぶつ一覧
function monthAnimals(y, m){
  const out = [];
  for(let d = 1; d <= daysInMonth(y, m); d++){
    const r = state.records[key(y, m, d)];
    if(r && r.animal != null) out.push(r.animal);
  }
  return out;
}

// 現在の state.y / state.m のカレンダーを描画する
export function renderCalendar(){
  $("mlabel").textContent = state.m + "がつ";
  const got = monthAnimals(state.y, state.m);
  $("collectN").textContent = got.length;
  const grid = $("grid");
  grid.innerHTML = "";
  const lead = firstDow(state.y, state.m), dim = daysInMonth(state.y, state.m);
  for(let i = 0; i < lead; i++){
    const e = document.createElement("div");
    e.className = "cell empty";
    grid.appendChild(e);
  }
  for(let d = 1; d <= dim; d++){
    const r = state.records[key(state.y, state.m, d)];
    const tot = totalOf(r), achieved = tot >= GOAL_MINUTES;
    const cell = document.createElement("div");
    cell.className = "cell" + (achieved ? " achieved" : "") +
      (state.y === TODAY.y && state.m === TODAY.m && d === TODAY.d ? " today" : "");
    let inner = `<div class="dnum">${d}</div>`;
    if(achieved) inner = `<span class="crown">👑</span>` + inner;
    if(r){
      if(r.animal != null) inner += `<div class="animal">${ANIMALS[r.animal]}</div>`;
      else inner += `<div class="animal-blank"></div>`;
      inner += `<div class="marks" data-n="${r.slots.length}">` +
        r.slots.map(s => `<span class="mk">${GRADE_MK[s.grade]}</span>`).join("") + `</div>`;
    }else{
      inner += `<div class="animal-blank"></div><div class="marks"></div>`;
    }
    cell.innerHTML = inner;
    if(r) cell.onclick = () => openDetail(d);
    grid.appendChild(cell);
  }
}
