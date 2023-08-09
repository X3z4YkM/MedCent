"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manager_controller_1 = require("../controllers/manager.controller");
const dcotorRouter = express_1.default.Router();
dcotorRouter.route('/get_all_users').get((req, res) => new manager_controller_1.ManagerController().get_all_users(req, res));
exports.default = dcotorRouter;
//# sourceMappingURL=managger.router.js.map