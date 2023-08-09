"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const servics_controller_1 = require("../controllers/servics.controller");
const servicsRouter = express_1.default.Router();
servicsRouter.route('/specializzazione/get').post((req, res) => new servics_controller_1.ServicsController().specializzazione_based_services(req, res));
servicsRouter.route('/docotr/update').post((req, res) => new servics_controller_1.ServicsController().upate_doctor(req, res));
exports.default = servicsRouter;
//# sourceMappingURL=services.router.js.map