const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/userApi");
const routerMail = require("./routes/emailApi");
const uploadPicture = require("./routes/fileApi");
const dataBase = require("./DataBase/db");
const routerPass = require("./routes/resetTokenApi");
const cors = require('cors'); 

const passport = require("passport");

require("./DataBase/passport");
const app = express();
app.use(cors());
app.use(passport.initialize());

// cron.schedule('*/2 * * * *', () => {
//   console.log('running a task every two minutes');
// });

app.use(bodyParser.json());
app.use("/", routerMail);
app.use("/", routes);
app.use("/", uploadPicture);
app.use("/", routerPass);



app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
