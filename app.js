const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const configPassport = require("./config/passport");
const app = express();
const PORT = process.env.PORT || 5000;

//Mongoose
const dbURI = require("./config/keys").mongoURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true })
  .then(() => console.log("Mongo DB Connected"))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Express-Sessions
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
configPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//Connect-Flash
app.use(flash());

//Global Vars
app.use(require("./config/flash"));

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use(
  "/dashboard",
  require("./middleware/auth").ensureAuthenticated,
  require("./routes/dashboard")
);

app.listen(PORT, () => console.log(`Server Started On ${PORT}`));
