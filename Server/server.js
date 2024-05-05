require("dotenv").config()
const mysql = require('mysql');
const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser');
const e = require("express");

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
            res.status(404).json({ error: "Pengguna tidak ditemukan"})
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
            res.status(404).json({ error: "Rekening tidak ditemukan" })
            return
        }

        res.json(rows[0])
    })
})

app.post("/rekeningbaru", (req, res) => {
    const { Pemilik, NamaBank, Pin, Saldo } = req.body

    if (!(/^\d{6}$/.test(Pin))) {
        res.status(400).json({ error: "Pin harus berupa 6 digit angka" })
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
                console.log("Error executing query", err)
                res.status(500).json({ error: "Internal server error" })
                return
            }
    
            if (rows.length === 0) {
                res.status(404).json({ error: "Rekening tidak ditemukan" })
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

app.post("/virtual-account-baru", (req, res) => {
    const { Pemilik, NoTelepon, Jenis, Pin } = req.body

    if (!(/^\d{10,13}$/).test(NoTelepon)) {
        res.status(400).json({ error: "No. Telepon harus berupa 10-13 digit angka" })
        return
    }

    if (!(/^\d{6}$/.test(Pin))) {
        res.status(400).json({ error: "Pin harus berupa 6 digit angka" })
        return
    }

    pool.query("SELECT * FROM VirtualAccount WHERE NoTelepon = ? AND Jenis = ?", [NoTelepon, Jenis], (err, rows) => {
        if (err) {
            console.log("Error executing query:", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length > 0) {
            res.status(409).json({ error: "Nomor telepon sudah terdaftar" })
            return
        }

        pool.query("INSERT INTO VirtualAccount (Pemilik, NoTelepon, Jenis, Pin) VALUES (?, ?, ?, ?)", [Pemilik, NoTelepon, Jenis, Pin], (err, result) => {
            if (err) {
                console.log("Error executing query:", err)
                res.status(500).json({ error: "Internal server error" })
                return
            }
    
            const newAccountId = result.insertId
    
            pool.query("SELECT * FROM VirtualAccount WHERE ID = ?", [newAccountId], (err, rows) => {
                if (err) {
                    console.log("Error executing query", err)
                    res.status(500).json({ error: "Internal server error" })
                    return
                }
    
                res.status(201).json({ 
                    message: "Berhasil membuat virtual account baru" ,
                    data: rows[0]
                })
            })
        })
    })
})

app.post("/setor-tunai", (req, res) => {
    const { RekeningId, Nominal, Pin } = req.body

    pool.query("SELECT * FROM Rekening WHERE ID = ?", [RekeningId], (err, rows) => {
        if (err) {
            console.log("Error executing query", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json({ error: "Rekening tidak ditemukan" })
            return
        }

        const rekening = rows[0]

        if (rekening.Pin !== Pin) {
            res.status(403).json({ error: "Pin yang anda masukkan salah" })
            return
        }

        const saldoBaru = parseInt(rekening.Saldo)  + parseInt(Nominal)

        pool.query("UPDATE Rekening SET Saldo = ? WHERE ID = ?", [ saldoBaru, RekeningId ], (err, result) => {
            if (err) {
                console.log("Error executing query", err)
                res.status(500).json({ error: "Internal server error" })
                return
            }

            res.status(200).json({ message: `Setor tunai dengan nominal Rp.${Nominal} berhasil`})
        })
    })
})

app.post("/tarik-tunai", (req, res) => {
    const { RekeningId, Nominal, Pin } = req.body

    pool.query("SELECT * FROM Rekening WHERE ID = ?", [RekeningId], (err, rows) => {
        if (err) {
            console.log(err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json({ error: "Rekening tidak ditemukan" })
            return
        }

        const rekening = rows[0]

        if (rekening.Pin !== Pin) {
            res.status(403).json({ error: "Pin yang anda masukkan salah" })
            return
        }

        const saldoBaru = parseInt(rekening.Saldo) - parseInt(Nominal)

        if (saldoBaru < parseInt(rekening.MinimalSaldo)) {
            res.status(403).json({ error: `Saldo tidak boleh kurang dari Rp.${rekening.MinimalSaldo}` })
            return
        }

        pool.query("UPDATE Rekening SET Saldo = ? WHERE ID = ?", [ saldoBaru, RekeningId ], (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({ error: "Internal server error" })
                return
            }

            res.status(200).json({ message: `Tarik tunai dengan nominal Rp.${Nominal} berhasil`})
        })
    })
})

app.post("/cek-rekening", (req, res) => {
    const { NoKartu, RekId } = req.body

    pool.query("SELECT * FROM Rekening WHERE NoKartu = ?", [NoKartu], (err, rows) => {
        if (err) {
            console.log("Error executing query", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json({ error: "Rekening tidak ditemukan" })
            return
        }

       const rekening = rows[0]

       if (rekening.ID === RekId) {
        res.status(403).json({ error: "Tidak bisa transfer ke rekening milik sendiri" })
        return
       }

       res.json(rekening)
    })
})

app.post("/transfer", (req, res) => {
    const { DariRekId, NoRekTujuan, Nominal, Pin } = req.body

    pool.query("SELECT * FROM Rekening WHERE ID = ?", [DariRekId], (err, rows) => {
        if (err) {
            console.log(err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        if (rows.length === 0) {
            res.status(404).json({ error: "Rekening tidak ditemukan" })
            return
        }

        const rekeningPengirim = rows[0]

        if (NoRekTujuan === rekeningPengirim.NoKartu) {
            res.status(400).json({ error: "Tidak bisa transfer ke rekening milik sendiri"})
            return
        }

        if (rekeningPengirim.Pin !== Pin) {
            res.status(403).json({ error: "Pin yang anda masukkan salah" })
            return
        }

        if (parseInt(rekeningPengirim.Saldo) < parseInt(Nominal)) {
            res.status(403).json({ error: `Saldo tidak mencukupi` })
            return
        }

        pool.query("SELECT * FROM Rekening WHERE Nokartu = ?", [NoRekTujuan], (err, rows) => {
            if (err) {
                console.log(err)
                res.status(500).json({ error: "Internal server error" })
                return
            }

            if (rows.length === 0) {
                res.status(404).json({ error: "Rekening tidak ditemukan" })
                return
            }

            const rekeningPenerima = rows[0]

            const namaBankPenerima = rekeningPenerima.NamaBank

            let biayaAdmin = 0;

            switch (namaBankPenerima) {
                case "BRI":
                    biayaAdmin = 2500;
                    break;
                case "BCA":
                    biayaAdmin = 5000;
                    break;
                case "BNI":
                    biayaAdmin = 1700;
                    break;
                case "Mandiri":
                    biayaAdmin = 4000;
                    break;
                default:
                    biayaAdmin = 10000;
                    break;
            }

            const saldoSetelahTransfer = parseInt(rekeningPengirim.Saldo) - parseInt(Nominal) - parseInt(biayaAdmin)

            if (saldoSetelahTransfer < parseInt(rekeningPengirim.MinimalSaldo)) {
                res.status(403).json({ error: `Saldo tidak boleh kurang dari Rp.${rekeningPengirim.MinimalSaldo}` })
                return
            }

            pool.query("UPDATE Rekening SET Saldo = ? WHERE ID = ?", [ saldoSetelahTransfer, DariRekId ], (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ error: "Internal server error" })
                    return
                }

                const saldoPenerima = parseInt(rekeningPenerima.Saldo) + parseInt(Nominal)

                pool.query("UPDATE Rekening SET Saldo = ? WHERE ID = ?", [ saldoPenerima, rekeningPenerima.ID ], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({ error: "Internal server error" })
                        return
                    }

                    const tanggalTransfer = new Date().toISOString().slice(0, 19).replace('T', ' ')
                    pool.query("INSERT INTO Transfer (DariRekId, KeRekId, Tanggal, Nominal) VALUES (?, ?, ?, ?)", [DariRekId, rekeningPenerima.ID, tanggalTransfer, Nominal], (err, result) => {
                        if (err) {
                            console.log(err)
                            res.status(500).json({ error: "Internal server error" })
                            return
                        }

                        res.status(200).json({ 
                            message: `Transfer ke rekening ${rekeningPenerima.NamaBank} atas nama ${rekeningPenerima.Pemilik} dengan nominal Rp.${Nominal} berhasil`,
                            data: `Rp.${biayaAdmin}`
                        })
                    })
                })
            })
        })
    })
})

// GET ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/rekening", (req, res) => {
    pool.query("SELECT * FROM Rekening", (err, rows) => {
        if (err) {
            console.log("Gagal mendapatkan semua rekening", err)
            res.status(500).json({ error: "Internal server error" })
            return
        }

        res.json(rows)
    })
})

app.get("/virtual-account", (req, res) => {
    pool.query("SELECT * FROM VirtualAccount", (err, rows) => {
        if (err) {
            console.log("Gagal mendapatkan semua virtual account", err)
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
            res.status(500).json({ error: "Internal server error" })
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

const PORT = process.env.EXPRESS_PORT
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})