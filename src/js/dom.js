// ===== DOM ユーティリティ =====

// id から要素を取得
export const $ = id => document.getElementById(id);

// オーバーレイ等の表示・非表示
export const show = id => $(id).classList.add("show");
export const hide = id => $(id).classList.remove("show");
