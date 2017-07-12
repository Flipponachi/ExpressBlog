var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
mongoose.connect("mongodb://localhost/john_app");
var johnSchema = new mongoose.Schema({
    name: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now}
});

var John = mongoose.model("John", johnSchema);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));


// John.create ({
//     name: "Monkey",
//     image: "https://farm3.staticflickr.com/2331/1796010393_492d4d583a.jpg",
//     body: "Junkyard and stuffs ensure that a monkey created is a dog on rabbid madness"
// }, function(err,created){
//     if(err){
//         console.log(err)
//     }else{
//         console.log("Created in the database")
//     }
// });

//====================================ROUTES======================================
app.get("/", function(req, res){
    res.redirect("/blog")
});

// ==========INDEX PAGE=====
app.get("/blog", function(req, res) {
    John.find({}, function(err, john){
        if(err){
            console.log(err)
        }else{
            res.render("index", {john: john})
        }
    })
});
//=====END OF INDEX PAGE ROUTE======

//=====CREATION OF FORM======
app.get("/blog/new", function(req, res){
    res.render("form")
});

app.post("/blog", function(req, res){
    John.create(req.body.john, function(err, Data){
        if(err){
            res.render("form")
        }else{
            res.redirect("/blog");
        }
    })
})
//======END OF FORM CREATION ROUTE


//=======SHOW ROUTE- SPECIFIC ROUTE========
app.get("/blog/:id", function(req, res) {
    John.findById(req.params.id, function(err, found){
        if(err){
            console.log(err)
        }else{
            res.render("specific", {found: found})
        }
    })
});
//=======END OF SHOW ROUTE- SPECIFIC ROUTE========


//========EDIT ROUTE PAGE AND UPDATE===================
app.get("/blog/:id/edit", function(req, res) {
  John.findById(req.params.id, function(err, found){
      if(err){
          console.log(err)
      }else{
          res.render("edit", {john: found})
      }
  }) 
});

app.put("/blog/:id", function(req, res){
    John.findByIdAndUpdate(req.params.id, req.body.john, function(err, newBlog){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blog/" + req.params.id)
        }
    } )
});
//========END OF EDIT ROUTE PAGE=============

//============DELETE ROUTE PAGE============
app.delete("/blog/:id", function(req, res){
    John.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blog")
        }
    })
})
//==========END OF DELETE ROUTE PAGE========

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is Live")
});