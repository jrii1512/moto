import { Router } from '../deps.js';
import * as item from './controllers/itemController.js';

const router = new Router();

router.get('/features', item.showFeatures);
router.get('/', item.showLogin);
router.post('/login', item.loginCheck)
router.get('/haeHuolot', item.haeHuolot);
router.get('/haeHankinnat', item.haeOstokset);
router.get('/haeMPSumma', item.haeMPYhteenveto);
router.get('/haeYhteenveto', item.haeYhteenveto);
router.post('/huolot', item.lisaaHuolto);
router.post('/hankinnat', item.lisaaHankinta);

export default router.routes();
