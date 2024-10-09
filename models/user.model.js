const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    password: { type: String, required: true },
    nom: { type: String, required: true },
    postnom: { type: String, required: true },
    prenom: { type: String, required: true },
    photo: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, required: true},
    direction: {type: String, required: true},
    service: {type: String, required: true},
    phone: {type: String, required: true},
},{timestamps: true, versionKey: false });

module.exports.User = model('User', userSchema);