import mongoose = require('mongoose');

const MONGOLINK = process.env.MONGOLINK || "";
if (!MONGOLINK) throw new Error("Please provide MONGOLINK env variable.");

const mongoOptions = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   connectTimeoutMS: 5000,
}

mongoose.connect(MONGOLINK, mongoOptions, (err) => {
   if (err) console.log(err)
   else console.log('MongoDB connected');
});

module.exports = mongoose;
export default mongoose;