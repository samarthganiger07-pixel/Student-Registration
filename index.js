const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("data.db");

app.use(cors());
app.use(express.json());

// Create Table
db.prepare(`
CREATE TABLE IF NOT EXISTS hotels(
id INTEGER PRIMARY KEY AUTOINCREMENT,
hotel_name TEXT,
manager_name TEXT,
location TEXT,
rooms INTEGER,
available_rooms INTEGER,
price REAL
)
`).run();

// GET All Hotels
app.get("/hotels", (req, res) => {
    const hotels = db.prepare("SELECT * FROM hotels").all();
    res.json(hotels);
});

// GET Single Hotel
app.get("/hotels/:id", (req, res) => {
    const hotel = db.prepare("SELECT * FROM hotels WHERE id=?").get(req.params.id);

    if (!hotel)
        return res.status(404).json({ message: "Hotel not found" });

    res.json(hotel);
});

// POST Hotel
app.post("/hotels", (req, res) => {

    const {
        hotel_name,
        manager_name,
        location,
        rooms,
        available_rooms,
        price
    } = req.body;

    const result = db.prepare(`
    INSERT INTO hotels
    (hotel_name,manager_name,location,rooms,available_rooms,price)
    VALUES(?,?,?,?,?,?)
    `).run(
        hotel_name,
        manager_name,
        location,
        rooms,
        available_rooms,
        price
    );

    res.json({
        message: "Hotel Added",
        id: result.lastInsertRowid
    });
});

// UPDATE
app.put("/hotels/:id", (req, res) => {

    const {
        hotel_name,
        manager_name,
        location,
        rooms,
        available_rooms,
        price
    } = req.body;

    db.prepare(`
    UPDATE hotels
    SET
    hotel_name=?,
    manager_name=?,
    location=?,
    rooms=?,
    available_rooms=?,
    price=?
    WHERE id=?
    `).run(
        hotel_name,
        manager_name,
        location,
        rooms,
        available_rooms,
        price,
        req.params.id
    );

    res.json({ message: "Hotel Updated" });

});

// DELETE
app.delete("/hotels/:id", (req, res) => {

    db.prepare("DELETE FROM hotels WHERE id=?").run(req.params.id);

    res.json({
        message: "Hotel Deleted"
    });

});

app.listen(5000, () => {
    console.log("Server Running on http://localhost:5000");
});