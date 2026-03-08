const express = require('express');
const path = require('path');
const app = express();

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// pages à la racine : /realisations → /realisations.html
app.get('/:name', (req, res) => {
  const file = path.join(publicDir, req.params.name + '.html');
  res.sendFile(file, err => {
    if (err) res.sendFile(path.join(publicDir, '404.html'));
  });
});

// pages dans sous-dossiers : /projets/sirok → /projets/sirok.html
app.get('/:folder/:name', (req, res) => {
  const file = path.join(publicDir, req.params.folder, req.params.name + '.html');
  res.sendFile(file, err => {
    if (err) res.sendFile(path.join(publicDir, '404.html'));
  });
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));