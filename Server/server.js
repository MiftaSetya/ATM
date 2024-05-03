require("dotenv").config()
const mysql = require('mysql');
const express = require("express");
const app = express()

const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
})

app.use(express.json())

app.post("/login/user", (req, res) => {
    const { username, password } = req.body

    pool.query("SELECT * FROM User WHERE username = ? AND password = ?", [username, password], (err, rows) => {
        if (err) {
            console.log("Error executing query", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.json("Pengguna tidak ditemukan")
            return
        }

        res.json(rows[0])
    })
})

app.post("/login/customer", (req, res) => {
    const { NoKartu, Pin } = req.body

    pool.query("SELECT * FROM Rekening WHERE NoKartu = ? AND Pin = ?", [NoKartu, Pin], (err, rows) => {
        if (err) {
            console.log("Error executing query", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.json("Rekening tidak ditemukan")
            return
        }

        res.json(rows[0])
    })
})

app.get("/rekening", (req, res) => {
    pool.query("SELECT * FROM Rekening", (err, rows) => {
        if (err) {
            res.json("Gagal mendapatkan semua rekening")
            res.status(500).json({ error: "Internal server error" })
            return
        }

        res.json(rows)
    })
})

app.post("/rekeningbaru", (req, res) => {
    const { Pemilik, NamaBank, NoKartu, Pin, Saldo } = req.body;

    pool.query("INSERT INTO Rekening (Pemilik, NamaBank, NoKartu, Pin, Saldo) VALUES (?, ?, ?, ?, ?)", [Pemilik, NamaBank, NoKartu, Pin, Saldo], (err, result) => {
        if (err) {
            console.log("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" })
            return
        }

        res.status(201).json({ message: "Berhasil membuat rekening baru"})
    })
})

app.get("/saldo/:id", (req, res) => {
    const rekeningId = req.params.id    

    pool.query("SELECT Saldo FROM Rekening Where ID = ?", [rekeningId], (err, rows) => {
        if (err) {
            res.json("Gagal cek saldo", err)
            res.status(500).json({ message: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json("Rekening tidak ditemukan")
            return
        }

        const saldo = rows[0]
        res.json(saldo)
    })
})

app.get("/user", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("Error getting mysql from pool ", err)
            res.status(500).json({ error: "Internal server error"})
            return
        }

        connection.query("SELECT * FROM User", (err, rows) => {
            connection.release()

            if (err) {
                console.log("Error executing query", err)
                res.status(500).json({ error: "Internal server error" })
            }

            res.json(rows)
        })
    })
})

const PORT = process.env.EXPRESS_PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})