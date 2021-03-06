const express = require("express");
const cors = require('cors');
const app = express();
const fs = require("fs");
const jsonParser = express.json();
const PORT = process.env.PORT || 8080
app.use(cors());

app.listen(PORT, () => {
    console.log("Server running");
});

const filePath = "notes.json";

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