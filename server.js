require("dotenv").load();

var express = require("express"),
  userRoutes = require("./routes/user.routes"),
  app = express(),
  bodyParser = require("body-parser"),
  testHandler = require("./services/testService");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

//index route
app.get("/", function(req, res) {
  //res.json({ message: "hello via json" });
  res.send("hello from root");
});

app.post("/test", testHandler);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("api server is running");
});
