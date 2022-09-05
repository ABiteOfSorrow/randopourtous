let mongoose = require('mongoose');

require("dotenv").config();
const { MONGOLINK } = process.env;


const options = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   connectTimeoutMS: 5000,
}

mongoose.connect(MONGOLINK, options, (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('MongoDB connected');
   }
});

module.exports = mongoose;