var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.send("hello");
});

app.get("/speak/dog", function (req, res) {
    res.send("Woof!");
});

app.get("/speak/cat", function (req, res) {
    res.send("Meow");
});

app.get("/repeat/:string/:times", function (req, res) {
    var str = "";
    for (var i = 0; i < req.params.times; i++){
        str += req.params.string + " ";
    }
    res.send(str);
});

app.get("*", function (req, res) {
    res.send("There is nothing in here");
});

app.listen(555,function () {
    console.log("app started");
});