import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import userRouter from './routers/user.routes';
import doctorRouter from './routers/doctor.router';
import managerRouter from './routers/manager.router';
import servicsRouter from './routers/services.router';
import patientRouter from './routers/patinet.router';

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({"type": "image/jpeg"}));
app.use(express.raw({"type": "image/png"}));



mongoose.connect('mongodb://localhost:27017/medicalcentar')

const connection = mongoose.connection
connection.once('open',()=>{
	console.log('DB connection ok')
})

const router = express.Router();
router.use('/users', userRouter);
router.use('/doctors', doctorRouter);
router.use('/manager', managerRouter);
router.use('/servics', servicsRouter)
router.use('/patients', patientRouter)

app.use('/',router);

app.listen(4000, () => console.log(`Express server running on port 4000`))
