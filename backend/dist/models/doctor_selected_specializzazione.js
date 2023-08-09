"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let DocSpec_servics = new Schema({
    _id: {
        type: mongodb_1.ObjectId
    },
    docotrId: {
        type: String
    },
    services: {
        type: Array
    }
});
exports.default = mongoose_1.default.model('DocSpec_servics', DocSpec_servics, 'doctor_selected_specializzazione');
//# sourceMappingURL=doctor_selected_specializzazione.js.map