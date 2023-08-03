import * as express from 'express'
import User from '../models/user'
import * as path from 'path';
import * as fs from 'fs';
import multer from 'multer';

export class UserController{

	login = (req: express.Request, res: express.Response)=>{
		let username = req.body.username
		let password = req.body.password
		let type = req.body.role
		User.findOne({'username': username, 'password': password, 'type': type}, (err, user)=>{
			if(err){
				res.status(401)
				.json({
					"status": 401,
					"cause": "User with provided credentials was not found",
					"error_message": err
				})
			}
			else{
				res.status(200)
				.json({
					"status": 200,
					"casue": "User was successfully founded",
					"return_user": user
				})
			}
		})
	}



	register_patient = (req: express.Request, res: express.Response)=>{
		let username = req.body.username;
        let name = req.body.name;
        let surname = req.body.surname;
        let email = req.body.email;
        let mobile = req.body.mobile;
        let password = req.body.password;
        let street = req.body.street;
		
		User.findOne({'username':username}, (err, user)=>{
			if(user){
				res.status(400).json({
					'status':400,
					'casue': "Trying to add user that exists",
					'error_message': "User alllready exists in database"
				})
			}else{
				let user = new User({
					username:username,
					lastname:surname,
					firstname:name,
					password:password,
					address:street,
					mobile_phone:mobile,
					email:email,
					type:"Patient",
					d_data:{
						number_doctor_licenc:null,
						specializzazione:null,
						office_branch:null
					}
		
				})
		
				user.save().then(user=>{
					res.status(200).json({
						'status':200,
						'response_message': 'User was successfully added'
					})
				}).catch(err=>{
					res.status(400).json({
						'status':400,
						'casue': "Trying to add user to the database",
						'error_message': err
					})
				})
			}

		})

	}


	  

	set_profile_img = (req: express.Request, res: express.Response) => {
	

		const imageSrc = req.body.img_src;
		const extension = req.body.extension;
		let username = 'misko123'
		const targetDir = '../srassets/profile_pictures/image.png';
		const targetFileName = 'profile_image.' + extension;
		const path_to_images = path.join(__dirname,`../../src/assets/profile_pictures/${username}.${extension}`)
		//console.log(path_to_images)
		let s = fs.readFileSync(imageSrc)
		console.log(s)
		fs.writeFileSync(path_to_images, imageSrc)
		res.json({'something': imageSrc})
		
	};

	get_profile_img = (req: express.Request, res: express.Response) => {

		let usrename = req.body.username
		const path_to_images = path.join(__dirname,`../../src/assets/profile_pictures/misko123.png`)
		let image = fs.readFileSync(path_to_images,'base64');
		res.json({
			'image': JSON.stringify(image)
		})

	}

	  
}





