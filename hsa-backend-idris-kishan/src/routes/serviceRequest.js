'use strict';

import express from 'express';
import multer from 'multer';
import path from 'path';
import * as serviceRequestCtrl from '../controller/serviceRequestCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const imgDir = path.normalize(__dirname + '../../../public/images');

const Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, imgDir);
	},
	filename: function (req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
	}
});

const uploader = multer({ storage: Storage }).fields([{ name: 'request-images', maxCount: 5 }, { name: 'request-video', maxCount: 1 }]);

const router = express.Router({ caseSensitive: true });

router.get('/', auth.ensureAuth, catchErrors(serviceRequestCtrl.index));
router.post('/', auth.ensureAuth, uploader, catchErrors(serviceRequestCtrl.add));
router.patch('/:id', auth.ensureAuth, catchErrors(serviceRequestCtrl.update));
router.delete('/:id', auth.ensureAuth, catchErrors(serviceRequestCtrl.remove));

export default router;
