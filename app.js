const express = require("express");
const cors = require('cors');
const fs = require("fs");
const jsonParser = express.json();
const app = express();
const PORT = process.env.PORT || 8080
app.use(cors({
    origin: 'https://stark-shelf-84244.herokuapp.com'
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.listen(PORT, () => {
    console.log("Server running");
});

const filePath = "notes.json";
app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get("/notes", function (req, res) {
    const content = fs.readFileSync(filePath, "utf8");
    const notes = JSON.parse(content);
    res.send(notes);
});

app.post("/createNote", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let note = req.body;
    let data = fs.readFileSync(filePath, "utf8");
    let notes = JSON.parse(data);
    notes.push(note);
    data = JSON.stringify(notes);
    fs.writeFileSync("notes.json", data);
    res.send(note);
});

app.post("/editNote", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let note = req.body;
    let data = fs.readFileSync(filePath, "utf8");
    let notes = JSON.parse(data);
    const editedNotes = notes.map(o => o.id === note.id ? note : o)
    data = JSON.stringify(editedNotes);
    fs.writeFileSync("notes.json", data);
    res.send(note);
});

app.delete("/deleteNote", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let note = req.body.source;
    console.log(note)
    let data = fs.readFileSync(filePath, "utf8");
    let notes = JSON.parse(data);
    const editedNotes = notes.filter(o => o.id !== note.id)
    data = JSON.stringify(editedNotes);
    fs.writeFileSync("notes.json", data);
    res.send(note);
});