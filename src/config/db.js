const mongoose = require('mongoose');


function connectDB(){
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch(err => {
    console.log("error connecting to db",err);
    process.exit(1);
  })
}
module.exports = connectDB;