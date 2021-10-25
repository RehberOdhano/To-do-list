const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

// it is possible to push items into the const array but we can't assign it with
// the new array and same goes for the objects
const items = ["Task 1", "Task 2", "Task 3"];
const workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// using the ejs
app.set("view engine", "ejs");

// res.render() -> this method uses the view engine to render a particular page and that
// page would be filename.ejs
// by default the view engine goes to the "views" directory and will look for the files that
// we're trying to render

app.get("/", function (req, res) {
    // res.send("To-do-list");
    const day = date.getDate();
    res.render("list", {listTitle: day, newListItems: items});
});

app.post("/", function (req, res) {
    // console.log(req.body.newItem);
    const item = req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function (req, res) {
   res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function (req, res) {
    res.render("about");
})

app.post("/work", function (req, res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000, function () {
    console.log("Server is running on port 3000...");
})
