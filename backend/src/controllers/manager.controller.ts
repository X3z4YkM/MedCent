import * as express from "express";
import User from "../models/user";
import * as fs from "fs";
import path from "path";
import ReqNS from "../models/services.request_new_servic";
import Servic from "../models/services";
import Spec_servics from "../models/specializzazione_servics";
import { ObjectId } from "mongodb";
import DocSpec_servics from "../models/doctor_selected_specializzazione";
import Specializzazione from "../models/specializzaziones";
const jwt = require("jsonwebtoken");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";

export class ManagerController {

  get_manager = (req: express.Request, res: express.Response) => {
    jwt.verify(req.body.token, secret, (err, decoded) => {
            
      if(decoded){
        console.log(decoded)
            res.status(200).json({
              status:200,
                user: decoded["_doc"]
            });
      }else{
          res.status(401).json({
              status: 401,
              error_message: err
          });
      }
    });
  
  }


    get_all_services = (req: express.Request, res: express.Response) => {
            Servic.find({}, (err, data)=>{
                if(data){
                    res.status(200)
                    .json({
                        status:200,
                        data: data
                    })
                }else{
                    if(err){
                        res.status(200)
                        .json({
                            status:200,
                            error_message: err
                        })
                    }else{
                        res.status(200)
                        .json({
                            status:401,
                            err: "not found"
                        })
                    }
                }
                
            })
    }

  get_all_users = (req: express.Request, res: express.Response) => {
    User.find({ type: { $ne: "Manager" }, status: true }, (err, data) => {
      if (data) {
        let newdata = data.map((data) => {
          const path_to_images = path.join(
            __dirname,
            `../../src/assets/profile_pictures/${data["img_src"]}`
          );

          let image = fs.readFileSync(path_to_images);

          return {
            ...data,
            img_profile: image,
          };
        });

        res.status(200).json({
          status: 200,
          cause: "getting all user data except manager",
          data: newdata,
        });
      } else {
        res.status(401).json({
          status: 401,
          cause: "getting all user data except manager",
          error_message: err,
        });
      }
    }).lean();
  };

  get_all_requests = (req: express.Request, res: express.Response) => {
    User.find({ type: { $ne: "manager" }, status: false }, (err, data) => {
      if (data) {
        let newdata = data.map((data) => {
          const path_to_images = path.join(
            __dirname,
            `../../src/assets/profile_pictures/${data["img_src"]}`
          );

          let image = fs.readFileSync(path_to_images);

          return {
            ...data,
            img_profile: image,
          };
        });

        res.status(200).json({
          status: 200,
          cause: "getting all user data except manager",
          data: newdata,
        });
      } else {
        res.status(401).json({
          status: 401,
          cause: "getting all user data except manager",
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

  update_user = (req: express.Request, res: express.Response) => {
    const new_user_data = req.body.new_user_data;
    User.findOne({ _id: new_user_data._id }, (err, data) => {
      if (data) {
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
          User.updateOne({ _id: data._id }, { $set: updateFields })
            .then(() => {
              res.status(200).json({
                status: 200,
                cause: "fileds updated",
                return_data: new_user_data,
              });
            })
            .catch((err) => {
              res.status(401).json({
                status: 401,
                cause: "failed to updated",
              });
            });
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
  remove_service_request = (req: express.Request, res: express.Response) => {
    const spec = req.body.specializzazione;
    const data = req.body.data;
    console.log(data);
    ReqNS.updateOne(
      { specializzazione: spec },
      {
        $pull: {
          requests: {
            service_name: data["service_name"],
            servic_cost: data["servic_cost"],
            service_dur: data["service_dur"],
            service_des: data["service_des"],
          },
        },
      },
      (error, result) => {
        if (error) {
          res.status(200).json({
            status: 401,
            cause: "getting all user data except manager",
            error_message: error,
          });
        } else {
          console.log(result);
          res.status(200).json({
            status: 200,
            after: result,
          });
        }
      }
    );
  };

  aprove_service_request = (req: express.Request, res: express.Response) => {
    const spec = req.body.specializzazione;
    const data = req.body.data;
    const paiload = new Servic({
      servic_name: data["service_name"],
      cost: data["servic_cost"] as number,
      time: data["service_dur"],
      description: data["service_des"],
    });
    console.log(paiload);
    paiload.save((err, data) => {
      if (err) {
        console.log(err);
        res.status(200).json({
          status: 401,
          error_message: err,
        });
      } else {
        console.log(`============${data}`);
        const id = data._id;
        Spec_servics.find({ specializzazione: spec }, (err, data2) => {
          if (err) {
            res.status(200).json({
              status: 401,
              error_message: err,
            });
          } else if (!data) {
            // ubaci novi entryy
            console.log("ubaci novi entryy");
            let spec_se = new Spec_servics({
              specializzazione: spec,
              services: [id],
            });

            spec_se.save((err, data) => {
              if (err) {
                res.status(200).json({
                  status: 401,
                  error_message: err,
                });
              } else {
                console.log(`-----${data}------`);
                ReqNS.updateOne(
                  { specializzazione: spec },
                  {
                    $pull: {
                      requests: {
                        service_name: data["service_name"],
                        servic_cost: data["servic_cost"],
                        service_dur: data["service_dur"],
                        service_des: data["service_des"],
                      },
                    },
                  },
                  (error, result) => {
                    if (error) {
                      res.status(200).json({
                        status: 401,
                        cause: "getting all user data except manager",
                        error_message: error,
                      });
                    } else {
                      console.log(result);
                      res.status(200).json({
                        status: 200,
                        after: result,
                      });
                    }
                  }
                );
              }
            });
          } else {
            // ubaci u array
            console.log("ubaci u arr");
            Spec_servics.updateOne(
              { specializzazione: spec },
              { $push: { services: id.toString() } },
              (err, data) => {
                if (err) {
                  res.status(200).json({
                    status: 401,
                    error_message: err,
                  });
                } else {
                  ReqNS.updateOne(
                    { specializzazione: spec },
                    {
                      $pull: {
                        requests: {
                          service_name: data["service_name"],
                          servic_cost: data["servic_cost"],
                          service_dur: data["service_dur"],
                          service_des: data["service_des"],
                        },
                      },
                    },
                    (error, result) => {
                      if (error) {
                        res.status(200).json({
                          status: 401,
                          cause: "getting all user data except manager",
                          error_message: error,
                        });
                      } else {
                        console.log(result);
                        res.status(200).json({
                          status: 200,
                          after: result,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  };

  get_data_spec_ser = (req: express.Request, res: express.Response) => {
    Spec_servics.aggregate([
      {
        $addFields: {
          servicesObjectId: {
            $map: {
              input: "$services",
              as: "serviceId",
              in: { $toObjectId: "$$serviceId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "srvices",
          localField: "servicesObjectId",
          foreignField: "_id",
          as: "all_services",
        },
      },
      {
        $project: {
          _id: 0,
          specializzazione: "$specializzazione",
          all_services: {
            $map: {
              input: "$all_services",
              as: "service",
              in: {
                id: "$$service._id",
                service_name: "$$service.servic_name",
                cost: "$$service.cost",
                time: "$$service.time",
                description: "$$service.description",
                edit: false,
                changes: false,
              },
            },
          },
        },
      },
    ]).exec((err, data) => {
      if (err) {
        res.status(200).json({
          status: 401,
          error_message: err,
        });
      } else {
        res.status(200).json({
          status: 200,
          data: data,
        });
      }
    });
  };

  update_service_data = (req: express.Request, res: express.Response) => {
    const id = new ObjectId(req.body.data["id"]);
    const data = req.body.data;
    Servic.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          servic_name: data.service_name,
          cost: data.servic_cost,
          time: data.service_dur,
          description: data.service_des,
        },
      },
      { new: true },
      (error, data) => {
        if (error) {
          res.status(200).json({
            status: 401,
            error_message: error,
          });
        }
        res.status(200).json({
          status: 200,
          data: data,
        });
      }
    );
  };

  delete_servic = (req: express.Request, res: express.Response) => {
    const id = req.body.id;
    const spec = req.body.spec;
    const id_o = new ObjectId(id);
    console.log("wookrs");
    Servic.deleteOne({ _id: id_o }, (err, data) => {
      console.log(data);
      if (err) {
        res.status(500).json({
          status: 500,
          error_message: err,
        });
      } else {
        Spec_servics.updateOne(
          { specializzazione: spec },
          { $pull: { services: id } },
          (err, data) => {
            console.log(data);
            if (err) {
              res.status(500).json({
                status: 500,
                error_message: err,
              });
            } else {
              DocSpec_servics.updateOne(
                { "services.services_id": id },
                { $pull: { services: { services_id: id } } },
                (err, data) => {
                  console.log(data);
                  if (err) {
                    res.status(500).json({
                      status: 500,
                      error_message: err,
                    });
                  } else {
                    res.status(200).json({
                      status: 200,
                    });
                  }
                }
              );
            }
          }
        );
      }
    });
  };

  add_new_spec = (req: express.Request, res: express.Response) => {
    const name = req.body.name;
    Specializzazione.findOne({ name: name }, (err, data) => {
      if (err) {
        res.status(500).json({
          status: 500,
          error_message: err,
        });
        return;
      }
      if (!data) {
        let spec_new = new Specializzazione({ name: name });
        spec_new.save((err, data) => {
          if (err) {
            res.status(500).json({
              status: 500,
              error_message: err,
            });
            return;
          } else {
            if (data) {
              res.status(200).json({
                status: 200,
              });
            } else {
              res.status(200).json({
                status: 400,
              });
            }
          }
        });
      } else {
        res.status(200).json({
          status: 200,
        });
      }
    });
  };

  get_all_spec = (req: express.Request, res: express.Response) => {
    Specializzazione.find({}, (err, data) => {
      if (err) {
        res.status(500).json({
          status: 500,
          error_message: err,
        });
        return;
      }
      if (data) {
        res.status(200).json({
          status: 200,
          data: data,
        });
      }
    });
  };

  add_ser_speserv = (req: express.Request, res: express.Response) => {
    const spec = req.body.specializzazione;
    const data = req.body.data;
    const paiload = new Servic({
      servic_name: data["service_name"],
      cost: data["servic_cost"] as number,
      time: data["service_dur"],
      description: data["service_des"],
    });
    console.log(paiload);
    paiload.save((err, data) => {
      if (err) {
        console.log(err);
        res.status(200).json({
          status: 401,
          error_message: err,
        });
      } else {
        console.log(`============${data}`);
        const id = data._id;
        Spec_servics.find({ specializzazione: spec }, (err, data2) => {
          if (err) {
            res.status(200).json({
              status: 401,
              error_message: err,
            });
          } else if (!data) {
            // ubaci novi entryy
            console.log("ubaci novi entry");
            let spec_se = new Spec_servics({
              specializzazione: spec,
              services: [id],
            });

            spec_se.save((err, data) => {
              if (err) {
                res.status(200).json({
                  status: 401,
                  error_message: err,
                });
              } else {
                console.log(`-----${data}------`);
                res.status(200).json({
                    status: 200,
                    data: data
                  });
              }
            });
          } else {
            // ubaci u array
            console.log("ubaci u arr");
            Spec_servics.updateOne(
              { specializzazione: spec },
              { $push: { services: id.toString() } },
              (err, data) => {
                if (err) {
                  res.status(200).json({
                    status: 401,
                    error_message: err,
                  });
                } else {
                  ReqNS.updateOne(
                    { specializzazione: spec },
                    {
                      $pull: {
                        requests: {
                          service_name: data["service_name"],
                          servic_cost: data["servic_cost"],
                          service_dur: data["service_dur"],
                          service_des: data["service_des"],
                        },
                      },
                    },
                    (error, result) => {
                      if (error) {
                        res.status(200).json({
                          status: 401,
                          cause: "getting all user data except manager",
                          error_message: error,
                        });
                      } else {
                        console.log(result);
                        res.status(200).json({
                          status: 200,
                          after: result,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    });

  };
}
