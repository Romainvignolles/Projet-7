module.exports = (sequelize, Sequelize) => {
  const comment = sequelize.define("commentaire", {
    commentContent: {
      type: Sequelize.STRING,
      unique: false
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
  return comment;
};