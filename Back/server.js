const bodyParser = require('body-parser')
const express = require("express");
const app = express();
const db = require("./models");
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/publication');
const commentRoutes = require('./routes/commentaire');
const path = require('path');



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
db.sequelize.sync();




// set port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
