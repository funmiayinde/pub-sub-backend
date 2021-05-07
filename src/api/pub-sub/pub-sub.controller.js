import AppController from '../../core/api/app.controller';
import {
    HTTP_CONFLICT,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK
} from '../../utils/status-codes';
import AppProcessor from '../../core/api/app.processor';
import QueryPaser from '../../core/api/query.parser';
import lang from '../../lang';
import {PubSubProcessor} from './pub-sub.processor';
import axios from 'axios';
import AppError from '../../core/api/app.error';

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
            const existingSubscriber = await this.model.findOne({topic, subscribers: {$in: url}});
            if (existingSubscriber){
                return next(new AppError('You already subscribed to this topic', HTTP_CONFLICT));
            }
            let object = await this.model.findOne({topic});
            if (object) {
                object.subscribers.push(url);
                await object.save();
            } else {
                const subscribers = [];
                subscribers.push(url);
                object = await this.model({topic, subscribers});
                await object.save();
            }
            const response = await AppProcessor.getSimpleResponse(this.model, {topic, url}, HTTP_CREATED, this.lang.create, queryParser);
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
    async publish(req, res, next) {
        const queryParser = new QueryPaser(Object.assign({}, req.query));
        const obj = {
            topic: req.params,
            data: req.body
        };
        const validate = AppProcessor.validate(this.model, 'publish', obj, lang.get('error').inputs);
        if (validate) {
            return next(validate);
        }
        try {
            const {topic} = req.params;
            const {data} = req.body;
            let object = await this.model.findOne({topic});
            if (object) {
                for (let url of object.subscribers) {
                    await axios.post(url, data)
                        .then((resp) => {
                            console.log('resp:', resp);
                        })
                        .catch(err => {
                            console.log('err:', err);
                            return next(new AppError(`Unable to send notification to ${url}`, HTTP_INTERNAL_SERVER_ERROR));
                        });
                }
                const response = await AppProcessor.getSimpleResponse(this.model, {topic, data}, HTTP_OK, 'Notification successfully published', queryParser);
                return res.status(HTTP_OK).json(response);
            }
            return next(new AppError(`This topic ${topic} does not exist`, HTTP_NOT_FOUND));
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
        const response = await AppProcessor.getSimpleResponse(this.model, req.body, HTTP_OK, this.lang.create);
        return res.status(HTTP_OK).json(response);
    }


}
