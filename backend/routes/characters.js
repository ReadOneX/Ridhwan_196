const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// Read All (Public)
router.get('/', (req, res) => {
  db.all('SELECT * FROM characters', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve characters' });
    res.json(rows);
  });
});

// Read One (Public)
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM characters WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve character' });
    if (!row) return res.status(404).json({ error: 'Character not found' });
    res.json(row);
  });
});

// Apply auth middleware
router.use(authenticateToken);

// Create (Protected)
router.post('/', upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  let imageUrl = req.body.imageUrl || ''; 

  if (req.file) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.get('host');
    imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  }

  if (!name) return res.status(400).json({ error: 'Name is required' });

  db.run('INSERT INTO characters (name, description, imageUrl) VALUES (?, ?, ?)', [name, description, imageUrl], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to create character' });
    res.status(201).json({ id: this.lastID, name, description, imageUrl });
  });
});

// Update (Protected)
router.put('/:id', upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.get('host');
    imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  }
  
  db.run(
    'UPDATE characters SET name = COALESCE(?, name), description = COALESCE(?, description), imageUrl = COALESCE(?, imageUrl) WHERE id = ?',
    [name, description, imageUrl, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to update character' });
      res.json({ message: 'Updated successfully' });
    }
  );
});

// Delete (Protected)
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM characters WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete' });
    res.json({ message: 'Deleted' });
  });
});

module.exports = router;