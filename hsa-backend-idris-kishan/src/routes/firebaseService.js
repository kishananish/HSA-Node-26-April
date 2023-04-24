import express from 'express';
import { firebaseNotificationToUserApp } from '../handler/FCMService';

const router = express.Router({ caseSensitive: true });

router.get('/', async (req, res) => {
	try {
		const params = {
			'registration_ids': ['dp-ajBKk4Fw:APA91bHwodkdVrXrwUCdaMxljxUQ0JgVf_P5fb3_LDC6p3D12o0Kb8eyj3iD-iGeffMutRr5VBSKd6OVS6VoqI_dpjKehNqdi-KtidtmRqAnQcRaak5FbTwTVOdvniSNZyFRTXmWdWdU', 'fKYfj-mCaK0:APA91bEkRxl5IzHTtI9uG3uqKY1mN1qDZTlVG_ZZjQETPBNIsIRH9tyjxzVg_YxBEf4VVlkdKRCpXdKrQKUNkkI1g6UDCnfiwmDcDQPL9hFy1nYbWTQxB0EaMlRcCUClQsOp1maMuina'],
			data: {
				message: 'Test message from node'
			},
			notification: {
				title: 'HSA title',
				body: 'HSA body'
			}
		};
		let result = await firebaseNotificationToUserApp(params);
		console.log(result);

		result = JSON.stringify(result);
		res.status(200).send(result.body);
	}
	catch (err) {
		res.status(500).send(err.data);
	}
});

export default router;