var mongoose  = require('mongoose');

var MapSchema = new mongoose.Schema({
        id: mongoose.Schema.Types.ObjectId,
        // TODO: schema:
        
        // ID:{

        // },
        // center:{

        // },
        // zoom:{

        // },
        // layer:{

        // },
        // geoCoordinates:{

        // },
        // options:{

        // },
        // navigationMode:{

        // },
        // track:{

        // }
    }
);
 

var Map = mongoose.model("MapSchema", MapSchema, "Maps");
module.exports = Map;