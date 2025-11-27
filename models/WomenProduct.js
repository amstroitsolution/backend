const mongoose = require('mongoose');

const womenProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Dresses
      'Gown & Dresses',
      'Insta Sarees',
      'Jumpsuits',
      
      // Sets
      '2 Pcs Kurta Sets',
      '3 Pcs Kurta Sets',
      'Anarkali Sets',
      'A-Line Sets',
      'Straight Suit Sets',
      'Sharara Sets',
      'Coord Sets',
      'Plus Size Suit Sets',
      
      // Bottoms
      'Trouser & Pants',
      'Salwar & Leggings',
      'Palazzos & Culottes',
      'Sharara',
      'Skirts',
      'Jeggings',
      'Plus Size Bottoms',
      
      // Kurtas
      'A-Line Kurta',
      'Straight Kurtas',
      'Flared Kurtas',
      'Asymmetrical Kurta',
      'Winter Kurta',
      'Plus Size Kurta',
      
      // Saree Collections
      'Silk Sarees',
      'Cotton Sarees',
      'Designer Sarees',
      'Party Wear Sarees',
      'Casual Sarees',
      'Bridal Sarees',
      
      // Lehenga Collections
      'Bridal Lehengas',
      'Party Wear Lehengas',
      'Designer Lehengas',
      'Casual Lehengas',
      'Festive Lehengas',
      
      // Others
      'Wedding Collection'
    ]
  },
  images: [{
    type: String
  }],
  price: {
    type: Number
  },
  sizes: [{
    type: String
  }],
  colors: [{
    type: String
  }],
  material: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WomenProduct', womenProductSchema);
