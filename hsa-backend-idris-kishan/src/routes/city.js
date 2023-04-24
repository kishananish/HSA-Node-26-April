'use strict';

import express from 'express';
import * as cityCtrl from '../controller/cityCtrl';
import { catchErrors } from '../handler/errorHandler';

const router = express.Router({ caseSensitive: true });

router.get('/', catchErrors(cityCtrl.ListOfCities));

export default router;