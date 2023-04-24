/* eslint-disable */
import mongoose from 'mongoose';
import config from './config/config';
import User from './src/models/User';
import Role from './src/models/Role';
import readlineSync from 'readline-sync';

mongoose.Promise = global.Promise;

const mongoURL = (config.DATABASE.DB_USER && config.DATABASE.DB_PWD) ? `mongodb://${config.DATABASE.DB_USER}:${config.DATABASE.DB_PWD}@${config.DATABASE.DB_HOST}:${config.DATABASE.DB_PORT}/${config.DATABASE.DB_NAME}` : `mongodb://${config.DATABASE.DB_HOST}:${config.DATABASE.DB_PORT}/${config.DATABASE.DB_NAME}`;

//connect mongodb database
mongoose.connect(mongoURL, { useNewUrlParser: true });

const roleData = [
	{
		name: 'admin',
		active: true,
		isDeleted: false,
		access_level: [
			{
				name: 'Manage Customers',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Users',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Service Request',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Category',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Sub-Category',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Material',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage FAQ',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Promo Code',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Query / Suggestion',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Notifications',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Manage Roles',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			},
			{
				name: 'Reports',
				actions: {
					add: true,
					edit: true,
					view: true,
					delete: true,
					payment: true
				}
			}
		]
	},
	{
		name: 'service_provider',
		active: true,
		isDeleted: false,
		access_level: [
			{
				name: 'Manage Customers',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Users',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Service Request',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Category',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Sub-Category',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Material',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage FAQ',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Promo Code',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Query / Suggestion',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Notifications',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Roles',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Reports',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			}
		]
	},
	{
		name: 'user',
		active: true,
		isDeleted: false,
		access_level: [
			{
				name: 'Manage Customers',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Users',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Service Request',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Category',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Sub-Category',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Material',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage FAQ',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Promo Code',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Query / Suggestion',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Notifications',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Manage Roles',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			},
			{
				name: 'Reports',
				actions: {
					add: false,
					edit: false,
					view: false,
					delete: false,
					payment: false
				}
			}
		]
	}
];

const createUser = async () => {
	try {
		const role = ['admin', 'service_provider', 'user'];
		const foundRole = await Role.find({ name: { $in: role } });
		if (!foundRole.length) {
			await Role.insertMany(roleData);
		}
		const adminRole = await Role.findOne({ name: 'admin' });
		const email = readlineSync.questionEMail('Enter email: ');
		const foundUser = await User.findOne({ email: email });
		if (foundUser) {
			console.log('Admin User exist!');
			process.exit(0);
		}
		const first_name = readlineSync.question('Enter first name: ');
		const last_name = readlineSync.question('Enter last name: ');
		const password = readlineSync.questionNewPassword('password: ', { min: 8, max: 20 });

		const user = {
			first_name,
			last_name,
			email: email,
			password: password,
			role: adminRole._id,
			active: true
		}
		await User.create(user);
		console.log('Admin User Created!')
		process.exit(0);
	}
	catch (err) {
		console.log(err);
		process.exit(1);
	}
}

createUser();