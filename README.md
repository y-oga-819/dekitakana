# dekitakana
毎日習慣づけるアプリ

## ぴあの れんしゅう（`piano.html`）

子ども向けのピアノ練習トラッカーのプロトタイプ。練習を報告すると、30分達成でガチャを引いてどうぶつを集められる。

### 起動方法

ES Modules を使っているため、`file://` で直接開くと動きません。ローカルサーバ経由で開いてください。

```bash
python3 -m http.server 8000
# ブラウザで http://localhost:8000/piano.html を開く
```

### 公開（GitHub Pages）

ビルド不要の静的サイトなので、そのまま GitHub Pages で公開できます。
パスはすべて相対参照のため、プロジェクトページ（`https://<user>.github.io/dekitakana/`）でも動作します。

- `main` への push で `.github/workflows/pages.yml` が自動デプロイします。
- ワークフローが Pages を自動有効化（`enablement: true`）するため、手動設定は不要です。
- 公開後の URL: `https://<user>.github.io/dekitakana/`（ルートは `index.html` から `piano.html` に転送）

### ファイル構成

元々 1 ファイルに HTML / CSS / JS が全部入っていたものを、機能ごとに分割しています。

```
piano.html              アプリのシェル（マークアップと読み込みのみ）
src/
  styles/               機能ごとに分けた CSS
    tokens.css          デザイントークン（色・フォント変数）
    base.css            リセットとアプリシェル
    calendar.css        ヘッダー・月ナビ・カレンダー・FAB
    overlay.css         オーバーレイ／シート共通
    report.css          練習報告 UI（鍵盤セレクタ・評価ボタン等）
    gacha.css           ガチャ演出
    detail.css          日詳細
    responsive.css      モーション軽減・レスポンシブ
  js/                   ES Modules（責務ごとに分割）
    constants.js        ドメイン定数（どうぶつ・時間帯・評価など）
    dom.js              DOM ユーティリティ（$ / show / hide）
    state.js            状態とデータモデル・サンプルデータ
    calendar.js         カレンダー描画
    detail.js           日詳細の表示
    report.js           練習報告フロー（いつ→なんぷん→どうだった）
    gacha.js            ガチャ演出
    main.js             エントリポイント（初期化とイベント配線）
```

### 依存関係

```
main.js ─┬─ calendar.js ── detail.js
         ├─ report.js ──┬─ calendar.js
         │              └─ gacha.js
         └─ gacha.js

constants.js / dom.js / state.js … 共通の下位レイヤー（循環依存なし）
```
