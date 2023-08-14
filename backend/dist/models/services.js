"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Servic = new Schema({
    _id: {
        type: mongodb_1.ObjectId
    },
    servic_name: {
        type: String
    },
    cost: {
        type: mongodb_1.Decimal128
    },
    time: {
        type: Number
    },
    description: {
        type: String
    }
});
exports.default = mongoose_1.default.model('Servic', Servic, 'srvices');
//# sourceMappingURL=services.js.map