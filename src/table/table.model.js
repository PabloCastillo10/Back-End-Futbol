import mongoose, {model, Schema} from "mongoose";

const TableSchema = new Schema({
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League",
        required: true
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    partidosJugados: {
        type: Number,
        default: 0,
    },
    partidosGanados: {
        type: Number,
        default: 0,
    },
    partidosEmpatados: {
        type: Number,
        default: 0,
    },
    partidosPerdidos: {
        type: Number,
        default: 0,
    },
    golesAFavor: {
        type: Number,
        default: 0
    },
    golesEnContra: {
        type: Number,
        default: 0
    },
    diferenciaGoles: {
        type: Number,
        default: 0
    },
    puntos: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
     versionKey: false
})

export default model("Table", TableSchema)