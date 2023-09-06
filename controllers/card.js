const Card = require("../models/Card");
const allCard = require("../data/data.json");

//get

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

exports.postSearchCard = async (req, res, next) => {
  const { page = 1, limit = 30 } = req.query;
  const body = req.body;
  //supprimer les objet du body qui aurai une valeur null ou undefined
  for (const clé in body) {
    if (body[clé] == null || body[clé] == undefined) {
      delete body[clé];
    }
  }


  try {
    //return les cards + paggination
    const cards = await Card.find(req.body, null, {skip : (page -1) * limit, limit});
    const totalCards = await Card.estimatedDocumentCount()
    const maxPage = Math.ceil(totalCards / limit);
   
    return res
      .status(200)
      .json({ cards: cards, maxPage: maxPage });
  } catch {
    return res.status(401).json({ error });
  }
};
