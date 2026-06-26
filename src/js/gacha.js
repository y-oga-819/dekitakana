// ===== ガチャ演出 =====
import { ANIMALS, ANIMAL_NAMES } from "./constants.js";
import { $, show } from "./dom.js";

// ガチャを開始する（マシンをタップ待ち状態にする）
export function startGacha(idx){
  $("winName").textContent = "";
  $("winName").classList.remove("show");
  $("toMeadowBtn").style.display = "none";
  const m = $("machine"), hint = $("tapHint");
  m.style.display = "";
  hint.style.display = "";
  m.onclick = () => runGachaAnim(idx);
  show("gacha");
}

// カプセルが出てどうぶつが現れる一連のアニメーション
function runGachaAnim(idx){
  const stage = $("stage"), machine = $("machine"), hint = $("tapHint");
  machine.onclick = null;
  hint.style.display = "none";
  machine.style.display = "none";

  // カプセル転がる
  const cap = document.createElement("div");
  cap.className = "capsule";
  cap.style.animation = "rollIn .9s ease-out forwards";
  stage.appendChild(cap);

  // 擬音
  const ono = document.createElement("div");
  ono.className = "onoma";
  stage.appendChild(ono);
  setTimeout(() => { ono.textContent = "ガラガラ…"; ono.style.animation = "onomaPop .9s forwards"; }, 60);

  // パカッ
  setTimeout(() => {
    cap.style.animation = "openPop .4s ease-in forwards";
    const o2 = document.createElement("div");
    o2.className = "onoma";
    o2.style.top = "60px";
    o2.textContent = "パカッ！";
    stage.appendChild(o2);
    o2.style.animation = "onomaPop .5s forwards";
  }, 1000);

  // パパーン＋どうぶつ
  setTimeout(() => {
    const a = document.createElement("div");
    a.className = "reveal-animal";
    a.textContent = ANIMALS[idx];
    a.style.animation = "burstIn .5s cubic-bezier(.2,1.4,.4,1) forwards";
    stage.appendChild(a);
    const o3 = document.createElement("div");
    o3.className = "onoma";
    o3.style.top = "0";
    o3.textContent = "パパーン！🎉";
    stage.appendChild(o3);
    o3.style.animation = "onomaPop .7s forwards";
    // 紙吹雪
    for(let i = 0; i < 14; i++){
      const s = document.createElement("div");
      s.className = "spark";
      s.textContent = ["✨","🎊","⭐️","🎉","💫"][i % 5];
      const ang = (i / 14) * Math.PI * 2, dist = 120 + Math.random() * 40;
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      s.style.animation = `sparkFly ${.7 + Math.random() * .3}s ease-out forwards`;
      stage.appendChild(s);
    }
    const nm = $("winName");
    nm.textContent = `${ANIMAL_NAMES[idx]} が なかまに なったよ！`;
    nm.classList.add("show");
    $("toMeadowBtn").style.display = "";
  }, 1450);
}

// ガチャ演出で生成した要素を片付ける
export function resetGachaStage(){
  const stage = $("stage");
  [...stage.querySelectorAll(".capsule,.onoma,.reveal-animal,.spark")].forEach(e => e.remove());
}
