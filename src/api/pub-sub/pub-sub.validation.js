import Validator from 'validatorjs';


export default {

	/**
	 * @param {Object} obj The Object validation will be performed on
	 * */
	create: (obj) => {
		const rules = {
		    topic: 'required',
            url: 'required'
        };
		const validator = new Validator(obj, rules);
		return {
			validator,
			validated: validator.passes()
		};
	},

    /**
	 * @param {Object} obj The Object validation will be performed on
	 * */
    publish: (obj) => {
		const rules = {
		    topic: 'required',
            data: 'required'
        };
		const validator = new Validator(obj, rules);
		return {
			validator,
			validated: validator.passes()
		};
	}
}
