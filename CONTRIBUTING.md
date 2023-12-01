# 一番最初の起動


## Mac の調整

```
brew install make
```

### コンテナのビルドと起動


```
make build
make up
```

コンテナは起動しますが、Webサービスはこれだけでは自動起動しません。

### サーバプログラムの起動

node のコンテナシェルには入る

```
make node-server-sh
```

npm のインストールと開発モードでサーバ起動

```
npm install
npm run dev
```

以下のURLを開く

http://localhost:8002


