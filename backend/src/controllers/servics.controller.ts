import * as express from "express";
const jwt = require("jsonwebtoken");
const secret = "12g47JNBAbBVHJDA423ascH7bjqb6574gyiu67rKNjn9B";
import Spec_servics from "../models/specializzazione_servics"
import DocSpec_servics from "../models/doctor_selected_specializzazione"
import Offline from "../models/offline_date";
import ReqNS from "../models/services.request_new_servic"
import Report from  "../models/report"
import Calender from "../models/doctor.calender"
import { constants } from "buffer";

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
       jwt.verify(req.body.token, secret, (err, decoded) => {

            if(decoded){
                const id = decoded['_doc']._id
              
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


    add_workoff = (req: express.Request, res: express.Response)=>{
        const token = req.body.token;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;

       jwt.verify(req.body.token, secret, (err, decoded) => {

            if(decoded){
                const id = decoded['_doc']._id
                Offline.findOne({"doctor_id": id},(err, data)=>{
                    console.log(data)
                    if(data){
                        //update
                            let arr_dates = data['offline_dates'];
                            let newStartDate = new Date(start_date);
                            let newEndDate = new Date(end_date);
             
                            const isOverlap = arr_dates.some(existingDate =>{
                                const existingStartDate = new Date(existingDate.start_date);
                                const existingEndDate = new Date(existingDate.end_date);
                                const startOverlap = newStartDate <= existingEndDate && newStartDate >= existingStartDate;
                                const endOverlap = newEndDate >= existingStartDate && newEndDate <= existingEndDate;
                                const encompassOverlap = newStartDate <= existingStartDate && newEndDate >= existingEndDate;
                              
                                return startOverlap || endOverlap || encompassOverlap;
                            });
                          
                            if (!isOverlap) {

                                Offline.updateOne({"doctor_id": id},
                                {$push: {
                                    "offline_dates": {
                                    "start_date": new Date(start_date),
                                    "end_date": new Date(end_date)
                                    }
                                }}).then(()=>{
                                    res.status(200).json({
                                        status: 200,
                                        response_message: "Offline was successfully update",
                                    });
                                }).catch((err)=>{
                                    res.status(400).json({
                                        status: 400,
                                        casue: "Trying to update offline",
                                        error_message: err,
                                    });
                                })
                            }else{
                         
                                res.status(200).json({
                                    status: 400,
                                    casue: "Error while comparing dates for overlaping",
                                    error_message: err,
                                  });
                            }
                    }else
                        if(err){
                            // error foudn
                            res.status(400).json({
                                status: 400,
                                casue: "Error while findOne doctor",
                                error_message: err,
                              });
                        }else{
                            // create a new entry for doctor
                            console.log(new Date(start_date))
                            let offline = new Offline({
                                "doctor_id": id,
                                "offline_dates": [
                                  {
                                    "start_date": new Date(start_date),
                                    "end_date": new Date(end_date)
                                  }
                                ]
                            });
                            console.log(offline)
                            offline.save((err, data) => {
                                if (data) {
                                    res.status(200).json({
                                      status: 200,
                                      response_message: "Offline was successfully added",
                                    });
                                  } else {
                                    res.status(400).json({
                                      status: 400,
                                      casue: "Trying to add offline",
                                      error_message: err,
                                    });
                                  }
                            })
                        }
                })
            }
        });
    }

    add_req_spec = (req: express.Request, res: express.Response)=>{

        const request = req.body.request
        const specializzazione = req.body.specializzazione
        ReqNS.findOne({"specializzazione": specializzazione}, (err, data)=>{
            if(data){
                console.log(request)
                ReqNS.findOne({
                    "specializzazione": specializzazione,
                    "requests": request
                },(err, datainer)=>{
                    
                    if(datainer){
                        res.status(200)
                        .json({
                            status: 200,
                            message: "addedd a new request "
                        })
                    }else{
                        ReqNS.updateOne(
                            { "specializzazione": specializzazione },
                            { $push: { "requests": request} }
                          ).then(()=>{
                            res.status(200)
                            .json({
                                status: 200,
                                message: "addedd a new request "
                            })
                          }).catch((err)=>{
                            res.status(500)
                            .json({
                                status: 500,
                                message: "error while saving new req and new spec",
                                error_message: err
                            })
                          })
        
                    }
                });
            }else{
                const request_new = new ReqNS({
                    "specializzazione": specializzazione,
                    "requests": [request]
                })
                request_new.save()
                .then(()=>{
                    res.status(200)
                        .json({
                            status: 200,
                            message: "addedd a new request "
                        })
                }).catch((err)=>{
                    res.status(500)
                    .json({
                        status: 500,
                        message: "error while saving new req and new spec",
                        error_message: err
                    })
                })
            }
        })
    }


    get_req_spec = (req: express.Request, res: express.Response)=>{
        ReqNS.find({},  (err,data)=>{
            res.status(200)
            .json({
                status: 200,
                data: data
            })
        })
    }


    generate_report = (req: express.Request, res: express.Response)=>{
        const data = req.body.data
        const report = new Report({
            date_of_report: data["date_of_report"],
            doctors_name: data["doctors_name"],
            specializzazione: data["specializzazione"],
            reason_for_comming: data["reason_for_comming"],
            diagnosis: data["diagnosis"],
            therapy: data["therapy"],
            next_session: data["next_session"],
            patient_id: data["patient_id"],
            date_of_schedule: data["date_of_schedule"]
        })
        console.log(data);
        console.log(report)
        report.save((err, datas) =>{
            if(datas){
                console.log("sa")
                // update doctors calander
                Calender.findOneAndUpdate(
                {
                    doctor_id: data['doctor_id'],
                    'reservations.patient_id': data['patient_id'],
                    'reservations.date_start': new Date(data['date_of_schedule']),
                },
                {
                $set: { 'reservations.$.doctorts_note': true }
                }, (err, dataf)=>{
                    console.log(dataf)
                    if(err){
                        res.status(200)
                        .json({
                            status: 401,
                            error_message: err
                        })
                    }else
                        if(dataf){
                            res.status(200)
                            .json({
                                status: 200
                            })
                        }

                })
            }else{
                console.log("nsa")
                res.status(200)
                .json({
                    status: 401,
                    error_message: err
                })
            }
        })

    }

    cancle_appoinment_docotr = (req: express.Request, res: express.Response)=>{
        const data = req.body.data
        console.log(data)
        const query = {
            doctor_id: data['doctor_id'],
            'reservations.patient_id': data['patient_id'],
            'reservations.date_start': new Date(data['date_of_start']),
            'reservations.date_end': new Date(data['date_of_end'])
          };
          
          // Remove the element from the array and retrieve the removed element
          Calender.findOneAndUpdate(
            query,
            {
              $pull: {
                reservations: {
                  patient_id: data['patient_id'],
                  date_start: new Date(data['date_of_start']),
                  date_end: new Date(data['date_of_end'])
                }
              }
            },
            { new: true }, // This option returns the updated document
            (err, removedData) => {
              if (err) {
                console.log(err)
                res.status(401).json({
                  status: 401,
                  error_message: err
                });
              } else {
                if (!removedData) {
                    console.log(removedData)
                  res.status(404).json({
                    status: 404,
                    error_message: "Document not found"
                  });
                } else {
                  // Update the removed element and re-insert it back into the array
                  console.log("some shit")
                  const removedReservation = removedData.reservations[0];
                  removedReservation.cancled = true;
                  removedReservation.cancled_note = data['text'];
          
                  Calender.updateOne(
                    { doctor_id: data['doctor_id'] },
                    {
                      $push: {
                        reservations: removedReservation
                      }
                    },
                    (err, data) => {
                        console.log(data)
                      if (err) {
                        res.status(401).json({
                          status: 401,
                          error_message: err
                        });
                      } else {
                        res.status(200).json({
                          status: 200
                        });
                      }
                    }
                  );
                }
              }
            }
          );
    }

    get_all_reports_for_user = (req: express.Request, res: express.Response)=>{
        const user_id = req.body.id;
        Report.find({patient_id: user_id},(err, data)=>{
            if(data){
                res.status(200).
                json({
                    status: 200,
                    data: data
                })
            }else{
                res.status(200).
                json({
                    status: 400,
                })
            }
        })

    }


}