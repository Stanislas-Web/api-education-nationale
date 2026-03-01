const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority')
.then(async () => {
  const { Province } = require('../models/province.model');
  const { Direction } = require('../models/direction.model');
  const { SousDirection } = require('../models/sousDirection.model');
  const { IdentificationProved } = require('../models/identificationProved.model');

  // 1. Voir toutes les provinces
  const provinces = await Province.find({});
  console.log('=== TOUTES LES PROVINCES ===');
  provinces.forEach(p => console.log(p._id.toString(), '-', p.nom));

  // 2. Voir le PROVED en question
  const proved = await IdentificationProved.findOne({ telephone: '+243899312592' });
  console.log('\n=== PROVED ===');
  console.log('provinceAdministrative:', proved.provinceAdministrative);
  console.log('provinceEducationnelle:', proved.provinceEducationnelle);
  console.log('nombreTerritoires (stocké):', proved.nombreTerritoires);
  console.log('nombreSousDivisions (stocké):', proved.nombreSousDivisions);

  // 3. Chercher la province correspondante
  const kwango = provinces.filter(p => 
    p.nom.toLowerCase().includes(proved.provinceAdministrative.toLowerCase()) ||
    proved.provinceAdministrative.toLowerCase().includes(p.nom.toLowerCase())
  );
  console.log('\n=== PROVINCES MATCHANT "' + proved.provinceAdministrative + '" ===');
  kwango.forEach(p => console.log(p._id.toString(), '-', p.nom));

  // 4. Pour chaque province match, compter les sous-directions
  for (const prov of kwango) {
    const dirs = await Direction.find({ idProvince: prov._id });
    console.log('\n=== DIRECTIONS pour', prov.nom, '(' + dirs.length + ' directions) ===');
    
    let totalSD = 0;
    for (const dir of dirs) {
      const sds = await SousDirection.find({ idDirection: dir._id });
      totalSD += sds.length;
      console.log('  Direction:', dir.nom, '=>', sds.length, 'sous-directions');
      sds.forEach(sd => console.log('    -', sd.nom));
    }
    console.log('\n>>> TOTAL REEL SOUS-DIRECTIONS pour', prov.nom, ':', totalSD);
    console.log('>>> STOCKE dans IdentificationProved:', proved.nombreSousDivisions);
    console.log('>>> DIFFERENCE:', totalSD - proved.nombreSousDivisions);
  }

  // 5. Voir aussi toutes les directions et sous-directions globalement
  const allDirs = await Direction.find({});
  const allSDs = await SousDirection.find({});
  console.log('\n=== STATS GLOBALES ===');
  console.log('Total provinces:', provinces.length);
  console.log('Total directions:', allDirs.length);
  console.log('Total sous-directions:', allSDs.length);

  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
