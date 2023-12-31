"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let User = new Schema({
    _id: {
        type: mongodb_1.ObjectId
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    mobile_phone: {
        type: String
    },
    email: {
        type: String
    },
    type: {
        type: String
    },
    d_data: {
        type: Object
    },
    img_src: {
        type: String
    },
    status: {
        type: String
    }
});
exports.default = mongoose_1.default.model('User', User, 'users');
//# sourceMappingURL=user.js.map