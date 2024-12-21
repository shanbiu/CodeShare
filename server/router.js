
import Router from 'koa-router';
import { getAllData, getData , addData, deleteData, updateData, updatePublic } from './controller/data.js';
import { downloadCodeShare } from './controller/download.js';

const router = new Router();

router.get('/code/:id', getData);
router.get('/list', getAllData);
router.post('/submit', addData);
router.delete('/delete/:id', deleteData);
router.put('/update/:id', updateData);
router.patch('/updatePublic/:id', updatePublic);
router.get('/download/:id', downloadCodeShare);
export default router;
