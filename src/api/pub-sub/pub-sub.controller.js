import AppController from '../../core/api/app.controller';
import {HTTP_CREATED, HTTP_OK} from '../../utils/status-codes';
import AppProcessor from '../../core/api/app.processor';
import QueryPaser from '../../core/api/query.parser';
import lang from '../../lang';
import {PubSubProcessor} from './pub-sub.processor';

/**
 * @class PubSubController
 * */
export class PubSubController extends AppController {
    /**
     * @param {Object} model The model name
     * @constructor
     */
    constructor(model) {
        super(model);
        this.publish = this.publish.bind(this);
        this.responseData = this.responseData.bind(this);
    }

    /**
     * @param {Object} req The request obj
     * @param {Object} res The response obj
     * @param {callback} next The callback to handle the next program
     * @return {Object} res The res Object
     * */
    async create(req, res, next) {
        const queryParser = new QueryPaser(Object.assign({}, req.query));
        const obj = {
            topic: req.params,
            url: req.body
        };
        const validate = AppProcessor.validate(this.model, 'create', obj, lang.get('error').inputs);
        if (validate) {
            return next(validate);
        }
        try {
            const {url} = req.body;
            const {topic} = req.params;
            await PubSubProcessor.createTopAndSub(topic, url);
            const responseData = await AppProcessor.getSimpleResponse(this.model, {topic, url}, HTTP_CREATED, this.lang.create, queryParser);
            return res.status(HTTP_CREATED).json(responseData);
        } catch (e) {
            return next(e);
        }
    }

    /**
     * @param {Object} req The request obj
     * @param {Object} res The response obj
     * @param {callback} next The callback to handle the next program
     * @return {Object} res The res Object
     * */
    async publish(req, res, next) {
        const queryParser = new QueryPaser(Object.assign({}, req.query));
        const validate = AppProcessor.validate(this.model, 'publish', req.body, lang.get('error').inputs);
        if (validate) {
            return next(validate);
        }
        try {
            const {topic, data} = req.body;
            await PubSubProcessor.publishData(topic, data);
            const response = await AppProcessor.getSimpleResponse(this.model, {topic, data}, HTTP_OK, this.lang.create, queryParser);
            return res.status(HTTP_CREATED).json(response);
        } catch (e) {
            return next(e);
        }
    }

    /**
     * @param {Object} req The request obj
     * @param {Object} res The response obj
     * @param {callback} next The callback to handle the next program
     * @return {Object} res The res Object
     * */
    async responseData(req, res, next) {
        const data = JSON.parse(Buffer.from(req.body.message.data, 'base64').toString('utf-8'));
        console.log('data:', data);
        const response = await AppProcessor.getSimpleResponse(this.model, req.body, HTTP_CREATED, this.lang.create);
        return res.status(HTTP_OK).json(response);
    }


}
