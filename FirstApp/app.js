var express = require("express");
var app = express();

function getRoot(req,res){
    res.send("Hello in our new application;D")
    console.log("GET '/' response send");
}

function getCat(req,res){
    res.send("CAT");
    console.log("GET '/cat' response send");
}

app.get("/", getRoot);

app.get("/cat", getCat);

app.listen(555, function(){
    console.log("Server running");
});