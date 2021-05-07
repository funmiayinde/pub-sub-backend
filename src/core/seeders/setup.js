import AppLogger from '../api/app.logger';

/**
 * @class Seeder
 **/

export default class SetUpSeeders {
	/**
	 * @param {Object} options object
	 * @constructor
	 * */
	constructor(options = {count: 5}) {
		process.env.NODE_ENV = 'seeding';
		AppLogger.logger('info').info('Begin Setup Seed');
		this.options = options;
		this.seedUser = this.seedUser.bind(this);
	}


	async seed() {
		try {
		    //
		} catch (e) {
			AppLogger.logger('error').error(e);
		}
	}
}
