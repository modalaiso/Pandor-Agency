const express = require('express');
const path = require('path');
const app = express();

// dossier contenant tes fichiers HTML
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// réécriture pour les fichiers .html
app.get('/:name', (req, res) => {
  const file = path.join(publicDir, req.params.name + '.html');
  res.sendFile(file, err => {
    if (err) res.sendFile(path.join(publicDir, '404.html'));
  });
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));