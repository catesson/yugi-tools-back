const mongoose = require('mongoose')

const cardSchema = mongoose.Schema({
    id:{ type : String, require : true },
    name:{ type : String, require : true },
    type:{ type : String, require : false },
    frameType:{ type : String, require : false },
    desc:{ type : String, require : true },
    atk:{ type : String, require : false },
    def:{ type : String, require : false },
    level:{ type : String, require : false },
    race:{ type : String, require : false },
    attribute:{ type : String, require : false },
    archetype:{ type : String, require : false },
    scale:{ type : String, require : false },
    linkval:{ type : String, require : false },
    /*linkmarkers :[{
        left : { type : Boolean, require : false },
        right : { type : Boolean, require : false },
        topRight : { type : Boolean, require : false },
        top : { type : Boolean, require : false },
        topLeft : { type : Boolean, require : false },
        bottomRight : { type : Boolean, require : false },
        bottom : { type : Boolean, require : false },
        bottomLeft : { type : Boolean, require : false },
    }],*/
    card_images : [{
        id:{ type : String, require : true },
        image_url:{ type : String, require : false },
        image_url_small:{ type : String, require : false },
        image_url_cropped:{ type : String, require : false },
    }]

})

module.exports = mongoose.model('Card', cardSchema);