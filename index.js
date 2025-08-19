const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true,
    })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Express server démarré sur le port ' + port);
});
  