
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const dataPath = path.join(__dirname, 'data/leaves.json');

// Sample users
const users = {
  emp: { password: '1234', role: 'employee' },
  manager: { password: 'admin', role: 'manager' }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    res.json({ role: users[username].role });
  } else {
    res.json({ role: null });
  }
});

app.post('/apply-leave', (req, res) => {
  const newLeave = { ...req.body, status: 'In Progress' };
  const leaves = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '[]');
  leaves.push(newLeave);
  fs.writeFileSync(dataPath, JSON.stringify(leaves, null, 2));
  res.json({ message: 'Leave submitted!' });
});

app.get('/leaves', (req, res) => {
  const leaves = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '[]');
  res.json(leaves);
});

app.put('/update-status/:id', (req, res) => {
  const leaves = JSON.parse(fs.readFileSync(dataPath, 'utf8') || '[]');
  leaves[req.params.id].status = req.body.status;
  fs.writeFileSync(dataPath, JSON.stringify(leaves, null, 2));
  res.json({ message: 'Status updated!' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
