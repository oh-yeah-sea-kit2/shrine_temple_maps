# shrine_temple_maps

## URL
- http://dev.oh-yeah-sea-kit2.work/shrine/zipcode?zipcode=1320013&range=10000

## 利用予定技術
- leaflet
- jQuery

## 概要
- とにかく神社の地図表示をさせる

## 機能一覧
- GeoJSON形式のデータを描画
- 現在地取得→付近の神社を検索
- 地点を選択→付近の神社を検索
- 神社の周囲が森に囲まれているフィルタ機能

## 動作確認
- live-server ./src

## deploy

### デプロイ先
- https://shrine-temple-search-map.firebaseapp.com/

### deploy方法
- firebase login
- firebase deploy
- firebase logout

## 今後予定(2020/03/11)
- GoogmeMapsっぽい画面を目指す
	- メニューの追加
- 問い合わせ（バグ報告、画像つき）ページ追加。Goggleフォーム
- 地図上にフィルタ項目をつける
- ピンクリックで詳細画面をポップアップ表示
	- 名称、住所、電話番号、画像が出せる
	- 地点をお気に入りなどリスト登録

## 参考になりそうなリンク
- [leafletの地図にピンの代わりに文字を出す](https://www.achiachi.net/blog/leaflet/divicon)
- [マーカークリック時に別アクションを呼び出す](https://www.achiachi.net/blog/leaflet/clickevent)
  - GoogleMapsっぽい挙動で下からポップアップ？的に詳細画面を出す



