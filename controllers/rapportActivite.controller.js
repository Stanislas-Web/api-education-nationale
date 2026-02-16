const { RapportActivite } = require('../models/rapportActivite.model.js');
const { validateIndicateursRendement } = require('../validators/indicateursRendement.validator');
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
    // Validation des nouveaux indicateurs de rendement si présents
    const indicateurs = req.body.ameliorationQualite?.indicateursRendement;
    if (indicateurs) {
      const validation = validateIndicateursRendement(indicateurs);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Données des indicateurs de rendement invalides',
          errors: validation.errors
        });
      }
    }

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
    // Validation des nouveaux indicateurs de rendement si présents
    const indicateurs = req.body.ameliorationQualite?.indicateursRendement;
    if (indicateurs) {
      const validation = validateIndicateursRendement(indicateurs);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: 'Données des indicateurs de rendement invalides',
          errors: validation.errors
        });
      }
    }

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
          doc.text(`  - Préscolaire: ${acces.nouvellesSallesClasses.prescolaire || 0} (Source: ${acces.nouvellesSallesClasses.sourceFinancementPrescolaire || 'N/A'})`);
          doc.text(`  - Primaire: ${acces.nouvellesSallesClasses.primaire || 0} (Source: ${acces.nouvellesSallesClasses.sourceFinancementPrimaire || 'N/A'})`);
          doc.text(`  - Secondaire: ${acces.nouvellesSallesClasses.secondaire || 0} (Source: ${acces.nouvellesSallesClasses.sourceFinancementSecondaire || 'N/A'})`);
          doc.moveDown(0.3);
        }

        // Nouveaux Bancs et Tables
        if (acces.nouveauxBancsTables) {
          doc.fontSize(10).font('Helvetica-Bold').text('Nouveaux Bancs et Tables:');
          doc.text(`  - Préscolaire: ${acces.nouveauxBancsTables.prescolaire || 0} (Source: ${acces.nouveauxBancsTables.sourceFinancementPrescolaire || 'N/A'})`);
          doc.text(`  - Primaire: ${acces.nouveauxBancsTables.primaire || 0} (Source: ${acces.nouveauxBancsTables.sourceFinancementPrimaire || 'N/A'})`);
          doc.text(`  - Secondaire: ${acces.nouveauxBancsTables.secondaire || 0} (Source: ${acces.nouveauxBancsTables.sourceFinancementSecondaire || 'N/A'})`);
          doc.moveDown(0.3);
        }

        // Nouvelles Latrines
        if (acces.nouvellesLatrines) {
          doc.fontSize(10).font('Helvetica-Bold').text('Nouvelles Latrines:');
          doc.text(`  - Préscolaire: ${acces.nouvellesLatrines.prescolaire || 0} (Source: ${acces.nouvellesLatrines.sourceFinancementPrescolaire || 'N/A'})`);
          doc.text(`  - Primaire: ${acces.nouvellesLatrines.primaire || 0} (Source: ${acces.nouvellesLatrines.sourceFinancementPrimaire || 'N/A'})`);
          doc.text(`  - Secondaire: ${acces.nouvellesLatrines.secondaire || 0} (Source: ${acces.nouvellesLatrines.sourceFinancementSecondaire || 'N/A'})`);
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

// Fonction pour générer le HTML du rapport avec le design officiel
const generateRapportHTML = (rapport) => {
  const fs = require('fs');
  const path = require('path');

  // Fonction pour encoder l'image en base64
  const encodeImageToBase64 = (imagePath) => {
    try {
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const base64String = imageBuffer.toString('base64');
        const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
        return `data:${mimeType};base64,${base64String}`;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de l\'encodage de l\'image:', error);
      return null;
    }
  };

  // Encoder le logo - essayer plusieurs noms possibles
  let logoBase64 = null;
  const possibleLogoPaths = [
    path.join(__dirname, '../uploads/image.png'),
    path.join(__dirname, '../uploads/logo.png'),
    path.join(__dirname, '../uploads/default.jpg')
  ];
  
  for (const logoPath of possibleLogoPaths) {
    if (fs.existsSync(logoPath)) {
      logoBase64 = encodeImageToBase64(logoPath);
      if (logoBase64) {
        console.log(`Logo trouvé et encodé: ${logoPath}`);
        break;
      }
    }
  }
  
  if (!logoBase64) {
    console.warn('Aucun logo trouvé, utilisation d\'un placeholder');
  }

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
        <title>FICHE DE COLLECTE DES DONNEES SPECIFIQUES</title>
        <style>
            @page {
                size: A4;
                margin: 20mm;
            }
            body {
                font-family: 'Times New Roman', serif;
                font-size: 10px;
                line-height: 1.2;
                margin: 0;
                padding: 0;
                color: #000;
                background: white;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
            }
            .republic {
                font-size: 14px;
                font-weight: bold;
                margin: 0;
                text-transform: uppercase;
            }
            .logo-container {
                text-align: center;
                margin: 10px 0;
            }
            .logo {
                width: 80px;
                height: 80px;
                object-fit: contain;
            }
            .ministry {
                font-size: 12px;
                font-weight: bold;
                margin: 5px 0;
                text-transform: uppercase;
            }
            .direction {
                font-size: 12px;
                font-weight: bold;
                margin: 5px 0;
                text-transform: uppercase;
            }
            .main-title {
                font-size: 14px;
                font-weight: bold;
                margin: 15px 0;
                text-transform: uppercase;
                text-align: center;
            }
            .section {
                margin-bottom: 15px;
            }
            .section-title {
                font-size: 11px;
                font-weight: bold;
                margin-bottom: 8px;
                text-align: left;
                background-color: #e6f3ff;
                padding: 5px;
                border-left: 3px solid #0066cc;
            }
            .info-table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 9px;
            }
            .info-table th, .info-table td {
                border: 1px solid #000;
                padding: 4px;
                text-align: left;
                vertical-align: top;
            }
            .info-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 9px;
            }
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 8px 0;
                font-size: 8px;
            }
            .data-table th, .data-table td {
                border: 1px solid #000;
                padding: 3px;
                text-align: center;
                vertical-align: middle;
            }
            .data-table th {
                background-color: #e6f3ff;
                font-weight: bold;
                font-size: 8px;
            }
            .colspan-4 {
                text-align: center;
                font-weight: bold;
            }
            .total-row {
                background-color: #f9f9f9;
                font-weight: bold;
            }
            .page-number {
                position: fixed;
                bottom: 10mm;
                right: 10mm;
                font-size: 8px;
                color: #666;
            }
            .page-break {
                page-break-before: always;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="republic">République Démocratique du Congo</div>
            <div class="logo-container">
                ${logoBase64 ? `<img src="${logoBase64}" class="logo" alt="Logo RDC">` : '<div style="width: 80px; height: 80px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; margin: 0 auto;"><span style="font-size: 8px; color: #666;">LOGO</span></div>'}
            </div>
            <div class="ministry">MINISTERE DE L'EDUCATION NATIONALE ET NOUVELLE CITOYENNETE</div>
            <div class="direction">PROVINCE EDUCATIONNELLE DU ${rapport.identificationProved?.provinceEducationnelle || 'Pas de province educationnelle'}</div>
            <div class="main-title">FICHE DE COLLECTE DES DONNEES SPECIFIQUES</div>
        </div>

        <div class="section">
            <div class="section-title">INFORMATIONS GENERALES</div>
            <table class="info-table">
                <tr>
                    <th style="width: 40%;">Province Administrative</th>
                    <td>${rapport.identificationProved?.provinceAdministrative || 'HAUT-UELE'}</td>
                </tr>
                <tr>
                    <th>Province Educationnelle</th>
                    <td>${rapport.identificationProved?.provinceEducationnelle || 'HAUT-UELE 2'}</td>
                </tr>
                <tr>
                    <th>Nom du PROVED</th>
                    <td>${rapport.identificationProved?.directeurProvincial || 'Alfred DJABIRI ASSANI'}</td>
                </tr>
                <tr>
                    <th>N° de Contact</th>
                    <td>${rapport.identificationProved?.telephone || '+243825189014 ; +243970950893'}</td>
                </tr>
                <tr>
                    <th>Adresse Mail</th>
                    <td>${rapport.identificationProved?.emailProfessionnel || 'kdjabiriassani@gmail.com'}</td>
                </tr>
                <tr>
                    <th>Numéro DINACOPE</th>
                    <td>${rapport.identificationProved?.numeroDinacope || '1151828'}</td>
                </tr>
                <tr>
                    <th>Ville/Commune/Territoire</th>
                    <td>${rapport.identificationProved?.chefLieuProved || 'Watsa'}</td>
                </tr>
                <tr>
                    <th>Adresse (quartier, Avenue, N°)</th>
                    <td>${rapport.identificationProved?.adresse || 'l\'adresse n\'est pas renseignée'}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">1. DONNEES SCOLAIRES PAR NIVEAU D'ETUDE PAR SECTEUR D'ENSEIGNEMENT</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th rowspan="2">Indicateurs</th>
                        <th colspan="4" class="colspan-4">Publique</th>
                        <th colspan="4" class="colspan-4">Privé</th>
                        <th rowspan="2">Total Général</th>
                    </tr>
                    <tr>
                        <th>Préscolaire</th>
                        <th>Primaire</th>
                        <th>Secondaire</th>
                        <th>Total</th>
                        <th>Préscolaire</th>
                        <th>Primaire</th>
                        <th>Secondaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Nombre d'écoles</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                        <td class="total-row"><strong>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreEcoles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreEcoles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre d'élèves</strong></td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0))}</td>
                        <td class="total-row">${((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0))}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</td>
                        <td class="total-row">${((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</td>
                        <td class="total-row"><strong>${((rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)) + ((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre de filles</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</td>
                        <td class="total-row"><strong>${(rapport.parametresCles?.niveauPrescolaire?.espaceCommunautaireEveil?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 0) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre des places assises</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses * 25 || 1092)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses * 40 || 49465)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB * 35 || 30409)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses * 25 || 1092) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses * 40 || 49465) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB * 35 || 30409)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses * 25 || 2251)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses * 40 || 13799)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites * 35 || 19212)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses * 25 || 2251) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses * 40 || 13799) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites * 35 || 19212)}</td>
                        <td class="total-row"><strong>116228</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Ratio élèves/classe</strong></td>
                        <td>${((rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons + rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 1920) / (rapport.parametresCles?.niveauPrescolaire?.maternel?.nombreClasses || 1092)).toFixed(2)}</td>
                        <td>${((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 200214) / (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 49465)).toFixed(2)}</td>
                        <td>${((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 33993) / (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 30409)).toFixed(2)}</td>
                        <td class="total-row">2.91</td>
                        <td>${((rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifFilles || 3463) / (rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.nombreClasses || 2251)).toFixed(2)}</td>
                        <td>${((rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 28146) / (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.nombreClasses || 13799)).toFixed(2)}</td>
                        <td>${((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 13644) / (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 19212)).toFixed(2)}</td>
                        <td class="total-row">1.28</td>
                        <td class="total-row"><strong>2.42</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Nombre d'élèves année scolaire précédente (2022-2023)</strong></td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons + rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 1416)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 192159)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 29967)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifGarcons + rapport.parametresCles?.niveauPrescolaire?.maternel?.effectifFilles || 1416) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 192159) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 29967)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifFilles || 5142)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 23342)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 12985)}</td>
                        <td class="total-row">${(rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrescolaire?.prePrimaire?.effectifFilles || 5142) + (rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifGarcons + rapport.parametresCles?.niveauPrimaire?.enseignementPrimaire?.effectifFilles || 23342) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons + rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 12985)}</td>
                        <td class="total-row"><strong>265011</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">2. NOMBRE D'ECOLES ET D'ELEVES DES FILIERES TECHNIQUES PAR SECTEUR D'ENSEIGNEMENT 2023-2024</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th rowspan="2">N°</th>
                        <th rowspan="2">Filières</th>
                        <th colspan="3" class="colspan-4">Public</th>
                        <th colspan="3" class="colspan-4">Privé</th>
                    </tr>
                    <tr>
                        <th>Nombre écoles</th>
                        <th>GF</th>
                        <th>F</th>
                        <th>Nombre écoles</th>
                        <th>GF</th>
                        <th>F</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>01</td>
                        <td>Agriculture</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.classes7emeCTEB || 0)}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0))}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.premierCycle?.effectifFilles || 0)}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.classesHumanites || 0)}</td>
                        <td>${formatNumber((rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifGarcons || 0) + (rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0))}</td>
                        <td>${formatNumber(rapport.parametresCles?.niveauSecondaire?.enseignementSecondaire?.deuxiemeCycle?.effectifFilles || 0)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        ${rapport.introduction ? `
        <div class="section">
            <div class="section-title">3. INTRODUCTION</div>
            <div style="text-align: justify; margin: 10px 0; font-size: 10px;">${rapport.introduction}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">4. PERSONNEL ENSEIGNANT</div>
            <table class="data-table">
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
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0)}</td>
                        <td class="total-row">${(rapport.personnel?.personnelEnseignant?.prescolaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.prescolaire?.femmes || 0)}</td>
                    </tr>
                    <tr>
                        <td>Primaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0)}</td>
                        <td class="total-row">${(rapport.personnel?.personnelEnseignant?.primaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.primaire?.femmes || 0)}</td>
                    </tr>
                    <tr>
                        <td>Secondaire</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0)}</td>
                        <td>${formatNumber(rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0)}</td>
                        <td class="total-row">${(rapport.personnel?.personnelEnseignant?.secondaire?.hommes || 0) + (rapport.personnel?.personnelEnseignant?.secondaire?.femmes || 0)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">5. PERSONNEL ADMINISTRATIF</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Effectif</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Direction Provinciale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.directionProvinciale || 0)}</td></tr>
                    <tr><td>Inspection Principale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.inspectionPrincipale || 0)}</td></tr>
                    <tr><td>DINACOPE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.dinacope || 0)}</td></tr>
                    <tr><td>SERNIE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sernie || 0)}</td></tr>
                    <tr><td>Coordination Provinciale</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.coordinationProvinciale || 0)}</td></tr>
                    <tr><td>Sous-division</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sousDivision || 0)}</td></tr>
                    <tr><td>Pools Inspection Primaire</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.poolsInspectionPrimaire || 0)}</td></tr>
                    <tr><td>Pools Inspection Secondaire</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.poolsInspectionSecondaire || 0)}</td></tr>
                    <tr><td>Antenne DINACOPE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.antenneDinacope || 0)}</td></tr>
                    <tr><td>Antenne SERNIE</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.antenneSernie || 0)}</td></tr>
                    <tr><td>Coordination Diocésaine</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.coordinationDiocesaine || 0)}</td></tr>
                    <tr><td>Sous-coordination Conventionnées</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.sousCoordinationConventionnees || 0)}</td></tr>
                    <tr><td>Conseillerie Résidente</td><td>${formatNumber(rapport.personnel?.personnelAdministratif?.conseillerieResidente || 0)}</td></tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">6. RÉALISATIONS - ACCÈS, ACCESSIBILITÉ ET ÉQUITÉ</div>
            ${rapport.realisations?.accesAccessibiliteEquite ? `
            <div style="margin: 10px 0;">
                ${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Nouvelles Salles de Classes</h4>
                    <table class="data-table">
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
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.prescolaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancementPrescolaire || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.primaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancementPrimaire || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.secondaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesSallesClasses.sourceFinancementSecondaire || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Nouveaux Bancs et Tables</h4>
                    <table class="data-table">
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
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.prescolaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.sourceFinancementPrescolaire || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.primaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.sourceFinancementPrimaire || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.secondaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouveauxBancsTables.sourceFinancementSecondaire || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Nouvelles Latrines</h4>
                    <table class="data-table">
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
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.prescolaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.sourceFinancementPrescolaire || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.primaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.sourceFinancementPrimaire || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.secondaire || 0)}</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.nouvellesLatrines.sourceFinancementSecondaire || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.gratuitéEnseignementPrimaire ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Gratuité Enseignement Primaire</h4>
                    <p style="font-size: 9px; margin: 3px 0;">${rapport.realisations.accesAccessibiliteEquite.gratuitéEnseignementPrimaire}</p>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.sensibilisation ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Sensibilisation</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Réalisé</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Filles</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.sensibilisation.filles ? 'Oui' : 'Non'}</td>
                            </tr>
                            <tr>
                                <td>Enfants Hors École</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.sensibilisation.enfantsHorsEcole ? 'Oui' : 'Non'}</td>
                            </tr>
                            <tr>
                                <td>Peuples Autochtones</td>
                                <td>${rapport.realisations.accesAccessibiliteEquite.sensibilisation.peuplesAutochtones ? 'Oui' : 'Non'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Cantines Scolaires</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Préscolaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.prescolaire || 0)}</td>
                            </tr>
                            <tr>
                                <td>Primaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.primaire || 0)}</td>
                            </tr>
                            <tr>
                                <td>Secondaire</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.secondaire || 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                    ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.commentaire ? `
                    <p style="font-size: 9px; margin: 3px 0;"><strong>Commentaire:</strong> ${rapport.realisations.accesAccessibiliteEquite.cantinesScolaires.commentaire}</p>
                    ` : ''}
                </div>
                ` : ''}

                ${rapport.realisations.accesAccessibiliteEquite.indicateursAcces ? `
                <div style="margin: 8px 0;">
                    <h4 style="font-size: 10px; margin: 3px 0;">Indicateurs d'Accès</h4>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Indicateur</th>
                                <th>Valeur (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Proportion Nouveaux Inscrits</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.indicateursAcces.proportionNouveauxInscrits || 0)}</td>
                            </tr>
                            <tr>
                                <td>Taux Transition Primaire-CTEB</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionPrimaireCTEB || 0)}</td>
                            </tr>
                            <tr>
                                <td>Taux Transition CTEB-Humanités</td>
                                <td>${formatNumber(rapport.realisations.accesAccessibiliteEquite.indicateursAcces.tauxTransitionCTEBHumanites || 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>

        ${rapport.conclusion ? `
        <div class="section">
            <div class="section-title">7. CONCLUSION</div>
            <div style="text-align: justify; margin: 10px 0; font-size: 10px;">${rapport.conclusion}</div>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">8. INFORMATIONS GÉNÉRALES</div>
            <table class="info-table">
                <tr>
                    <th style="width: 40%;">Année du rapport</th>
                    <td>${rapport.annee || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Statut</th>
                    <td>${rapport.statut || 'N/A'}</td>
                </tr>
                <tr>
                    <th>Date de création</th>
                    <td>${formatDate(rapport.createdAt)}</td>
                </tr>
                <tr>
                    <th>Dernière modification</th>
                    <td>${formatDate(rapport.updatedAt)}</td>
                </tr>
                ${rapport.fichierJoint ? `
                <tr>
                    <th>Fichier joint</th>
                    <td>${rapport.fichierJoint}</td>
                </tr>
                ` : ''}
            </table>
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 200px;">
                <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
                    <p style="font-size: 9px; margin: 2px 0;"><strong>Signature du Directeur Provincial</strong></p>
                    <p style="font-size: 9px; margin: 2px 0;">${rapport.identificationProved?.directeurProvincial || 'N/A'}</p>
                </div>
            </div>
            <div style="text-align: center; width: 200px;">
                <div style="border-top: 1px solid #000; margin-top: 40px; padding-top: 5px;">
                    <p style="font-size: 9px; margin: 2px 0;"><strong>Cachet et Signature</strong></p>
                    <p style="font-size: 9px; margin: 2px 0;">Date: ${formatDate(new Date())}</p>
                </div>
            </div>
        </div>

        <div class="page-number">1</div>
        <div class="page-break"></div>
        <div class="page-number">2</div>
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