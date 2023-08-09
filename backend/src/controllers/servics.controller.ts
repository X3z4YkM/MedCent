import * as express from "express";
import User from "../models/user";
import { UserController } from "./user.controller";
import * as fs from "fs";
import path from "path";
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
import Servic from '../models/services'
import Spec_servics from '../models/specializzazione_servics'
import DocSpec_servics from '../models/doctor_selected_specializzazione'


export class ServicsController {

    specializzazione_based_services  = (req: express.Request, res: express.Response) => {

        const token = req.body.token;
        jwt.verify(req.body.token, secret, (err, decoded) => {
            if(decoded){
                const specializzazione =  decoded["_doc"].d_data["specializzazione"];
                const id = decoded["_doc"]._id;
                Spec_servics.findOne({specializzazione:specializzazione}, (err, data)=>{
                    if(data){
                        DocSpec_servics.findOne({docotrId: id},(err, data_2)=>{
                            if(data_2){
                                res.status(200)
                                .json({
                                    status: 200,
                                    services: data["services"],
                                    selected: data_2["services"]
                                })
                            }else{
                                res.status(200)
                                .json({
                                    status: 200,
                                    services: data["services"],
                                    selected: null
                                })
                            }

                        })
                       
                    }else{
                        console.log("---dsadasdna----")
                        res.status(401).json({
                            status: 401,
                            error_message: err
                        });  
                    }
                })

            }else{
                res.status(401).json({
                    status: 401,
                    error_message: err
                });
            }
          });

    }


    upate_doctor = (req: express.Request, res: express.Response)=>{
        const token = req.body.token
        const data = req.body.data
        console.log(data)
        console.log(token)
       jwt.verify(req.body.token, secret, (err, decoded) => {

            if(decoded){
                const id = decoded['_doc']._id
                console.log(id)
                data.forEach(element => {
                        if(element.changed == true){
                            if(element.selected == false){
                               DocSpec_servics .updateOne(
                                { "docotrId": `${id}` },
                                { $pull: { "services": { "servic_name": `${element.servic_name}` } } }
                             ).catch((err)=>{
                                console.log(err)
                                res.status(401)
                                .json({
                                    status: 401,
                                    error_message: err
                                    
                                })
                             })
                            }else{
                                try{
                                    DocSpec_servics.updateOne(
                                        { "docotrId": `${id}`  },
                                        { $push: { "services": { "servic_name": `${element.servic_name}`, "description": "New service description" } } }
                                    ).catch((err)=>{
                                        console.log(err)
                                        res.status(401)
                                        .json({
                                            status: 401,
                                            error_message: err
                                        })
                                    })
                                }catch (error) {
                                    console.error("Error:", error);
                                    res.status(500).json({
                                        status: 500,
                                        message: "Error"
                                    });
                                }                 
                            }
                        }
                });

            
                data.forEach(element => { 
                    if(element.changed == true){
                        if(element.selected == false){
                            element.changed = false;
                            element.selected = false;
                        }else{
                             element.changed = false;
                            element.selected = true;
                        }                       
                    }
                })

                res.status(200)
                .json({
                    status: 200,
                    message: "updated",
                    data: data
                })

            }
       })
    }

}