const express = require("express");
const router = express.Router();
const cardCtrl = require("../controllers/card")


router.get('/monster_filter' , cardCtrl.getMonsterFilter)

router.get('/magic_filter' , cardCtrl.getMagicFilter)

router.get('/trap_filter' , cardCtrl.getTrapFilter)

router.get('/:id' , cardCtrl.getCard)



router.post('/createData',  cardCtrl.createAllCard)

router.post('/' , cardCtrl.postSearchCard)

module.exports = router;