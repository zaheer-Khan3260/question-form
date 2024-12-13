import express from 'express';
import {
createForm,
updateForm,
deleteForm,
getFormByAccessKey
} from '../controllers/form.controller.js';

const router = express.Router();

router.post('/', createForm);

router.patch('/:formId', updateForm);

router.delete('/:formId', deleteForm);
router.get('/:accessKey', getFormByAccessKey);

export default router;
