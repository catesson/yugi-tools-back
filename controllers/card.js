const Card = require("../models/Card");
const allCard = require("../data/data.json");

//get
exports.getAllCard = (req, res, next) => {
 const {page = 1, limit = 30 } = req.query
 console.log(req.query.page)


  Card.find()
    .then((cards) => {
      const startCard = (limit * (page-1)) 
      
      const endCard = (startCard+limit)-1
      console.log(startCard + " end " +endCard)
      res.status(200).json(cards.slice(startCard, endCard));
    })
    .catch((error) => {
      res.status(401).json({ error });
    });
};


exports.getCard = (req, res, next) => {
  Card.findOne({ id: req.params.id })
    .then((card) => res.status(201).json(card))
    .catch((error) => res.status(400).json(error));
};



//post
//création des cartes dans la bdd
exports.createAllCard = (req, res, next) => {
  const cardsToSave = allCard.map((cardObject) => {
    const images = cardObject.card_images.map((image) => {
      return {
        ...image,
      };
    });
    const newCard = new Card({ ...cardObject, card_images: images });
    return newCard;
  });
  Card.insertMany(cardsToSave)
    .then(() => {
      res.status(201).json({ message: "Cards save !" });
    })
    .catch((error) => {
      console.log("erreur");
      res.status(400).json({ error });
    });
};
