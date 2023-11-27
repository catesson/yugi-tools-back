const Card = require("../models/Card");
// const allCard = require("../data/data.json");

//get

exports.getCard = (req, res, next) => {
  Card.findOne({ id: req.params.id })
    .then((card) => res.status(201).json(card))
    .catch((error) => res.status(400).json(error));
};



exports.getFilter = async (req, res, next) => {
  try {
    //Pipline pour récupérer les types et les attributs
    const MonsterFilterPipline = [
      {
        $match: {
          type: { $regex: /monster/i }, // Filtrez les documents avec "Type" contenant "monster" (insensible à la casse)
        },
      },
      {
        $facet: {
          race: [{ $group: { _id: "$race" }},{ $sort: { _id: 1 } }],
          attribute: [{ $group: { _id: "$attribute" }}, {$sort: { _id: 1 } }],
          frameType: [{ $group: { _id: "$frameType" }}, {$sort: { _id: 1 } }]
        },
      },
    ];
    const monsterFilter = await Card.aggregate(MonsterFilterPipline);
    const monsterRace = monsterFilter[0].race;
    const attribute = monsterFilter[0].attribute;
    const frameTypeMonster = monsterFilter[0].frameType;

    //filtre pour les magies
    const MagicFilterPipline = [
      {
        $match: {
          frameType: { $regex: /spell/i }, // Filtrez les documents avec "frameType" contenant "monster" (insensible à la casse)
        },
      },
      {
        $facet: {
          race: [{ $group: { _id: "$race" }},{ $sort: { _id: 1 } }]
        },
      },
    ];
    const magicFilter = await Card.aggregate(MagicFilterPipline);
    const magicRace = magicFilter[0].race;

    // filter pour les piège
    const TrapFilterPipline = [
      {
        $match: {
          frameType: { $regex: /trap/i }, // Filtrez les documents avec "frameType" contenant "monster" (insensible à la casse)
        },
      },
      {
        $facet: {
          race: [{ $group: { _id: "$race" }},{ $sort: { _id: 1 } }]
        },
      },
    ];

    const trapFilter = await Card.aggregate(TrapFilterPipline);
    const trapRace = trapFilter[0].race;
    console.log({
      monsterRace: monsterRace,
      attribute: attribute,
      frameTypeMonster: frameTypeMonster,
      magicRace: magicRace,
      trapRace:trapRace

    })
    return res.status(200).json({
      monsterRace: monsterRace,
      attribute: attribute,
      frameTypeMonster: frameTypeMonster,
      magicRace: magicRace,
      trapRace:trapRace

    });
  } catch (error) {
    return res.status(401).json({ error });
  }
};
//post
//création des cartes dans la bdd
// exports.createAllCard = (req, res, next) => {
//   const cardsToSave = allCard.map((cardObject) => {
//     const images = cardObject.card_images.map((image) => {
//       return {
//         ...image,
//       };
//     });
//     const newCard = new Card({ ...cardObject, card_images: images });
//     return newCard;
//   });
//   Card.insertMany(cardsToSave)
//     .then(() => {
//       res.status(201).json({ message: "Cards save !" });
//     })
//     .catch((error) => {
//       console.log("erreur");
//       res.status(400).json({ error });
//     });
// };

exports.postSearchCard = async (req, res, next) => {
  const { page = 1, limit = 30 } = req.query;

  const getQuerySearch = () => {
    const {
      name,
      archetype,
      attribute,
      type,
      race,
      desc,
      frameType,
      linkval,
      atk,
      def,
      level,
      scale
    } = req.query;

    return {
      name: name ? new RegExp(name, "i") : undefined,
      archetype: archetype,
      attribute: attribute,
      type: type ? new RegExp(type, "i") : undefined,
      race: race,
      desc: desc ? new RegExp(desc, "i") : undefined,
      frameType: frameType ? new RegExp(frameType, "i") : undefined,
      linkval: linkval,
      atk: atk,
      def: def,
      level: level,
      scale: scale,
    };
  };

  const querySearch = getQuerySearch();

  //supprimer les objet du body qui aurai une valeur null ou undefined
  for (const clé in querySearch) {
    if (
      querySearch[clé] == null ||
      querySearch[clé] === undefined ||
      querySearch[clé] == ""
    ) {
      delete querySearch[clé];
    }
  }

  console.log(querySearch);
  try {
    // Demander explication a Quentin !
    const pipeline = [
      {
        $match: {
          $and: [
            querySearch, // Vos conditions de recherche
          ],
        },
      },
      {
        $facet: {
          cards: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCards: [{ $count: "count" }],
        },
      },
      {
        $unwind: "$totalCards", // Désassemblez le tableau résultant pour obtenir un objet
      },
    ];

    const results = await Card.aggregate(pipeline);

    const cards = results[0].cards;

    const totalCards = results[0].totalCards ? results[0].totalCards.count : 0;
    const maxPage = Math.ceil((await totalCards) / limit);
    console.log(
      "toatle cards : " +
        totalCards +
        " limit : " +
        limit +
        "maxPage : " +
        maxPage
    );

    return res.status(200).json({
      cards: cards,
      maxPage: maxPage,
    });
  } catch (error) {
    return res.status(401).json({ error });
  }
};
