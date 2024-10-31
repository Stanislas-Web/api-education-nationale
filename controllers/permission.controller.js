const Permission = require('../models/permission.model');

// Créer une nouvelle permission
exports.createPermission = async (req, res) => {
  try {
    const permission = new Permission(req.body);
    await permission.save();
    res.status(201).json({ message: 'Permission créée avec succès', permission });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création de la permission', error });
  }
};

// Récupérer toutes les permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des permissions', error });
  }
};

// Modifier une permission par ID
exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByIdAndUpdate(id, req.body, { new: true });
    if (!permission) return res.status(404).json({ message: 'Permission non trouvée' });
    res.status(200).json({ message: 'Permission mise à jour avec succès', permission });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la permission', error });
  }
};

// Supprimer une permission par ID
exports.deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByIdAndDelete(id);
    if (!permission) return res.status(404).json({ message: 'Permission non trouvée' });
    res.status(200).json({ message: 'Permission supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la permission', error });
  }
};
