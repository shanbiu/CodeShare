
import Router from 'koa-router';
import { getAllData, getData , addData, deleteData, updateData, updatePublic } from './controller/data.js';

const router = new Router();

router.get('/code/:id', getData);
router.get('/list', getAllData);
router.post('/submit', addData);
router.delete('/delete/:id', deleteData);
router.put('/update/:id', updateData);
router.put('/updatePublic/:id', updatePublic);

export default router;
