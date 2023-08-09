"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Spec_servics = new Schema({
    _id: {
        type: mongodb_1.ObjectId
    },
    specializzazione: {
        type: String
    },
    services: {
        type: Array
    }
});
exports.default = mongoose_1.default.model('Spec_servics', Spec_servics, 'specializzazione_servics');
//# sourceMappingURL=specializzazione_servics.js.map