import {PubSub} from '@google-cloud/pubsub';
import {generateAlphNumeric} from '../../utils/helper';
import config from 'config';

/**
 * @class PubSubProcessor
 */
export class PubSubProcessor {

    /***
     * @param {Object} topic The Object validation will be performed on
     * @param {Object} payload The Object validation will be performed on
     * */
    static async publishData(topic, payload = {}) {
        const pubSubClient = new PubSub({
            projectId: config.get('google.credentials.project_id'),
            keyFilename: `${config.get('google.credentials.application_key')}`
        });
        const bufferData = Buffer.from(JSON.stringify(payload));
        return await pubSubClient.topic(topic).publish(bufferData);
    }

    /***
     * @param {String} name The topic name
     * @param {String} url The URL to notify
     * */
    static async createTopAndSub(name, url) {
        const pubSubClient = new PubSub({
            projectId: config.get('google.credentials.project_id'),
            keyFilename: `${config.get('google.credentials.application_key')}`
        });
        const [topic] = await pubSubClient.createTopic(name);
        console.log(`Topic ${topic.name} created.`);
        return await topic.createSubscription(generateAlphNumeric(15, true), {
                pushEndpoint: `${url}`
            });
    }


}
