const express = require('express');
const router = express.Router();
const controller = require('../controllers/specialOfferController');
const { uploadProduct } = require('../middleware/upload');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', uploadProduct.array('images', 5), controller.create);
router.put('/:id', uploadProduct.array('images', 5), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
