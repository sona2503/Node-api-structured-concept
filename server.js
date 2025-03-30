const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Konfigurasi koneksi ke database "kantor"
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // sesuaikan dengan username database kamu
  password: '', // sesuaikan dengan password database kamu
  database: 'kantor'
});

// Membuka koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to DB:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// Endpoint contoh: Ambil semua data karyawan dari tabel employees
app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM karyawan'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
    res.json(results);
  });
});

//Endpoint ambil data berdasarkan id
app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM karyawan WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result[0]);
    });
  });

//Endpoint menambah data karyawan
app.post('/api/employees', (req, res) => {
    const { nama, usia, alamat } = req.body;
    db.query('INSERT INTO karyawan (nama, usia, alamat) VALUES (?, ?, ?)', 
      [nama, usia, alamat], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Karyawan berhasil ditambahkan!', id: result.insertId });
    });
  });


//Endpoint untuk update data
app.put('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    const { nama, usia, alamat } = req.body;
    db.query('UPDATE karyawan SET nama = ?, usia = ?, alamat = ? WHERE id = ?', 
      [nama, usia, alamat, id], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Karyawan berhasil diperbarui!' });
    });
  });

//Enpoint untuk menghapus data
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM karyawan WHERE id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Karyawan berhasil dihapus!' });
    });
  }); 


// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
