let mongoose = require('mongoose');

const options = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   connectionTimeoutMS: 5000,
}

const mongoLink = 'mongodb+srv://rupo:randopourtous50@randopourtous.1w4rx.mongodb.net/randoPourTous?retryWrites=true&w=majority';

mongoose.connect(mongoLink, options, (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('MongoDB connected');
   }
});

module.exports = mongoose;