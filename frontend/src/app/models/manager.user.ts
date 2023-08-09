export class UserManagerData{
    _id: Object;
	firstname: string;
	lastname: string;
	username: string;
	password: string;
	address: string;
	mobile_phone:  string;
	email:  string;
	type: string;
	d_data: string;
	img_src: string;
	status: string;
    img_profile: Buffer;
    img_path : string;
    edit: boolean;
	file:string;
	file_oup: File;
	file_extension :string = '';
	img_edit_status: boolean;
}
