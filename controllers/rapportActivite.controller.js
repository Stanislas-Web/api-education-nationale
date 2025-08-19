const { RapportActivite } = require('../models/rapportActivite.model.js');
const puppeteer = require('puppeteer');
const htmlPdf = require('html-pdf-node');
const PDFDocument = require('pdfkit');

/**
 * @swagger
 * /rapport-activite:
 *   post:
 *     summary: Créer un nouveau rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RapportActivite'
 *     responses:
 *       201:
 *         description: Rapport créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const createRapportActivite = async (req, res) => {
  try {
    // Utiliser automatiquement la PROVED de l'utilisateur connecté
    const rapportData = {
      ...req.body,
      identificationProved: req.user._id // ID de la PROVED connectée
    };

    const rapport = new RapportActivite(rapportData);
    await rapport.save();

    // Populate l'identification de la PROVED
    await rapport.populate('identificationProved');

    res.status(201).json({
      success: true,
      message: 'Rapport d\'activités créé avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la création du rapport:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite:
 *   get:
 *     summary: Récupérer tous les rapports d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Filtrer par année
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filtrer par province
 *     responses:
 *       200:
 *         description: Liste des rapports récupérée avec succès
 *       401:
 *         description: Non autorisé
 */
const getAllRapportsActivite = async (req, res) => {
  try {
    const { page = 1, limit = 10, annee, statut, province } = req.query;
    const currentUser = req.user;
    
    console.log('🔍 Récupération des rapports pour l\'utilisateur:', currentUser._id);
    console.log('👤 Rôle de l\'utilisateur:', currentUser.role);
    console.log('👤 Type de l\'utilisateur:', currentUser.type);
    
    // Construire le filtre de base
    const filter = {};
    
    // Si l'utilisateur n'est pas admin, filtrer seulement ses rapports
    if (currentUser.role !== 'admin' && currentUser.type !== 'ADMIN') {
      console.log('🔒 Utilisateur non-admin, filtrage des rapports personnels');
      
      // Méthode 1: Chercher les rapports où identificationProved = userId (comme dans createRapportActivite)
      const rapportsDirects = await RapportActivite.find({ identificationProved: currentUser._id })
        .populate('identificationProved', 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
      
      console.log('📊 Rapports directs trouvés:', rapportsDirects.length);
      
      // Méthode 2: Chercher les identifications créées par l'utilisateur, puis les rapports associés
      const { IdentificationProved } = require('../models/identificationProved.model.js');
      const identifications = await IdentificationProved.find({ createdBy: currentUser._id }).select('_id provinceAdministrative createdBy');
      console.log('📋 Identifications créées par l\'utilisateur:', identifications.length);
      
      let rapportsViaIdentifications = [];
      if (identifications.length > 0) {
        const identificationIds = identifications.map(id => id._id);
        rapportsViaIdentifications = await RapportActivite.find({
          identificationProved: { $in: identificationIds }
        }).populate('identificationProved', 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt');
      }
      
      console.log('📊 Rapports via identifications trouvés:', rapportsViaIdentifications.length);
      
      // Combiner les deux méthodes et éliminer les doublons
      const tousLesRapports = [...rapportsDirects, ...rapportsViaIdentifications];
      const rapportsUniques = tousLesRapports.filter((rapport, index, self) => 
        index === self.findIndex(r => r._id.toString() === rapport._id.toString())
      );
      
      console.log('📊 Total des rapports uniques:', rapportsUniques.length);
      
      // Appliquer les filtres supplémentaires
      let rapportsFiltres = rapportsUniques;
      if (annee) {
        rapportsFiltres = rapportsFiltres.filter(rapport => rapport.annee === parseInt(annee));
      }
      if (statut) {
        rapportsFiltres = rapportsFiltres.filter(rapport => rapport.statut === statut);
      }
      if (province) {
        rapportsFiltres = rapportsFiltres.filter(rapport => 
          rapport.identificationProved && 
          rapport.identificationProved.provinceAdministrative && 
          rapport.identificationProved.provinceAdministrative.toLowerCase().includes(province.toLowerCase())
        );
      }
      
      console.log('📊 Rapports après filtres:', rapportsFiltres.length);
      
      // Pagination manuelle
      const totalDocs = rapportsFiltres.length;
      const totalPages = Math.ceil(totalDocs / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const docs = rapportsFiltres.slice(startIndex, endIndex);
      
      const result = {
        docs,
        totalDocs,
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
      
      res.status(200).json({
        success: true,
        message: 'Rapports d\'activités récupérés avec succès (utilisateur)',
        data: result,
        debug: {
          userId: currentUser._id,
          role: currentUser.role,
          type: currentUser.type,
          rapportsDirects: rapportsDirects.length,
          identificationsCount: identifications.length,
          rapportsViaIdentifications: rapportsViaIdentifications.length,
          totalRapports: tousLesRapports.length,
          rapportsUniques: rapportsUniques.length,
          rapportsFiltres: rapportsFiltres.length
        }
      });
      
    } else {
      console.log('👑 Utilisateur admin, récupération de tous les rapports');
      
      // Pour les admins, récupérer tous les rapports
      if (annee) filter.annee = parseInt(annee);
      if (statut) filter.statut = statut;
      if (province) {
        filter['identificationProved.provinceAdministrative'] = { $regex: province, $options: 'i' };
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },
        populate: [
          { 
            path: 'identificationProved',
            select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
          }
        ]
      };

      const result = await RapportActivite.paginate(filter, options);

      res.status(200).json({
        success: true,
        message: 'Rapports d\'activités récupérés avec succès (admin)',
        data: result,
        debug: {
          userId: currentUser._id,
          role: currentUser.role,
          type: currentUser.type,
          filter,
          totalRapports: result.totalDocs
        }
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des rapports',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}:
 *   get:
 *     summary: Récupérer un rapport d'activités par ID
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport récupéré avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
const getRapportActiviteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rapport = await RapportActivite.findById(id)
      .populate({
        path: 'identificationProved',
        select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
      });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rapport d\'activités récupéré avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}:
 *   put:
 *     summary: Mettre à jour un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RapportActivite'
 *     responses:
 *       200:
 *         description: Rapport mis à jour avec succès
 *       404:
 *         description: Rapport non trouvé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
const updateRapportActivite = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body
    };

    const rapport = await RapportActivite.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rapport d\'activités mis à jour avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rapport:', error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}:
 *   delete:
 *     summary: Supprimer un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport supprimé avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
const deleteRapportActivite = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rapport = await RapportActivite.findByIdAndDelete(id);

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rapport d\'activités supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du rapport:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du rapport',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}/statut:
 *   patch:
 *     summary: Changer le statut d'un rapport d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [brouillon, soumis, approuve, rejete]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       404:
 *         description: Rapport non trouvé
 *       400:
 *         description: Statut invalide
 *       401:
 *         description: Non autorisé
 */
const updateStatutRapport = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['brouillon', 'soumis', 'approuve', 'rejete'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const rapport = await RapportActivite.findByIdAndUpdate(
      id,
      { 
        statut
      },
      { new: true }
    ).populate({
      path: 'identificationProved',
      select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
    });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut du rapport mis à jour avec succès',
      data: rapport
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/statistiques:
 *   get:
 *     summary: Obtenir les statistiques des rapports d'activités
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: annee
 *         schema:
 *           type: integer
 *         description: Année pour les statistiques
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *       401:
 *         description: Non autorisé
 */
const getStatistiquesRapports = async (req, res) => {
  try {
    const { annee } = req.query;
    const filter = annee ? { annee: parseInt(annee) } : {};

    const [
      totalRapports,
      rapportsParStatut,
      rapportsParProvince,
      rapportsParAnnee
    ] = await Promise.all([
      RapportActivite.countDocuments(filter),
      RapportActivite.aggregate([
        { $match: filter },
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),
      RapportActivite.aggregate([
        { $match: filter },
        { $group: { _id: '$identification.provinceAdministrative', count: { $sum: 1 } } }
      ]),
      RapportActivite.aggregate([
        { $match: filter },
        { $group: { _id: '$annee', count: { $sum: 1 } } },
        { $sort: { _id: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistiques récupérées avec succès',
      data: {
        totalRapports,
        rapportsParStatut,
        rapportsParProvince,
        rapportsParAnnee
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

/**
 * @swagger
 * /rapport-activite/{id}/export:
 *   get:
 *     summary: Exporter un rapport d'activités en PDF
 *     tags: [RapportActivite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du rapport
 *     responses:
 *       200:
 *         description: Rapport exporté avec succès
 *       404:
 *         description: Rapport non trouvé
 *       401:
 *         description: Non autorisé
 */
const exportRapportPDF = async (req, res) => {
  let browser = null;
  try {
    const { id } = req.params;
    
    const rapport = await RapportActivite.findById(id)
      .populate({
        path: 'identificationProved',
        select: 'provinceAdministrative provinceEducationnelle chefLieuProved emailProfessionnel telephone statutOccupation nombreTerritoires nombreSousDivisions directeurProvincial isActive role createdAt updatedAt'
      });

    if (!rapport) {
      return res.status(404).json({
        success: false,
        message: 'Rapport d\'activités non trouvé'
      });
    }

    // Générer le HTML pour le PDF
    const htmlContent = generateRapportHTML(rapport);

    let pdfBuffer;

    // Essayer d'abord avec Puppeteer
    try {
      console.log('🔄 Tentative d\'export avec Puppeteer...');
      
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
      });

      const page = await browser.newPage();
      
      // Définir la taille de la page
      await page.setViewport({ width: 1200, height: 800 });
      
      // Définir le contenu HTML
      await page.setContent(htmlContent, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      // Attendre que le contenu soit chargé
      await page.waitForTimeout(2000);

      // Générer le PDF
      pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        },
        printBackground: true,
        preferCSSPageSize: true
      });

      console.log('✅ Export réussi avec Puppeteer');
      
    } catch (puppeteerError) {
      console.log('⚠️ Échec avec Puppeteer, tentative avec html-pdf-node...');
      console.error('Erreur Puppeteer:', puppeteerError.message);
      
      // Fermer le navigateur Puppeteer s'il existe
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Erreur lors de la fermeture du navigateur:', closeError);
        }
        browser = null;
      }

      // Essayer avec html-pdf-node comme fallback
      try {
        const options = {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          printBackground: true
        };

        const file = { content: htmlContent };
        pdfBuffer = await htmlPdf.generatePdf(file, options);
        
        console.log('✅ Export réussi avec html-pdf-node');
        
             } catch (htmlPdfError) {
         console.error('Erreur html-pdf-node:', htmlPdfError.message);
         
         // Essayer avec PDFKit comme troisième option
         try {
           console.log('⚠️ Échec avec html-pdf-node, tentative avec PDFKit...');
           pdfBuffer = await generatePDFKitPDF(rapport);
           console.log('✅ Export réussi avec PDFKit');
         } catch (pdfKitError) {
           console.error('Erreur PDFKit:', pdfKitError.message);
           throw new Error(`Échec des trois méthodes d'export: Puppeteer (${puppeteerError.message}), html-pdf-node (${htmlPdfError.message}), et PDFKit (${pdfKitError.message})`);
         }
       }
    } finally {
      // Fermer le navigateur Puppeteer s'il existe
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Erreur lors de la fermeture du navigateur:', closeError);
        }
      }
    }

    // Définir les headers pour le téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="rapport-activite-${rapport.annee}-${rapport.identificationProved?.provinceAdministrative || 'province'}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Envoyer le PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Erreur lors de l\'export du rapport:', error);
    
    // Fermer le navigateur en cas d'erreur
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Erreur lors de la fermeture du navigateur:', closeError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export du rapport',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Fonction pour générer un PDF avec PDFKit
const generatePDFKitPDF = (rapport) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // En-tête
      doc.fontSize(18).font('Helvetica-Bold').text('RÉPUBLIQUE DÉMOCRATIQUE DU CONGO', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).text('MINISTÈRE DE L\'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).text(`PROVINCE ÉDUCATIONNELLE ${rapport.identificationProved?.provinceEducationnelle || 'N/A'}`, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(16).text(`RAPPORT D'ACTIVITÉS ${rapport.annee}`, { align: 'center' });
      doc.moveDown(2);

      // Section 1: Identification de la PROVED
      doc.fontSize(12).font('Helvetica-Bold').text('1. IDENTIFICATION DE LA PROVED');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      
      const provedInfo = [
        `Province Administrative: ${rapport.identificationProved?.provinceAdministrative || 'N/A'}`,
        `Province Éducationnelle: ${rapport.identificationProved?.provinceEducationnelle || 'N/A'}`,
        `Chef-lieu PROVED: ${rapport.identificationProved?.chefLieuProved || 'N/A'}`,
        `Email Professionnel: ${rapport.identificationProved?.emailProfessionnel || 'N/A'}`,
        `Téléphone: ${rapport.identificationProved?.telephone || 'N/A'}`,
        `Statut d'Occupation: ${rapport.identificationProved?.statutOccupation || 'N/A'}`,
        `Nombre de Territoires: ${rapport.identificationProved?.nombreTerritoires || 0}`,
        `Nombre de Sous-divisions: ${rapport.identificationProved?.nombreSousDivisions || 0}`,
        `Directeur Provincial: ${rapport.identificationProved?.directeurProvincial || 'N/A'}`
      ];

      provedInfo.forEach(info => {
        doc.text(info);
        doc.moveDown(0.3);
      });

      doc.moveDown(1);

      // Section 2: Introduction
      if (rapport.introduction) {
        doc.fontSize(12).font('Helvetica-Bold').text('2. INTRODUCTION');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(rapport.introduction);
        doc.moveDown(1);
      }

      // Section 3: Paramètres Clés
      doc.fontSize(12).font('Helvetica-Bold').text('3. PARAMÈTRES CLÉS');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      // Niveau Préscolaire
      doc.fontSize(11).font('Helvetica-Bold').text('3.1 Niveau Préscolaire');
      doc.moveDown(0.3);
      
      const prescolaire = rapport.parametresCles?.niveauPrescolaire;
      if (prescolaire) {
        Object.entries(prescolaire).forEach(([type, data]) => {
          doc.text(`${type}:`);
          doc.text(`  - Écoles: ${data.nombreEcoles || 0}`);
          doc.text(`  - Classes: ${data.nombreClasses || 0}`);
          doc.text(`  - Garçons: ${data.effectifGarcons || 0}`);
          doc.text(`  - Filles: ${data.effectifFilles || 0}`);
          doc.text(`  - Taux Accroissement: ${data.tauxAccroissement || 0}%`);
          doc.moveDown(0.3);
        });
      }

      // Niveau Primaire
      doc.fontSize(11).font('Helvetica-Bold').text('3.2 Niveau Primaire');
      doc.moveDown(0.3);
      
      const primaire = rapport.parametresCles?.niveauPrimaire;
      if (primaire) {
        if (primaire.enseignementSpecial) {
          doc.text('Enseignement Spécial:');
          doc.text(`  - Classes: ${primaire.enseignementSpecial.nombreClasses || 0}`);
          doc.text(`  - Garçons: ${primaire.enseignementSpecial.effectifGarcons || 0}`);
          doc.text(`  - Filles: ${primaire.enseignementSpecial.effectifFilles || 0}`);
          doc.text(`  - Taux Accroissement: ${primaire.enseignementSpecial.tauxAccroissement || 0}%`);
          doc.moveDown(0.3);
        }
        
        if (primaire.enseignementPrimaire) {
          doc.text('Enseignement Primaire:');
          doc.text(`  - Écoles: ${primaire.enseignementPrimaire.nombreEcoles || 0}`);
          doc.text(`  - Classes: ${primaire.enseignementPrimaire.nombreClasses || 0}`);
          doc.text(`  - Classes Pléthoriques: ${primaire.enseignementPrimaire.classesPlethoriques || 0}`);
          doc.text(`  - Garçons: ${primaire.enseignementPrimaire.effectifGarcons || 0}`);
          doc.text(`  - Filles: ${primaire.enseignementPrimaire.effectifFilles || 0}`);
          doc.text(`  - Taux Accroissement: ${primaire.enseignementPrimaire.tauxAccroissement || 0}%`);
          doc.moveDown(0.3);
        }
      }

      // Niveau Secondaire
      doc.fontSize(11).font('Helvetica-Bold').text('3.3 Niveau Secondaire');
      doc.moveDown(0.3);
      
      const secondaire = rapport.parametresCles?.niveauSecondaire;
      if (secondaire) {
        if (secondaire.enseignementSpecial) {
          doc.text('Enseignement Spécial:');
          doc.text(`  - Classes: ${secondaire.enseignementSpecial.nombreClasses || 0}`);
          doc.text(`  - Garçons: ${secondaire.enseignementSpecial.effectifGarcons || 0}`);
          doc.text(`  - Filles: ${secondaire.enseignementSpecial.effectifFilles || 0}`);
          doc.text(`  - Taux Accroissement: ${secondaire.enseignementSpecial.tauxAccroissement || 0}%`);
          doc.moveDown(0.3);
        }
        
        if (secondaire.enseignementSecondaire) {
          doc.text('Enseignement Secondaire:');
          
          if (secondaire.enseignementSecondaire.premierCycle) {
            doc.text('  Premier Cycle:');
            doc.text(`    - Classes 7ème CTEB: ${secondaire.enseignementSecondaire.premierCycle.classes7emeCTEB || 0}`);
            doc.text(`    - Classes 8ème CTEB: ${secondaire.enseignementSecondaire.premierCycle.classes8emeCTEB || 0}`);
            doc.text(`    - Garçons: ${secondaire.enseignementSecondaire.premierCycle.effectifGarcons || 0}`);
            doc.text(`    - Filles: ${secondaire.enseignementSecondaire.premierCycle.effectifFilles || 0}`);
            doc.text(`    - Taux Accroissement: ${secondaire.enseignementSecondaire.premierCycle.tauxAccroissement || 0}%`);
            doc.moveDown(0.3);
          }
          
          if (secondaire.enseignementSecondaire.deuxiemeCycle) {
            doc.text('  Deuxième Cycle:');
            doc.text(`    - Classes Humanités: ${secondaire.enseignementSecondaire.deuxiemeCycle.classesHumanites || 0}`);
            doc.text(`    - Garçons: ${secondaire.enseignementSecondaire.deuxiemeCycle.effectifGarcons || 0}`);
            doc.text(`    - Filles: ${secondaire.enseignementSecondaire.deuxiemeCycle.effectifFilles || 0}`);
            doc.text(`    - Taux Accroissement: ${secondaire.enseignementSecondaire.deuxiemeCycle.tauxAccroissement || 0}%`);
            doc.moveDown(0.3);
          }
        }
      }

      // Section 4: Personnel
      doc.fontSize(12).font('Helvetica-Bold').text('4. PERSONNEL');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      const personnel = rapport.personnel;
      if (personnel) {
        if (personnel.personnelEnseignant) {
          doc.fontSize(11).font('Helvetica-Bold').text('4.1 Personnel Enseignant');
          doc.moveDown(0.3);
          
          Object.entries(personnel.personnelEnseignant).forEach(([niveau, data]) => {
            doc.text(`${niveau}:`);
            doc.text(`  - Hommes: ${data.hommes || 0}`);
            doc.text(`  - Femmes: ${data.femmes || 0}`);
            doc.text(`  - Total: ${(data.hommes || 0) + (data.femmes || 0)}`);
            doc.moveDown(0.3);
          });
        }

        if (personnel.personnelAdministratif) {
          doc.fontSize(11).font('Helvetica-Bold').text('4.2 Personnel Administratif');
          doc.moveDown(0.3);
          
          const admin = personnel.personnelAdministratif;
          const adminServices = [
            { name: 'Direction Provinciale', value: admin.directionProvinciale },
            { name: 'Inspection Principale', value: admin.inspectionPrincipale },
            { name: 'DINACOPE', value: admin.dinacope },
            { name: 'SERNIE', value: admin.sernie },
            { name: 'Coordination Provinciale', value: admin.coordinationProvinciale },
            { name: 'Sous-division', value: admin.sousDivision },
            { name: 'Pools Inspection Primaire', value: admin.poolsInspectionPrimaire },
            { name: 'Pools Inspection Secondaire', value: admin.poolsInspectionSecondaire },
            { name: 'Antenne DINACOPE', value: admin.antenneDinacope },
            { name: 'Antenne SERNIE', value: admin.antenneSernie },
            { name: 'Coordination Diocésaine', value: admin.coordinationDiocesaine },
            { name: 'Sous-coordination Conventionnées', value: admin.sousCoordinationConventionnees },
            { name: 'Conseillerie Résidente', value: admin.conseillerieResidente }
          ];

          adminServices.forEach(service => {
            doc.text(`  - ${service.name}: ${service.value || 0}`);
          });
          doc.moveDown(0.3);
        }
      }

      // Section 5: Réalisations
      doc.fontSize(12).font('Helvetica-Bold').text('5. RÉALISATIONS');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');

      const realisations = rapport.realisations;
      if (realisations?.accesAccessibiliteEquite) {
        const acces = realisations.accesAccessibiliteEquite;
        
        doc.fontSize(11).font('Helvetica-Bold').text('5.1 Accès, Accessibilité et Équité');
        doc.moveDown(0.3);
        
        // Nouvelles Salles de Classes
        if (acces.nouvellesSallesClasses) {
          doc.fontSize(10).font('Helvetica-Bold').text('Nouvelles Salles de Classes:');
          doc.text(`  - Préscolaire: ${acces.nouvellesSallesClasses.prescolaire || 0}`);
          doc.text(`  - Primaire: ${acces.nouvellesSallesClasses.primaire || 0}`);
          doc.text(`  - Secondaire: ${acces.nouvellesSallesClasses.secondaire || 0}`);
          doc.text(`  - Source de Financement: ${acces.nouvellesSallesClasses.sourceFinancement || 'N/A'}`);
          doc.moveDown(0.3);
        }

        // Nouveaux Bancs et Tables
        if (acces.nouveauxBancsTables) {
          doc.fontSize(10).font('Helvetica-Bold').text('Nouveaux Bancs et Tables:');
          doc.text(`  - Préscolaire: ${acces.nouveauxBancsTables.prescolaire || 0}`);
          doc.text(`  - Primaire: ${acces.nouveauxBancsTables.primaire || 0}`);
          doc.text(`  - Secondaire: ${acces.nouveauxBancsTables.secondaire || 0}`);
          doc.text(`  - Source de Financement: ${acces.nouveauxBancsTables.sourceFinancement || 'N/A'}`);
          doc.moveDown(0.3);
        }

        // Nouvelles Latrines
        if (acces.nouvellesLatrines) {
          doc.fontSize(10).font('Helvetica-Bold').text('Nouvelles Latrines:');
          doc.text(`  - Préscolaire: ${acces.nouvellesLatrines.prescolaire || 0}`);
          doc.text(`  - Primaire: ${acces.nouvellesLatrines.primaire || 0}`);
          doc.text(`  - Secondaire: ${acces.nouvellesLatrines.secondaire || 0}`);
          doc.text(`  - Source de Financement: ${acces.nouvellesLatrines.sourceFinancement || 'N/A'}`);
          doc.moveDown(0.3);
        }

        // Gratuité Enseignement Primaire
        if (acces.gratuitéEnseignementPrimaire) {
          doc.fontSize(10).font('Helvetica-Bold').text('Gratuité Enseignement Primaire:');
          doc.text(`  ${acces.gratuitéEnseignementPrimaire}`);
          doc.moveDown(0.3);
        }

        // Sensibilisation
        if (acces.sensibilisation) {
          doc.fontSize(10).font('Helvetica-Bold').text('Sensibilisation:');
          doc.text(`  - Filles: ${acces.sensibilisation.filles ? 'Oui' : 'Non'}`);
          doc.text(`  - Enfants Hors École: ${acces.sensibilisation.enfantsHorsEcole ? 'Oui' : 'Non'}`);
          doc.text(`  - Peuples Autochtones: ${acces.sensibilisation.peuplesAutochtones ? 'Oui' : 'Non'}`);
          doc.moveDown(0.3);
        }

        // Cantines Scolaires
        if (acces.cantinesScolaires) {
          doc.fontSize(10).font('Helvetica-Bold').text('Cantines Scolaires:');
          doc.text(`  - Préscolaire: ${acces.cantinesScolaires.prescolaire || 0}`);
          doc.text(`  - Primaire: ${acces.cantinesScolaires.primaire || 0}`);
          doc.text(`  - Secondaire: ${acces.cantinesScolaires.secondaire || 0}`);
          if (acces.cantinesScolaires.commentaire) {
            doc.text(`  - Commentaire: ${acces.cantinesScolaires.commentaire}`);
          }
          doc.moveDown(0.3);
        }

        // Indicateurs d'Accès
        if (acces.indicateursAcces) {
          doc.fontSize(10).font('Helvetica-Bold').text('Indicateurs d\'Accès:');
          doc.text(`  - Proportion Nouveaux Inscrits: ${acces.indicateursAcces.proportionNouveauxInscrits || 0}%`);
          doc.text(`  - Taux Transition Primaire-CTEB: ${acces.indicateursAcces.tauxTransitionPrimaireCTEB || 0}%`);
          doc.text(`  - Taux Transition CTEB-Humanités: ${acces.indicateursAcces.tauxTransitionCTEBHumanites || 0}%`);
          doc.moveDown(0.3);
        }
      }

      // Section 6: Conclusion
      if (rapport.conclusion) {
        doc.fontSize(12).font('Helvetica-Bold').text('6. CONCLUSION');
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').text(rapport.conclusion);
        doc.moveDown(1);
      }

      // Section 7: Informations Générales
      doc.fontSize(12).font('Helvetica-Bold').text('7. INFORMATIONS GÉNÉRALES');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Année: ${rapport.annee}`);
      doc.text(`Statut: ${rapport.statut || 'N/A'}`);
      doc.text(`Date de création: ${new Date(rapport.createdAt).toLocaleDateString('fr-FR')}`);
      doc.text(`Dernière modification: ${new Date(rapport.updatedAt).toLocaleDateString('fr-FR')}`);
      
      if (rapport.fichierJoint) {
        doc.text(`Fichier joint: ${rapport.fichierJoint}`);
      }

      // Signature
      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica-Bold').text('Signature du Directeur Provincial:', { align: 'left' });
      doc.moveDown(1);
      doc.text('_____________________________', { align: 'left' });
      doc.text(rapport.identificationProved?.directeurProvincial || 'N/A', { align: 'left' });

      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica-Bold').text('Cachet et Signature:', { align: 'right' });
      doc.moveDown(1);
      doc.text('_____________________________', { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });

      // Pied de page
      doc.moveDown(2);
      doc.fontSize(8).font('Helvetica').text('Document généré automatiquement le ' + new Date().toLocaleDateString('fr-FR'), { align: 'center' });
      doc.text('API Education Nationale - RDC', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Fonction pour générer le HTML du rapport
const generateRapportHTML = (rapport) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toString();
  };

  const formatBoolean = (bool) => {
    return bool ? 'Oui' : 'Non';
  };

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport d'Activités ${rapport.annee}</title>
        <style>
            body {
                font-family: 'Times New Roman', serif;
                font-size: 11px;
                line-height: 1.3;
                margin: 0;
                padding: 15px;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 25px;
                border-bottom: 2px solid #000;
                padding-bottom: 15px;
            }
            .header h1 {
                font-size: 16px;
                font-weight: bold;
                margin: 0;
                text-transform: uppercase;
            }
            .header h2 {
                font-size: 14px;
                font-weight: bold;
                margin: 8px 0;
            }
            .section {
                margin-bottom: 15px;
            }
            .section-title {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 8px;
                text-decoration: underline;
                background-color: #f0f0f0;
                padding: 3px;
            }
            .subsection-title {
                font-size: 11px;
                font-weight: bold;
                margin: 8px 0 5px 0;
                color: #444;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 12px;
            }
            .info-item {
                display: flex;
                margin-bottom: 3px;
            }
            .info-label {
                font-weight: bold;
                min-width: 120px;
                font-size: 10px;
            }
            .info-value {
                flex: 1;
                font-size: 10px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 9px;
            }
            .table th, .table td {
                border: 1px solid #000;
                padding: 3px;
                text-align: left;
            }
            .table th {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 9px;
            }
            .signature-section {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
            }
            .signature-box {
                text-align: center;
                width: 150px;
            }
            .signature-line {
                border-top: 1px solid #000;
                margin-top: 25px;
                padding-top: 3px;
            }
            .page-break {
                page-break-before: always;
            }
            .text-content {
                text-align: justify;
                margin: 5px 0;
                font-size: 10px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
            <h2>MINISTÈRE DE L'ÉDUCATION NATIONALE ET NOUVELLE CITOYENNETÉ</h2>
            <h2>PROVINCE ÉDUCATIONNELLE ${rapport.identificationProved?.provinceEducationnelle || 'N/A'}</h2>
            <h2>RAPPORT D'ACTIVITÉS ${rapport.annee}</h2>
        </div>

        <div class="section">
            <div class="section-title">1. IDENTIFICATION DE LA PROVED</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Province Administrative:</span>
                    <span class="info-value">${rapport.identificationProved?.provinceAdministrative || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Province Éducationnelle:</span>
                    <span class="info-value">${rapport.identificationProved?.provinceEducationnelle || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Chef-lieu PROVED:</span>
                    <span class="info-value">${rapport.identificationProved?.chefLieuProved || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email Professionnel:</span>
                    <span class="info-value">${rapport.identificationProved?.emailProfessionnel || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Téléphone:</span>
                    <span class="info-value">${rapport.identificationProved?.telephone || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Statut d'Occupation:</span>
                    <span class="info-value">${rapport.identificationProved?.statutOccupation || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Nombre de Territoires:</span>
                    <span class="info-value">${formatNumber(rapport.identificationProved?.nombreTerritoires)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Nombre de Sous-divisions:</span>
                    <span class="info-value">${formatNumber(rapport.identificationProved?.nombreSousDivisions)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Directeur Provincial:</span>
                    <span class="info-value">${rapport.identificationProved?.directeurProvincial || 'N/A'}</span>
                </div>
            </div>
        </div>

        ${rapport.introduction ? `
        <div class="section">
            <div class="section-title">2. INTRODUCTION</div>
            <div class="text-content">${rapport.introduction}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">3. PARAMÈTRES CLÉS</div>
            
            <div class="subsection-title">3.1 Niveau Préscolaire</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Écoles</th>
                        <th>Classes</th>
                        <th>Garçons</th>
                        <th>Filles</th>
                        <th>Taux Accroissement (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Espace Communautaire Éveil</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreClasses)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.tauxAccroissement)}</td>
                    </tr>
                    <tr>
                        <td>Maternel</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.tauxAccroissement)}</td>
                    </tr>
                    <tr>
                        <td>Pré-primaire</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreEcoles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.tauxAccroissement)}</td>
                    </tr>
                    <tr>
                        <td>Spécial</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.special?.nombreEcoles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.special?.nombreClasses)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.special?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.special?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.special?.tauxAccroissement)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="subsection-title">3.2 Niveau Primaire</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Écoles</th>
                        <th>Classes</th>
                        <th>Classes Pléthoriques</th>
                        <th>Garçons</th>
                        <th>Filles</th>
                        <th>Taux Accroissement (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Enseignement Spécial</td>
                        <td>-</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.nombreClasses)}</td>
                        <td>-</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementSpecial?.tauxAccroissement)}</td>
                    </tr>
                    <tr>
                        <td>Enseignement Primaire</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.classesPlethoriques)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.tauxAccroissement)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="subsection-title">3.3 Niveau Secondaire</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Classes 7ème CTEB</th>
                        <th>Classes 8ème CTEB</th>
                        <th>Classes Humanités</th>
                        <th>Garçons</th>
                        <th>Filles</th>
                        <th>Taux Accroissement (%)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Enseignement Spécial</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSpecial?.tauxAccroissement)}</td>
                    </tr>
                    <tr>
                        <td>Premier Cycle</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes8emeCTEB)}</td>
                        <td>-</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.tauxAccroissement)}</td>
                    </tr>
                    <tr>
                        <td>Deuxième Cycle</td>
                        <td>-</td>
                        <td>-</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.tauxAccroissement)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">4. PERSONNEL</div>
            
            <div class="subsection-title">4.1 Personnel Enseignant</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Hommes</th>
                        <th>Femmes</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.prescolaire?.hommes)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.prescolaire?.femmes)}</td>
                        <td>${formatNumber((rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0))}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.primaire?.hommes)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.primaire?.femmes)}</td>
                        <td>${formatNumber((rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0))}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.secondaire?.hommes)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.secondaire?.femmes)}</td>
                        <td>${formatNumber((rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0))}</td>
                    </tr>
                </tbody>
            </table>

            <div class="subsection-title">4.2 Personnel Administratif</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Effectif</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Direction Provinciale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.directionProvinciale)}</td></tr>
                    <tr><td>Inspection Principale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.inspectionPrincipale)}</td></tr>
                    <tr><td>DINACOPE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.dinacope)}</td></tr>
                    <tr><td>SERNIE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sernie)}</td></tr>
                    <tr><td>Coordination Provinciale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.coordinationProvinciale)}</td></tr>
                    <tr><td>Sous-division</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sousDivision)}</td></tr>
                    <tr><td>Pools Inspection Primaire</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire)}</td></tr>
                    <tr><td>Pools Inspection Secondaire</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire)}</td></tr>
                    <tr><td>Antenne DINACOPE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.antenneDinacope)}</td></tr>
                    <tr><td>Antenne SERNIE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.antenneSernie)}</td></tr>
                    <tr><td>Coordination Diocésaine</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.coordinationDiocesaine)}</td></tr>
                    <tr><td>Sous-coordination Conventionnées</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sousCoordinationConventionnees)}</td></tr>
                    <tr><td>Conseillerie Résidente</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.conseillerieResidente)}</td></tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">5. RÉALISATIONS</div>
            
            <div class="subsection-title">5.1 Accès, Accessibilité et Équité</div>
            
            <div class="subsection-title">Nouvelles Salles de Classes</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Nombre</th>
                        <th>Source de Financement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.prescolaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.primaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.secondaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouvellesSallesClasses?.sourceFinancement || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            <div class="subsection-title">Nouveaux Bancs et Tables</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Nombre</th>
                        <th>Source de Financement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.prescolaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.primaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.secondaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouveauxBancsTables?.sourceFinancement || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            <div class="subsection-title">Nouvelles Latrines</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Nombre</th>
                        <th>Source de Financement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.prescolaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.primaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancement || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.secondaire)}</td>
                        <td>${rapport.realisations?.accesAccessibiliteEquite?.nouvellesLatrines?.sourceFinancement || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Gratuité Enseignement Primaire:</span>
                    <span class="info-value">${rapport.realisations?.accesAccessibiliteEquite?.gratuitéEnseignementPrimaire || 'N/A'}</span>
                </div>
            </div>

            <div class="subsection-title">Sensibilisation</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Filles:</span>
                    <span class="info-value">${formatBoolean(rapport.realisations?.accesAccessibiliteEquite?.sensibilisation?.filles)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Enfants Hors École:</span>
                    <span class="info-value">${formatBoolean(rapport.realisations?.accesAccessibiliteEquite?.sensibilisation?.enfantsHorsEcole)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Peuples Autochtones:</span>
                    <span class="info-value">${formatBoolean(rapport.realisations?.accesAccessibiliteEquite?.sensibilisation?.peuplesAutochtones)}</span>
                </div>
            </div>

            <div class="subsection-title">Cantines Scolaires</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Niveau</th>
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Préscolaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.prescolaire)}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.primaire)}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.secondaire)}</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Commentaire:</strong> ${rapport.realisations?.accesAccessibiliteEquite?.cantinesScolaires?.commentaire || 'Aucun commentaire'}</p>

            <div class="subsection-title">Indicateurs d'Accès</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Proportion Nouveaux Inscrits (%):</span>
                    <span class="info-value">${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.indicateursAcces?.proportionNouveauxInscrits)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taux Transition Primaire-CTEB (%):</span>
                    <span class="info-value">${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.indicateursAcces?.tauxTransitionPrimaireCTEB)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taux Transition CTEB-Humanités (%):</span>
                    <span class="info-value">${formatNumber(rapport.realisations?.accesAccessibiliteEquite?.indicateursAcces?.tauxTransitionCTEBHumanites)}</span>
                </div>
            </div>
        </div>

        ${rapport.conclusion ? `
        <div class="section">
            <div class="section-title">6. CONCLUSION</div>
            <div class="text-content">${rapport.conclusion}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">7. INFORMATIONS GÉNÉRALES</div>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Année:</span>
                    <span class="info-value">${rapport.annee}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Statut:</span>
                    <span class="info-value">${rapport.statut || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Date de création:</span>
                    <span class="info-value">${formatDate(rapport.createdAt)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Dernière modification:</span>
                    <span class="info-value">${formatDate(rapport.updatedAt)}</span>
                </div>
            </div>
        </div>

        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-line"></div>
                <p><strong>Signature du Directeur Provincial</strong></p>
                <p>${rapport.identificationProved?.directeurProvincial || 'N/A'}</p>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <p><strong>Cachet et Signature</strong></p>
                <p>Date: ${formatDate(new Date())}</p>
            </div>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 9px; color: #666;">
            <p>Document généré automatiquement le ${formatDate(new Date())}</p>
            <p>API Education Nationale - RDC</p>
        </div>
    </body>
    </html>
  `;
};

module.exports = {
  createRapportActivite,
  getAllRapportsActivite,
  getRapportActiviteById,
  updateRapportActivite,
  deleteRapportActivite,
  updateStatutRapport,
  getStatistiquesRapports,
  exportRapportPDF,
  generatePDFKitPDF
}; 