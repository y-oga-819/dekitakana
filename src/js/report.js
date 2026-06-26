// ===== 練習報告（いつ → なんぷん → どうだった）=====
import { state, key, totalOf, boxFor } from "./state.js";
import { SLOTS, MIN_OPTS, TODAY, GOAL_MINUTES } from "./constants.js";
import { $, show, hide } from "./dom.js";
import { renderCalendar } from "./calendar.js";
import { startGacha } from "./gacha.js";

// 入力途中の練習報告
let rep = { slot:null, minutes:null, grade:null };

// 時間帯（いつ）の選択肢を生成
export function buildSlots(){
  const wrap = $("slotList");
  wrap.innerHTML = "";
  SLOTS.forEach(([name, ic]) => {
    const b = document.createElement("button");
    b.className = "slot-opt";
    b.innerHTML = `<span class="si">${ic}</span>${name}`;
    b.onclick = () => { rep.slot = name; hide("repSlot"); show("repTime"); };
    wrap.appendChild(b);
  });
}

// 鍵盤型の分数セレクタを生成
export function buildKeyboard(){
  const kb = $("keyboardSel");
  kb.innerHTML = "";
  MIN_OPTS.forEach(m => {
    const b = document.createElement("button");
    b.className = "kkey";
    b.dataset.min = m;
    b.innerHTML = `${m}<small>ふん</small>`;
    b.onclick = () => pickTime(m);
    kb.appendChild(b);
  });
  const more = document.createElement("button");
  more.className = "kkey more";
  more.dataset.min = 35;
  more.innerHTML = `もっと<small>30ぷん+</small>`;
  more.onclick = () => pickTime(35);
  kb.appendChild(more);
}

// 分数を選んだときの見た目と状態更新
function pickTime(m){
  rep.minutes = m;
  [...$("keyboardSel").children].forEach(k => {
    const km = +k.dataset.min;
    k.classList.toggle("lit", km <= m && km <= 30);
    k.classList.toggle("sel", km === m);
  });
  $("timeReadout").textContent = m >= 35 ? "30ぷん いじょう がんばった！🎉" : `${m}ぷん れんしゅう したよ`;
  $("toGrade").disabled = false;
}

// 評価（質）を選んだときの状態更新
export function pickGrade(g){
  rep.grade = g;
  document.querySelectorAll(".grade").forEach(el => el.classList.toggle("sel", el.dataset.g === g));
  $("finishRep").disabled = false;
}

// 報告を確定し、30分到達なら未獲得時にガチャを引く
export function finishReport(){
  const d = TODAY.d, k = key(TODAY.y, TODAY.m, d);
  const minutes = rep.minutes >= 35 ? 30 : rep.minutes; // 「もっと」は30で計上（プロト簡略）
  const slot = rep.slot;
  if(!state.records[k]) state.records[k] = { slots:[], animal:null };
  state.records[k].slots.push({ slot, minutes, grade: rep.grade });
  hide("repGrade");

  // この時点の合計で30分到達＆未獲得ならガチャ
  const rec = state.records[k], tot = totalOf(rec);
  if(tot >= GOAL_MINUTES && rec.animal == null){
    // 月のボックスから次を引く
    const mk = `${state.y}-${state.m}`;
    const box = boxFor(state.y, state.m);
    const cnt = state.drawCount[mk] || 0;
    const idx = box[cnt % 31];
    state.drawCount[mk] = cnt + 1;
    rec.animal = idx;
    startGacha(idx);
  }else{
    state.y = TODAY.y;
    state.m = TODAY.m;
    renderCalendar();
  }
}

// 練習報告フローを初期状態に戻す（FAB を押したとき）
export function resetReport(){
  rep = { slot:null, minutes:null, grade:null };
  [...$("keyboardSel").children].forEach(k => k.classList.remove("lit", "sel"));
  $("timeReadout").textContent = "えらんでね";
  $("toGrade").disabled = true;
  document.querySelectorAll(".grade").forEach(el => el.classList.remove("sel"));
  $("finishRep").disabled = true;
}
