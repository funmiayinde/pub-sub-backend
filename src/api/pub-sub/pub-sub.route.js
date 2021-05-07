import {Router} from 'express';
import {Subscribe} from './pub-sub.model';
import {PubSubController} from './pub-sub.controller';


const router = Router();
const subscribeCtrl = new PubSubController(Subscribe);

router.post('/publish', subscribeCtrl.publish);
router.post('/subscribe/:topic', subscribeCtrl.create);
router.post('/response-data', subscribeCtrl.responseData);

router.route('/subscribe').get(subscribeCtrl.find);


export default router;
