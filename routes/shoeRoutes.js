const express = require('express');
const { getShoeById, getAllShoes, addShoe, updateShoe, deleteShoe, searchShoes } = require('../controllers/shoeController');
const router = express.Router();

router.get('/:id', getShoeById);
router.get('/', getAllShoes);
router.post('/', addShoe);
router.put('/:id', updateShoe);
router.delete('/:id', deleteShoe);
router.get('/search', searchShoes);

module.exports = router;
