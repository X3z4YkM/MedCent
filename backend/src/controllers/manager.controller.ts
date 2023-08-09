import * as express from "express";
import User from "../models/user";
import * as fs from "fs";
import path from "path";


export class ManagerController {

    get_all_users = (req: express.Request, res: express.Response)=>{

        User.find({'type': {$ne: 'manager'},'status': true },(err, data)=>{
            if(data){
                let newdata = data.map(data=>{
                    const path_to_images = path.join(
                        __dirname,
                        `../../src/assets/profile_pictures/${data['img_src']}`
                    )
                    
                    let image = fs.readFileSync(path_to_images);
                    
                    return{
                        ...data,
                        img_profile: image
                    }
            })
        
                res.status(200)
                .json({
                    status:200,
                    cause: "getting all user data except manager",
                    data: newdata
                })
            }else{
                
                res.status(401)
                .json({
                    status: 401,
                    cause: "getting all user data except manager",
                    error_message: err
                })
            }
        }).lean()

    }

    get_all_requests = (req: express.Request, res: express.Response)=>{

        User.find({'type': {$ne: 'manager'},'status': false },(err, data)=>{
            if(data){
                let newdata = data.map(data=>{
                    const path_to_images = path.join(
                        __dirname,
                        `../../src/assets/profile_pictures/${data['img_src']}`
                    )
                    
                    let image = fs.readFileSync(path_to_images);
                    
                    return{
                        ...data,
                        img_profile: image
                    }
            })
        
                res.status(200)
                .json({
                    status:200,
                    cause: "getting all user data except manager",
                    data: newdata
                })
            }else{
                
                res.status(401)
                .json({
                    status: 401,
                    cause: "getting all user data except manager",
                    error_message: err
                })
            }
        }).lean()

    }



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

    update_user = (req: express.Request, res: express.Response)=>{
        const new_user_data = req.body.new_user_data;
        User.findOne({_id:new_user_data._id},(err, data)=>{
            
            if(data){
     
                const updateFields = {};
                Object.keys(data).forEach((key)=>{  
                    if(key !== '_id'){
                        if(key === 'd_data'){
                            let indic = false;
                            Object.keys(data[key]).forEach((key_iner)=>{                               
                                if(data[key][key_iner] !== new_user_data[key][key_iner]){
                                    if(!indic){
                                        updateFields[key] = {}
                                        updateFields[key] =  new_user_data[key]
                                        indic != indic
                                    }
                                    updateFields[key][key_iner] = new_user_data[key][key_iner]
                                    
                                }
                            });
                        }else{
                            if(data[key] !== new_user_data[key]){
                                updateFields[key] = new_user_data[key]
                                if(key === "username"){
                                    let extension = data["img_src"].split('.')[1];
                                    updateFields["img_src"] = `${new_user_data.username}.${extension}`
                                    Promise.all([this.renameFilePromise(data["img_src"], updateFields["img_src"])])
                                    console.log(updateFields["img_src"])
                                    console.log(data["img_src"])
                                }
                            }
                        }   
                    }
                });
   
                if(req.body.img !=null){
                    const imageSrc = req.body.img;
                    const extension = new_user_data.extension;
                    let user = null
                        if(imageSrc){
                        const path_to_images = path.join(
                            __dirname,
                            `../../src/assets/profile_pictures/${new_user_data.username}.${new_user_data.file_extension}`
                        );
                        console.log(path_to_images)
                        const base64Data = imageSrc.replace(/^data:image\/png;base64,/, "");
                        const imageBuffer = Buffer.from(base64Data, "base64");
                        fs.writeFileSync(path_to_images, imageBuffer);
                        updateFields["img_src"] = `${new_user_data.username}.${new_user_data.file_extension}`
                        let image = fs.readFileSync(path_to_images);
                        //new_user_data.img_path = `${new_user_data.username}.${new_user_data.file_extension}`
                        new_user_data.img_profile = image
                    }
                }


                if (Object.keys(updateFields).length === 0) {
                console.log(222)
                    res.status(200)
                    .json({
                        status: 200,
                        cause: "no data was changed",
                    })
                }else{
                  
                    

                    User.updateOne({_id: data._id}, {$set: updateFields})
                    .then(()=>{
                        res.status(200)
                        .json({
                            status: 200,
                            cause: "fileds updated",
                            return_data: new_user_data
                        })
                    }).catch((err)=>{
                        res.status(401)
                        .json({
                            status: 401,
                            cause: "failed to updated"
                        })
                    })
                }

            }else{
                // internal server error
                res.status(500)
                .json({
                    status: 500,
                    cause: "user not found",
                    error_message: err
                })
            }
        }).lean()
    
    }


}