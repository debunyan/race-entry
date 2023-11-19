

express + typescript + MongoDB


## Express + typescript の基本環境
https://blog.logrocket.com/how-to-set-up-node-typescript-express/

## Express に API や画面を追加する

https://qiita.com/nkjm/items/723990c518acfee6e473


## MongoDB

https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

MongoDB のホスト名はドットを2つ以上含んだURL形式でないといけない。だから docker-compose.yml でホスト名をその形式にしてある。


Mac に mongo クライアントを入れてチェックする方法。

https://www.wakuwakubank.com/posts/784-server-mongodb-introduction/

### 接続エラー

mongo.db.sv というホスト名で node.js からつなぐと、どうしても、このエラーが出た。

```
{"error":{"code":"ENOTFOUND","syscall":"querySrv","hostname":"_mongodb._tcp.mongo.db.sv"}}
```

この、一番最後の Jason_Tran さんの投稿が原因をはっきりさせてくれる。

https://www.mongodb.com/community/forums/t/cant-connect-to-mongodb-atlas-querysrv-enotfound/127988/18

つまり、DNS のSRV レコードが引けないのが問題。docker-compose の DNS がそこまで対応していないのだ

ホストの指定をIPにしたらうまくいった。
