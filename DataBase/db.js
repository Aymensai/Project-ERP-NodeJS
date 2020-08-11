const mongoose  = require('mongoose');
mongoose.connect("mongodb://localhost/dataBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => console.log("connected"))
  .catch((err) => console.log("error", err));
  