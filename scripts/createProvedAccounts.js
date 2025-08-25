const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Connexion à MongoDB
mongoose.connect("mongodb+srv://stanislasmakengo1:CmO8NytrFHAsW4yI@cluster0.rl7g5.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const { IdentificationProved } = require('../models/identificationProved.model');

// Liste des comptes PROVED à créer
const provedAccounts = [
  {
    provinceAdministrative: 'Kinshasa-Lukunga',
    provinceEducationnelle: 'Kinshasa-Lukunga',
    chefLieuProved: 'Kinshasa',
    telephone: '+243814240024',
    emailProfessionnel: 'kinshasalukunga@edu-nc.cd',
    motDePasse: 'Kinshasalukunga@123',
    directeurProvincial: 'Directeur PROVED Kinshasa-Lukunga'
  },
  {
    provinceAdministrative: 'Sud-Ubangi1',
    provinceEducationnelle: 'Sud-Ubangi1',
    chefLieuProved: 'Gemena',
    telephone: '+243810787954',
    emailProfessionnel: 'sudubangi1@edu-nc.cd',
    motDePasse: 'Sudubangi1@123',
    directeurProvincial: 'Directeur PROVED Sud-Ubangi1'
  },
  {
    provinceAdministrative: 'Kwango2',
    provinceEducationnelle: 'Kwango2',
    chefLieuProved: 'Kenge',
    telephone: '+243818557636',
    emailProfessionnel: 'kwango2@edu-nc.cd',
    motDePasse: 'Kwango2@123',
    directeurProvincial: 'Directeur PROVED Kwango2'
  },
  {
    provinceAdministrative: 'Bas-Uele',
    provinceEducationnelle: 'Bas-Uele',
    chefLieuProved: 'Buta',
    telephone: '+243814268202',
    emailProfessionnel: 'basuele@edu-nc.cd',
    motDePasse: 'Basuele@123',
    directeurProvincial: 'Directeur PROVED Bas-Uele'
  },
  {
    provinceAdministrative: 'Mai-Ndombe2',
    provinceEducationnelle: 'Mai-Ndombe2',
    chefLieuProved: 'Inongo',
    telephone: '+243813514203',
    emailProfessionnel: 'maindombe2@edu-nc.cd',
    motDePasse: 'Maindombe2@123',
    directeurProvincial: 'Directeur PROVED Mai-Ndombe2'
  },
  {
    provinceAdministrative: 'Mongala2',
    provinceEducationnelle: 'Mongala2',
    chefLieuProved: 'Lisala',
    telephone: '+243827746329',
    emailProfessionnel: 'dipromongala2@gmail.com',
    motDePasse: 'Mongala2@123',
    directeurProvincial: 'Directeur PROVED Mongala2'
  },
  {
    provinceAdministrative: 'Nord-Ubangi1',
    provinceEducationnelle: 'Nord-Ubangi1',
    chefLieuProved: 'Gbadolite',
    telephone: '+243824187578',
    emailProfessionnel: 'dipeprovenordubangi1@gmail.com',
    motDePasse: 'Nordubangi1@123',
    directeurProvincial: 'Directeur PROVED Nord-Ubangi1'
  },
  {
    provinceAdministrative: 'KongoCentral1',
    provinceEducationnelle: 'KongoCentral1',
    chefLieuProved: 'Matadi',
    telephone: '+243857580584',
    emailProfessionnel: 'kongocentral1@edu-nc.cd',
    motDePasse: 'Kongocentral1@123',
    directeurProvincial: 'Directeur PROVED KongoCentral1'
  },
  {
    provinceAdministrative: 'Kinshasa-Tshangu',
    provinceEducationnelle: 'Kinshasa-Tshangu',
    chefLieuProved: 'Kinshasa',
    telephone: '+243899307046',
    emailProfessionnel: 'diprovedtshangu@gmail.com',
    motDePasse: 'Kinshasatshangu@123',
    directeurProvincial: 'Directeur PROVED Kinshasa-Tshangu'
  },
  {
    provinceAdministrative: 'Mai-Ndombe1',
    provinceEducationnelle: 'Mai-Ndombe1',
    chefLieuProved: 'Inongo',
    telephone: '+243824858549',
    emailProfessionnel: 'maindombe1@edu-nc.cd',
    motDePasse: 'Maindombe1@123',
    directeurProvincial: 'Directeur PROVED Mai-Ndombe1'
  },
  {
    provinceAdministrative: 'KasaiOriental1',
    provinceEducationnelle: 'KasaiOriental1',
    chefLieuProved: 'Mbuji-Mayi',
    telephone: '+243851347567',
    emailProfessionnel: 'kasaioriental1@edu-nc.cd',
    motDePasse: 'Kasaioriental1@123',
    directeurProvincial: 'Directeur PROVED KasaiOriental1'
  },
  {
    provinceAdministrative: 'Sud-Ubangi2',
    provinceEducationnelle: 'Sud-Ubangi2',
    chefLieuProved: 'Gemena',
    telephone: '+243826496747',
    emailProfessionnel: 'sudubangi2@edu-nc.cd',
    motDePasse: 'Sudubangi2@123',
    directeurProvincial: 'Directeur PROVED Sud-Ubangi2'
  },
  {
    provinceAdministrative: 'KasaiCentral2',
    provinceEducationnelle: 'KasaiCentral2',
    chefLieuProved: 'Kananga',
    telephone: '+243997138384',
    emailProfessionnel: 'epthujkasaicentral2@gmail.com',
    motDePasse: 'Kasaicentral2@123',
    directeurProvincial: 'Directeur PROVED KasaiCentral2'
  },
  {
    provinceAdministrative: 'Equateur2',
    provinceEducationnelle: 'Equateur2',
    chefLieuProved: 'Mbandaka',
    telephone: '+243824529605',
    emailProfessionnel: 'diproequateur2@gmail.com',
    motDePasse: 'Equateur2@123',
    directeurProvincial: 'Directeur PROVED Equateur2'
  },
  {
    provinceAdministrative: 'Equateur1',
    provinceEducationnelle: 'Equateur1',
    chefLieuProved: 'Mbandaka',
    telephone: '+243812054518',
    emailProfessionnel: 'provedquateur@gmail.com',
    motDePasse: 'Equateur1@123',
    directeurProvincial: 'Directeur PROVED Equateur1'
  },
  {
    provinceAdministrative: 'Kwilu1',
    provinceEducationnelle: 'Kwilu1',
    chefLieuProved: 'Bandundu',
    telephone: '+243812674818',
    emailProfessionnel: 'kwilu1@edu-nc.cd',
    motDePasse: 'Kwilu1@123',
    directeurProvincial: 'Directeur PROVED Kwilu1'
  },
  {
    provinceAdministrative: 'Nord-Kivu3',
    provinceEducationnelle: 'Nord-Kivu3',
    chefLieuProved: 'Goma',
    telephone: '+2439996657828',
    emailProfessionnel: 'epstnkv3@gmail.com',
    motDePasse: 'Nordkivu3@123',
    directeurProvincial: 'Directeur PROVED Nord-Kivu3'
  },
  {
    provinceAdministrative: 'Nord-Kivu2',
    provinceEducationnelle: 'Nord-Kivu2',
    chefLieuProved: 'Goma',
    telephone: '+243812209924',
    emailProfessionnel: 'nordkivu2@edu-nc.cd',
    motDePasse: 'Nordkivu2@123',
    directeurProvincial: 'Directeur PROVED Nord-Kivu2'
  },
  {
    provinceAdministrative: 'Haut-Uele1',
    provinceEducationnelle: 'Haut-Uele1',
    chefLieuProved: 'Isiro',
    telephone: '+243810917445',
    emailProfessionnel: 'hautuele1@gmail.com',
    motDePasse: 'Hautuele1@123',
    directeurProvincial: 'Directeur PROVED Haut-Uele1'
  },
  {
    provinceAdministrative: 'Haut-Uele2',
    provinceEducationnelle: 'Haut-Uele2',
    chefLieuProved: 'Isiro',
    telephone: '+243823239731',
    emailProfessionnel: 'hautuele2@edu-nc.cd',
    motDePasse: 'Hautuele2@123',
    directeurProvincial: 'Directeur PROVED Haut-Uele2'
  },
  {
    provinceAdministrative: 'Nord-Ubangi2',
    provinceEducationnelle: 'Nord-Ubangi2',
    chefLieuProved: 'Gbadolite',
    telephone: '+243812390957',
    emailProfessionnel: 'nordubangi2@edu-nc.cd',
    motDePasse: 'Nordubangi2@123',
    directeurProvincial: 'Directeur PROVED Nord-Ubangi2'
  },
  {
    provinceAdministrative: 'Haut-Katanga2',
    provinceEducationnelle: 'Haut-Katanga2',
    chefLieuProved: 'Lubumbashi',
    telephone: '+243896481329',
    emailProfessionnel: 'provedhautkatanga2@gmail.com',
    motDePasse: 'Hautkatanga2@123',
    directeurProvincial: 'Directeur PROVED Haut-Katanga2'
  },
  {
    provinceAdministrative: 'Kinshasa-Funa',
    provinceEducationnelle: 'Kinshasa-Funa',
    chefLieuProved: 'Kinshasa',
    telephone: '+243895763076',
    emailProfessionnel: 'diprofuna@gmail.com',
    motDePasse: 'Kinshasafuna@123',
    directeurProvincial: 'Directeur PROVED Kinshasa-Funa'
  },
  {
    provinceAdministrative: 'Haut-Lomami2',
    provinceEducationnelle: 'Haut-Lomami2',
    chefLieuProved: 'Kamina',
    telephone: '+243970200204',
    emailProfessionnel: 'diproevaphl2@gmail.com',
    motDePasse: 'Hautlomami2@123',
    directeurProvincial: 'Directeur PROVED Haut-Lomami2'
  },
  {
    provinceAdministrative: 'Mongala1',
    provinceEducationnelle: 'Mongala1',
    chefLieuProved: 'Lisala',
    telephone: '+243822121653',
    emailProfessionnel: 'proved.educncmongala1@gmail.com',
    motDePasse: 'Mongala1@123',
    directeurProvincial: 'Directeur PROVED Mongala1'
  },
  {
    provinceAdministrative: 'Ituri1',
    provinceEducationnelle: 'Ituri1',
    chefLieuProved: 'Bunia',
    telephone: '+243824250823',
    emailProfessionnel: 'ituri1@edu-nc.cd',
    motDePasse: 'Ituri1@123',
    directeurProvincial: 'Directeur PROVED Ituri1'
  },
  {
    provinceAdministrative: 'Kinshasa-Plateau',
    provinceEducationnelle: 'Kinshasa-Plateau',
    chefLieuProved: 'Kinshasa',
    telephone: '+243898461620',
    emailProfessionnel: 'provinceeducncmelleplateaux@gmail.com',
    motDePasse: 'Kinshasaplateau@123',
    directeurProvincial: 'Directeur PROVED Kinshasa-Plateau'
  },
  {
    provinceAdministrative: 'Mongala1-Bis',
    provinceEducationnelle: 'Mongala1-Bis',
    chefLieuProved: 'Lisala',
    telephone: '+243824649496',
    emailProfessionnel: 'mongala1bis@edu-nc.cd',
    motDePasse: 'Mongala1bis@123',
    directeurProvincial: 'Directeur PROVED Mongala1-Bis'
  },
  {
    provinceAdministrative: 'Kwilu2',
    provinceEducationnelle: 'Kwilu2',
    chefLieuProved: 'Bandundu',
    telephone: '+243820441249',
    emailProfessionnel: 'epspkwiludeux@gmail.com',
    motDePasse: 'Kwilu2@123',
    directeurProvincial: 'Directeur PROVED Kwilu2'
  },
  {
    provinceAdministrative: 'Kwilu3',
    provinceEducationnelle: 'Kwilu3',
    chefLieuProved: 'Bandundu',
    telephone: '+243810874969',
    emailProfessionnel: 'epspkwilutrois@gmail.com',
    motDePasse: 'Kwilu3@123',
    directeurProvincial: 'Directeur PROVED Kwilu3'
  },
  {
    provinceAdministrative: 'Tshopo1',
    provinceEducationnelle: 'Tshopo1',
    chefLieuProved: 'Kisangani',
    telephone: '+243829166417',
    emailProfessionnel: 'disprovepsptshopo@gmail.com',
    motDePasse: 'Tshopo1@123',
    directeurProvincial: 'Directeur PROVED Tshopo1'
  },
  {
    provinceAdministrative: 'Kinshasa-MontAmba',
    provinceEducationnelle: 'Kinshasa-MontAmba',
    chefLieuProved: 'Kinshasa',
    telephone: '+243899933783',
    emailProfessionnel: 'kinshasamontamba@edu-nc.cd',
    motDePasse: 'Kinshasamontamba@123',
    directeurProvincial: 'Directeur PROVED Kinshasa-MontAmba'
  },
  {
    provinceAdministrative: 'KasaiOriental2',
    provinceEducationnelle: 'KasaiOriental2',
    chefLieuProved: 'Mbuji-Mayi',
    telephone: '+243895161404',
    emailProfessionnel: 'diprovedkasaioriental2@yahoo.com',
    motDePasse: 'Kasaioriental2@123',
    directeurProvincial: 'Directeur PROVED KasaiOriental2'
  },
  {
    provinceAdministrative: 'Nord-Kivu1',
    provinceEducationnelle: 'Nord-Kivu1',
    chefLieuProved: 'Goma',
    telephone: '+243823303589',
    emailProfessionnel: 'provdednordkivu1@gmail.com',
    motDePasse: 'Nordkivu1@123',
    directeurProvincial: 'Directeur PROVED Nord-Kivu1'
  },
  {
    provinceAdministrative: 'Tanganyika2',
    provinceEducationnelle: 'Tanganyika2',
    chefLieuProved: 'Kalemie',
    telephone: '+243820201289',
    emailProfessionnel: 'epsttanganyika2@gmail.com',
    motDePasse: 'Tanganyika2@123',
    directeurProvincial: 'Directeur PROVED Tanganyika2'
  },
  {
    provinceAdministrative: 'Tanganyika1',
    provinceEducationnelle: 'Tanganyika1',
    chefLieuProved: 'Kalemie',
    telephone: '+243812549617',
    emailProfessionnel: 'divisionkatanga3@yahoo.fr',
    motDePasse: 'Tanganyika1@123',
    directeurProvincial: 'Directeur PROVED Tanganyika1'
  },
  {
    provinceAdministrative: 'KasaiCentral1',
    provinceEducationnelle: 'KasaiCentral1',
    chefLieuProved: 'Kananga',
    telephone: '+243972894927',
    emailProfessionnel: 'kasaicentral1@edu-nc.cd',
    motDePasse: 'Kasaicentral1@123',
    directeurProvincial: 'Directeur PROVED KasaiCentral1'
  },
  {
    provinceAdministrative: 'Sankuru1',
    provinceEducationnelle: 'Sankuru1',
    chefLieuProved: 'Lodja',
    telephone: '+243820319281',
    emailProfessionnel: 'sankuru1@edu-nc.cd',
    motDePasse: 'Sankuru1@123',
    directeurProvincial: 'Directeur PROVED Sankuru1'
  },
  {
    provinceAdministrative: 'Lualaba2',
    provinceEducationnelle: 'Lualaba2',
    chefLieuProved: 'Kolwezi',
    telephone: '+243825102231',
    emailProfessionnel: 'lualaba2@edu-nc.cd',
    motDePasse: 'Lualaba2@123',
    directeurProvincial: 'Directeur PROVED Lualaba2'
  },
  {
    provinceAdministrative: 'Lualaba1',
    provinceEducationnelle: 'Lualaba1',
    chefLieuProved: 'Kolwezi',
    telephone: '+243818349688',
    emailProfessionnel: 'lualaba1@edu-nc.cd',
    motDePasse: 'Lualaba1@123',
    directeurProvincial: 'Directeur PROVED Lualaba1'
  },
  {
    provinceAdministrative: 'Tshuapa2',
    provinceEducationnelle: 'Tshuapa2',
    chefLieuProved: 'Boende',
    telephone: '+243819931156',
    emailProfessionnel: 'tshuapa2@edu-nc.cd',
    motDePasse: 'Tshuapa2@123',
    directeurProvincial: 'Directeur PROVED Tshuapa2'
  },
  {
    provinceAdministrative: 'Tshuapa1',
    provinceEducationnelle: 'Tshuapa1',
    chefLieuProved: 'Boende',
    telephone: '+243820319281',
    emailProfessionnel: 'tshuapa1@edu-nc.cd',
    motDePasse: 'Tshuapa1@123',
    directeurProvincial: 'Directeur PROVED Tshuapa1'
  },
  {
    provinceAdministrative: 'Kasai1',
    provinceEducationnelle: 'Kasai1',
    chefLieuProved: 'Tshikapa',
    telephone: '+243990614440',
    emailProfessionnel: 'kasai1@edu-nc.cd',
    motDePasse: 'Kasai1@123',
    directeurProvincial: 'Directeur PROVED Kasai1'
  },
  {
    provinceAdministrative: 'Kwango1',
    provinceEducationnelle: 'Kwango1',
    chefLieuProved: 'Kenge',
    telephone: '+243976704892',
    emailProfessionnel: 'kwango1@edu-nc.cd',
    motDePasse: 'Kwango1@123',
    directeurProvincial: 'Directeur PROVED Kwango1'
  },
  {
    provinceAdministrative: 'Lomami2',
    provinceEducationnelle: 'Lomami2',
    chefLieuProved: 'Kabinda',
    telephone: '+243844960579',
    emailProfessionnel: 'lomami2@edu-nc.cd',
    motDePasse: 'Lomami2@123',
    directeurProvincial: 'Directeur PROVED Lomami2'
  },
  {
    provinceAdministrative: 'Lomami1',
    provinceEducationnelle: 'Lomami1',
    chefLieuProved: 'Kabinda',
    telephone: '+243813531324',
    emailProfessionnel: 'lomami1@edu-nc.cd',
    motDePasse: 'Lomami1@123',
    directeurProvincial: 'Directeur PROVED Lomami1'
  },
  {
    provinceAdministrative: 'Mai-Ndombe3',
    provinceEducationnelle: 'Mai-Ndombe3',
    chefLieuProved: 'Inongo',
    telephone: '+243816126951',
    emailProfessionnel: 'maindombe3@edu-nc.cd',
    motDePasse: 'Maindombe3@123',
    directeurProvincial: 'Directeur PROVED Mai-Ndombe3'
  },
  {
    provinceAdministrative: 'Haut-Katanga1',
    provinceEducationnelle: 'Haut-Katanga1',
    chefLieuProved: 'Lubumbashi',
    telephone: '+243991232458',
    emailProfessionnel: 'hautkatanga1@edu-nc.cd',
    motDePasse: 'Hautkatanga1@123',
    directeurProvincial: 'Directeur PROVED Haut-Katanga1'
  },
  {
    provinceAdministrative: 'Tshopo2',
    provinceEducationnelle: 'Tshopo2',
    chefLieuProved: 'Kisangani',
    telephone: '+243844658521',
    emailProfessionnel: 'tshopo2@edu-nc.cd',
    motDePasse: 'Tshopo2@123',
    directeurProvincial: 'Directeur PROVED Tshopo2'
  }
];

async function createProvedAccounts() {
  try {
    console.log('Début de la création des comptes PROVED...');
    
    let createdCount = 0;
    let skippedCount = 0;

    for (const account of provedAccounts) {
      try {
        // Vérifier si le compte existe déjà par le numéro de téléphone
        const existingAccount = await IdentificationProved.findOne({
          telephone: account.telephone
        });

        if (existingAccount) {
          console.log(`⚠️  Compte existant pour ${account.provinceAdministrative} (${account.telephone}) - Ignoré`);
          skippedCount++;
          continue;
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(account.motDePasse, 10);

        // Créer le compte PROVED
        const newProved = new IdentificationProved({
          provinceAdministrative: account.provinceAdministrative,
          provinceEducationnelle: account.provinceEducationnelle,
          chefLieuProved: account.chefLieuProved,
          emailProfessionnel: account.emailProfessionnel,
          telephone: account.telephone,
          statutOccupation: 'Propriétaire',
          nombreTerritoires: 0,
          nombreSousDivisions: 0,
          directeurProvincial: account.directeurProvincial,
          motDePasse: hashedPassword,
          role: 'user',
          isActive: true
        });

        await newProved.save();
        console.log(`✅ Compte créé: ${account.provinceAdministrative} (${account.telephone})`);
        createdCount++;

      } catch (error) {
        console.error(`❌ Erreur lors de la création du compte ${account.provinceAdministrative}:`, error.message);
      }
    }

    console.log('\n=== RÉSUMÉ ===');
    console.log(`Comptes créés: ${createdCount}`);
    console.log(`Comptes ignorés (déjà existants): ${skippedCount}`);
    console.log(`Total traité: ${provedAccounts.length}`);

    process.exit(0);
    
  } catch (error) {
    console.error('Erreur générale:', error);
    process.exit(1);
  }
}

// Exécuter le script
createProvedAccounts();
