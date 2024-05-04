require("dotenv").config()
const mysql = require('mysql');
const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()
app.use(cors())
app.use(bodyParser.json());

const pool = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
})

// POST --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/login/user", (req, res) => {
    const { username, password } = req.body

    pool.query("SELECT * FROM User WHERE username = ? AND password = ?", [username, password], (err, rows) => {
        if (err) {
            console.log("Error executing query", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json("Pengguna tidak ditemukan")
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
            res.status(404).json("Rekening tidak ditemukan")
            return
        }

        res.json(rows[0])
    })
})

app.post("/rekeningbaru", (req, res) => {
    const { Pemilik, NamaBank, Pin, Saldo } = req.body

    if (!(/^\d{6}$/.test(Pin))) {
        res.status(400).json({ message: "Pin harus berupa 6 digit angka" })
        return
    }

    let MinimalSaldo = 0;

    switch (NamaBank) {
        case "BRI":
            MinimalSaldo = 25000;
            break;
        case "BCA":
            MinimalSaldo = 50000;
            break;
        case "BNI":
            MinimalSaldo = 40000;
            break;
        case "Mandiri":
            MinimalSaldo = 30000;
            break;
        default:
            MinimalSaldo = 0;
            break;
    }

    const NoKartu = Math.floor(10000000 + Math.random() * 90000000);

    pool.query("INSERT INTO Rekening (Pemilik, NamaBank, NoKartu, Pin, Saldo, MinimalSaldo) VALUES (?, ?, ?, ?, ?, ?)", [Pemilik, NamaBank, NoKartu, Pin, Saldo, MinimalSaldo], (err, result) => {
        if (err) {
            console.log("Error executing query:", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        const newAccountId = result.insertId

        pool.query("SELECT * FROM Rekening WHERE ID = ?", [newAccountId], (err, rows) => {
            if (err) {
                res.json("Error executing query", err)
                res.status(500).json({ message: "Internal server error" })
                return
            }
    
            if (rows.length === 0) {
                res.status(404).json({ message: "Rekening tidak ditemukan" })
                return
            }
    
            const newRekening = rows[0]

            res.status(201).json({ 
                message: "Berhasil membuat rekening baru" ,
                data: newRekening
            })
        })
    })
})


app.post("/setor-tunai", (req, res) => {
    const { RekeningId, Nominal } = req.body

    pool.query("SELECT * FROM Rekening WHERE ID = ?", [RekeningId], (err, rows) => {
        if (err) {
            res.json("Error executing query", err)
            res.status(500).json({ message: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json({ message: "Rekening tidak ditemukan" })
            return
        }

        const rekening = rows[0]

        const saldoBaru = rekening.Saldo + Nominal

        pool.query("UPDATE Rekening SET Saldo = ? WHERE ID = ?", [ saldoBaru, RekeningId ], (err, result) => {
            if (err) {
                console.log("Error executing query", err)
                res.status(500).json({ message: "Internal server error" })
                return
            }

            res.status(200).json({ message: `Setor tunai dengan nominal Rp.${Nominal} berhasil`})
        })
    })
})

app.post("/tarik-tunai", (req, res) => {
    const { RekeningId, Nominal } = req.body

    pool.query("SELECT * FROM Rekening WHERE ID = ?", [RekeningId], (err, rows) => {
        if (err) {
            res.json("Error executing query", err)
            res.status(500).json({ message: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json({ message: "Rekening tidak ditemukan" })
            return
        }

        const rekening = rows[0]

        const saldoBaru = rekening.Saldo - Nominal

        if (saldoBaru < rekening.MinimalSaldo) {
            res.status(403).json({ message: `Saldo tidak boleh kurang dari Rp.${rekening.MinimalSaldo}` })
            return
        }

        pool.query("UPDATE Rekening SET Saldo = ? WHERE ID = ?", [ saldoBaru, RekeningId ], (err, result) => {
            if (err) {
                console.log("Error executing query", err)
                res.status(500).json({ message: "Internal server error" })
                return
            }

            res.status(200).json({ message: `Tarik tunai dengan nominal Rp.${Nominal} berhasil`})
        })
    })
})

// GET ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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