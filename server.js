var express = require("express"),
  userController = require("./controllers/userController"),
  app = express(),
  bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userController);

//index route
app.get("/", function(req, res) {
  //res.json({ message: "hello via json" });
  res.send("hello from root");
});

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("api server is running");
});
