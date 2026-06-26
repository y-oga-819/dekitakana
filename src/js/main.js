// ===== エントリポイント：初期化とイベント配線 =====
import { state } from "./state.js";
import { TODAY } from "./constants.js";
import { $, show, hide } from "./dom.js";
import { renderCalendar } from "./calendar.js";
import { buildSlots, buildKeyboard, pickGrade, finishReport, resetReport } from "./report.js";
import { resetGachaStage } from "./gacha.js";

// ---- 月ナビ ----
$("prevM").onclick = () => { state.m--; if(state.m < 1){ state.m = 12; state.y--; } renderCalendar(); };
$("nextM").onclick = () => { state.m++; if(state.m > 12){ state.m = 1; state.y++; } renderCalendar(); };

// ---- 練習報告フロー ----
$("fab").onclick = () => { resetReport(); show("repSlot"); };
$("cancelRep0").onclick = () => hide("repSlot");
$("backToSlot").onclick = () => { hide("repTime"); show("repSlot"); };
$("toGrade").onclick = () => { hide("repTime"); show("repGrade"); };
$("backToTime").onclick = () => { hide("repGrade"); show("repTime"); };
document.querySelectorAll(".grade").forEach(el => el.onclick = () => pickGrade(el.dataset.g));
$("finishRep").onclick = finishReport;

// ---- ガチャ → カレンダーへ ----
$("toMeadowBtn").onclick = () => {
  hide("gacha");
  resetGachaStage();
  state.y = TODAY.y;
  state.m = TODAY.m;
  renderCalendar();
};

// ---- 日詳細 ----
$("closeDetail").onclick = () => hide("detail");

// ---- 初期描画 ----
buildSlots();
buildKeyboard();
renderCalendar();
