const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const itemSchema = new mongoose.Schema({
    item: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    item: "Task 1"
});

const item2 = new Item({
    item: "Task 2"
});

const item3 = new Item({
    item: "Task 3"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems, function (err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Successfully saved default items to the database");
//     }
// });


app.get("/", function (req, res) {

    Item.find({}, function (err, items) {
        if(err) {
            console.log(err);
        } else if (items.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to the database");
                    res.redirect("/");
                }
            });
        } else {
            // items.forEach( function(items) {
            //     console.log(items);
            // });
            res.render("list", {listTitle: "Today", newListItems: items});
        }
    });
});

// working with dynamic routes
app.get("/:customListName", function (req, res) {
    // now we've access to the new list
    const customListName = _.capitalize(req.params.customListName);

    // checking if there already exist a list with the same name
    List.findOne({name: customListName}, function (err, foundList) {
        if (err) {
            console.log(err);
        } else if (!foundList) {
            const list = new List({
                name: customListName,
                items: []
            });
            list.save();
            res.redirect("/"+customListName);
        } else {
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
    });
});

app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        item: itemName
    });

    if(listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        // this function must have a callback in order to execute
        Item.findByIdAndRemove(checkedItemID, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully Deleted!");
                res.redirect("/");
            }
        });
    } else {
        // deleting the items from the custom lists
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function (err, foundList) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/"+listName);
            }
        })
    }
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
