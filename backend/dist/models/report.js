"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Report = new Schema({
    date_of_report: {
        type: Date
    },
    doctors_name: {
        type: String
    },
    specializzazione: {
        type: String
    },
    reason_for_comming: {
        type: String
    },
    diagnosis: {
        type: String
    },
    therapy: {
        type: String
    },
    next_session: {
        type: Date
    },
    patient_id: {
        type: String
    },
    date_of_schedule: {
        type: Date
    }
});
exports.default = mongoose_1.default.model('Report', Report, 'report');
//# sourceMappingURL=report.js.map