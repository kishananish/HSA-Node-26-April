'use strict';

import express from 'express';
import * as savedCardCtrl from '../controller/savedCardCtrl';
import { catchErrors } from '../handler/errorHandler';
import * as auth from '../middlewares/auth';

const router = express.Router({ caseSensitive: true });

router.post('/add', auth.ensureAuth, catchErrors(savedCardCtrl.addCard));
router.put('/update/:id', auth.ensureAuth, catchErrors(savedCardCtrl.updateCard));
router.delete('/remove/:id', auth.ensureAuth, catchErrors(savedCardCtrl.deleteCard));
router.get('/', auth.ensureAuth, catchErrors(savedCardCtrl.fetchCards));





export default router;