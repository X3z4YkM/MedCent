"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manager_controller_1 = require("../controllers/manager.controller");
const managerRouter = express_1.default.Router();
managerRouter.route('/get_all_users').get((req, res) => new manager_controller_1.ManagerController().get_all_users(req, res));
managerRouter.route('/get_all_requests').get((req, res) => new manager_controller_1.ManagerController().get_all_requests(req, res));
managerRouter.route('/update_user').post((req, res) => new manager_controller_1.ManagerController().update_user(req, res));
exports.default = managerRouter;
//# sourceMappingURL=manager.router.js.map