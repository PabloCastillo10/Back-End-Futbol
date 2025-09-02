import mongoose, {model, Schema} from "mongoose";

const GameSchema = new Schema({
    estadio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        
    },
    FechaHora: {
        type: Date,
        
    },
    jornada: {
        type: Number,
        
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League",
        
    },
    equipoLocal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        
    },
    equipoVisitante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
       
    },
    golesLocal: {
        type: Number,
        default: 0
    },
    golesVisitante: {
        type: Number,
        default: 0
    },
    
}, {
    timestamps: true,
    versionKey: false
})

export default model("Game", GameSchema)