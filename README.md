# ラブマップ (Love Map)

恋愛関係を可視化するアプリケーション

## 概要

ラブマップは、人々の恋愛関係をグラフィカルに表示し、視覚的に理解しやすくするWebアプリケーションです。登場人物とその関係性を追加することで、複雑な恋愛関係をネットワークグラフとして表示します。

## 主な機能

- 登場人物の追加・編集・削除
- 関係性の追加・編集・削除
- 男性→女性、女性→男性の関係性の切り替え表示
- プロフィール情報の管理
- グラフの双方向操作（ズーム、パン）
- レスポンシブデザイン対応
- リアルタイムデータ同期（Firebase）

## 技術スタック

- React
- TypeScript
- Tailwind CSS
- Firebase (Firestore)
- Sigma.js / Graphology
- Vite

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone <repository-url>
cd relationship-network-app
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
`.env`ファイルを作成し、以下の Firebase の設定を追加:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. 開発サーバーの起動
```bash
npm run dev
```

## ビルドとデプロイ

プロダクションビルドの作成:
```bash
npm run build
```

## ライセンス

MIT

## 作者

[Your Name]