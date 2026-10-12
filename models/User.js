const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  ad_soyad: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['ADMİN', 'HALF-ADMİN', 'MEMBER'], 
    default: 'MEMBER' 
  },
  telefon: { 
    type: String 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Kayıt işleminden hemen önce şifreyi kriptola
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Kullanıcı giriş yaparken girilen şifre ile kriptolu şifreyi karşılaştır
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);