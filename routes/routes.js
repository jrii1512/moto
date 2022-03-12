import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();

router.get('/', item.showMain);
router.get('/haeHuolot', item.haeHuolot);
router.get('/haeHankinnat', item.haeOstokset);
router.get('/haeMPSumma', item.haeMPYhteenveto);
router.get('/haeYhteenveto', item.haeYhteenveto);
router.post('/huolot', item.lisaaHuolto);
router.post('/hankinnat', item.lisaaHankinta);

export default router.routes();
