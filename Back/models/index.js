const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.js")(sequelize, Sequelize);
db.post = require("./publication.js")(sequelize, Sequelize);
db.comment = require("./commentaire.js")(sequelize, Sequelize);

db.post.belongsTo(db.user);  //post appartient a User
db.user.hasMany(db.post);    //User possede plusieur Post

db.comment.belongsTo(db.user);  //comment appartient a User
db.user.hasMany(db.comment);    //user possede plusieur comment

db.comment.belongsTo(db.post); //comment appartient a post
db.post.hasMany(db.comment);   //post possede plusieur comment




module.exports = db;
