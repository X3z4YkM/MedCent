import * as express from "express";
import User from "../models/user";
import { UserController } from "./user.controller";
import * as fs from "fs";
import path from "path";
import Offline_date from "../models/offline_date";
import Calender from "../models/doctor.calender";

const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";

export class DoctorController {
  get_all = (req: express.Request, res: express.Response) => {
    User.find({ type: "Doctor", status: "true" }, (err, data) => {
      if (data) {
        let new_data = data.map((doctor) => {
          const path_to_images = path.join(
            __dirname,
            `../../src/assets/profile_pictures/${doctor["img_src"]}`
          );
          let image = fs.readFileSync(path_to_images);
          return {
            firstname: doctor["firstname"],
            lastname: doctor["lastname"],
            specializzazione: doctor["d_data"].specializzazione,
            office_branch: doctor["d_data"].office_branch,
            doctor_id: doctor["_id"],
            img_profile: image,
          };
        });

        res.status(200).json({
          status: 200,
          executed: "getting all docotrs from db",
          doctors: new_data,
        });
      } else {
        res.status(401).json({
          status: 401,
          executed: "error happened when getting all doctors ",
          error_message: err,
        });
      }
    });
  };

  getDoctor = (req: express.Request, res: express.Response) => {
    jwt.verify(req.body.token, secret, (err, decoded) => {
      if (decoded) {
        if (decoded["_doc"].type === "Manager") {
          res.status(200).json({
            status: 401,
            message: "manager",
          });
        } else {
          console.log("23");
          const path_to_images = path.join(
            __dirname,

            `../../src/assets/profile_pictures/${decoded["_doc"].img_src}`
          );
          let image = fs.readFileSync(path_to_images);

          res.status(200).json({
            status: 200,
            user: decoded["_doc"],
            image: image,
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          error_message: err,
        });
      }
    });
  };

  updateProfile = (req: express.Request, res: express.Response) => {
    const new_user_data = req.body.new_user_data;
    User.findOne({ _id: new_user_data._id }, (err, data) => {
      console.log(1);
      if (data) {
        console.log(11);
        const updateFields = {};
        Object.keys(data).forEach((key) => {
          if (key !== "_id") {
            if (key === "d_data") {
              let indic = false;
              Object.keys(data[key]).forEach((key_iner) => {
                if (data[key][key_iner] !== new_user_data[key][key_iner]) {
                  if (!indic) {
                    updateFields[key] = {};
                    updateFields[key] = new_user_data[key];
                    indic != indic;
                  }
                  updateFields[key][key_iner] = new_user_data[key][key_iner];
                }
              });
            } else {
              if (data[key] !== new_user_data[key]) {
                updateFields[key] = new_user_data[key];
                if (key === "username") {
                  let extension = data["img_src"].split(".")[1];
                  updateFields[
                    "img_src"
                  ] = `${new_user_data.username}.${extension}`;
                  Promise.all([
                    this.renameFilePromise(
                      data["img_src"],
                      updateFields["img_src"]
                    ),
                  ]);
                  console.log(updateFields["img_src"]);
                  console.log(data["img_src"]);
                }
              }
            }
          }
        });
        console.log(updateFields);
        if (req.body.img != null) {
          const imageSrc = req.body.img;
          const extension = new_user_data.extension;
          let user = null;
          if (imageSrc) {
            const path_to_images = path.join(
              __dirname,
              `../../src/assets/profile_pictures/${new_user_data.username}.${new_user_data.file_extension}`
            );
            console.log(path_to_images);
            const base64Data = imageSrc.replace(/^data:image\/png;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, "base64");
            fs.writeFileSync(path_to_images, imageBuffer);
            updateFields[
              "img_src"
            ] = `${new_user_data.username}.${new_user_data.file_extension}`;
            let image = fs.readFileSync(path_to_images);
            //new_user_data.img_path = `${new_user_data.username}.${new_user_data.file_extension}`
            new_user_data.img_profile = image;
          }
        }

        if (Object.keys(updateFields).length === 0) {
          console.log(222);
          res.status(200).json({
            status: 200,
            cause: "no data was changed",
          });
        } else {
          User.findOneAndUpdate(
            { _id: data._id },
            { $set: updateFields },
            { new: true },
            (err, data) => {
              if (data) {
                const payload = { ...data, _id: data._id.toString() };
                console.log(`------this is user\n ${data}\n------------`);
                jwt.sign(payload, secret, { expiresIn: "1h" }, (err, token) => {
                  jwt.verify(token, secret, (err, decoded) => {
                    console.log(`this is decoded\n ${decoded}\n----------`);
                  });
                  res.status(200).json({
                    token: token,
                    status: 200,
                    cause: "fileds updated",
                    return_data: new_user_data,
                  });
                });
              } else {
                res.status(401).json({
                  status: 401,
                  cause: "failed to updated",
                });
              }
            }
          );
        }
      } else {
        // internal server error
        res.status(500).json({
          status: 500,
          cause: "user not found",
          error_message: err,
        });
      }
    }).lean();
  };

  renameFilePromise = (oldPath, newPath) => {
    const path_to_images_new = path.join(
      __dirname,
      `../../src/assets/profile_pictures/${newPath}`
    );
    const path_to_images_old = path.join(
      __dirname,
      `../../src/assets/profile_pictures/${oldPath}`
    );
    return new Promise((resolve, reject) => {
      fs.rename(path_to_images_old, path_to_images_new, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(1);
        }
      });
    });
  };

  set_new_offline_date = (req: express.Request, res: express.Response) => {
    const sdate = req.body.start_date as Date;
    const edate = req.body.end_date as Date;
    const token = req.body.token;
    jwt.verify(req.body.token, secret, (err, decoded) => {
      if (decoded) {
        const id = decoded["_doc"]._id;
        Offline_date.updateOne(
          { docotrId: `${id}` },
          {
            $pull: {
              offline_dates: { start_date: `${sdate}`, end_date: `${edate}` },
            },
          }
        )
          .then(() => {
            res.status(200).json({
              status: 200,
              cause: "new date added ",
            });
          })
          .catch((err) => {
            res.status(500).json({
              status: 500,
              cause: "faild to add dates",
              error_message: err,
            });
          });
      } else {
        res.status(500).json({
          status: 500,
          cause: "token invalid",
          error_message: err,
        });
      }
    });
  };

  get_doctor_calender = (req: express.Request, res: express.Response) => {
    const token = req.body.token;
    jwt.verify(token, secret, (err, decoded) => {
      if (decoded) {
        const id = decoded["_doc"]._id;

        Calender.findOne({ doctor_id: id }, (err, data) => {
          // calender for docotr exists
          if (data) {
            // all is good my
            res.status(200).json({
              status: 200,
              message: "found calender for doctor",
              data: data["reservations"],
            });
          } else {
            if (err) {
              res.status(200).json({
                status: 401,
                message: "error while getting data",
                error_message: err,
              });
            } else {
              res.json(200).json({
                status: 200,
                message: "calender emmpty",
                data: [],
              });
            }
          }
        });
      } else {
        res.status(200).json({
          status: 500,
          message: "token invalid",
          error_message: err,
        });
      }
    });
  };

  get_doctor_calender_id = (req: express.Request, res: express.Response) => {
    const id = req.body.token;

    Calender.findOne({ doctor_id: id }, (err, data) => {
      // calender for docotr exists
      if (data) {
        // all is good my

        res.status(200).json({
          status: 200,
          message: "found calender for doctor",
          data: data["reservations"],
        });
      } else {
        if (err) {
          res.status(200).json({
            status: 401,
            message: "error while getting data",
            error_message: err,
          });
        } else {
          res.status(200).json({
            status: 200,
            message: "calender emmpty",
            data: [],
          });
        }
      }
    });
  };
}
