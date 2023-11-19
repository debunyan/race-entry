set -e

mongosh <<EOF
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')

db = db.getSiblingDB("$MOUNTAIN_DB");
db.createUser({
    user: "$MOUNTAIN_DB",
    pwd: "$MOUNTAIN_PASSWORD",
    roles: [{role:"readWrite",db: "$MOUNTAIN_DB"}]
})

db.createCollection("users")
db.createCollection("files")

db.createCollection("events")
db.createCollection("sensors")
db.createCollection("spots")

db.createCollection("races")
db.createCollection("checkpoints")

db.createCollection("entries")

db.createCollection("terreins")

EOF
