const mongoose = require('../clients/mongoClient');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username ist erforderlich'],
    trim: true,
    minlength: [3, 'Username muss mindestens 3 Zeichen haben'],
    maxlength: [30, 'Username darf maximal 30 Zeichen haben']
  },
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Ungültige E-Mail-Adresse']
  },
  password: {
    type: String,
    required: [true, 'Passwort ist erforderlich'],
    minlength: [6, 'Passwort muss mindestens 6 Zeichen haben']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index für bessere Performance
userSchema.index({ email: 1 }, { unique: true });

// Virtuelle Felder
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);