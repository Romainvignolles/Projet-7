module.exports = (sequelize, Sequelize) => {
  const post = sequelize.define("publication", {

    textContent: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    likes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dislikes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    usersLiked: {
      type: Sequelize.STRING,
      allowNull: false,
     
    },
    usersDisliked: {
      type: Sequelize.STRING,
      allowNull: false,
     
    }
  });
  return post;
};