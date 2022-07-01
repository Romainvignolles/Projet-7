module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("utilisateur", {
    pseudo: {
      type: Sequelize.STRING,
      unique: true
    },
      email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "http://localhost:8080/images/istockphoto-1300845620-612x612.jpg"
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "user"
    },
  });
  return user;
};