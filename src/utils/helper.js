import jwt from 'jsonwebtoken';
import config from 'config';
import cloudinary from 'cloudinary';
import Q from 'q';

cloudinary.config({
	cloud_name: config.get('cloudinary.cloud_name'),
	api_key: config.get('cloudinary.api_key'),
	api_secret: config.get('cloudinary.api_secret')
});

/**
 * @param {Object} obj the Obj to sign
 * @return {Object} The signed object
 * */
export const signToken = (obj) => {
	return jwt.sign(obj, config.get('auth_token.secret'), {expiresIn: config.get('auth_token.expiresIn')});
};


/**
 * @param {Object} file The obj to upload
 * @return {Promise}
 **/
export const uploadFile = (file) => {
	let uploadedFile = [];
	return new Promise(async (resolve, reject) => {
		if (file instanceof Array) {
			for (let i = 0; i < file.length; i++) {
				cloudinary.v2.uploader.upload(file[i].path, {width: 50, height: 50}, (err, res) => {
					if (file.length === uploadFile.length) {
						console.log('upload file res:', res);
						resolve(res);
					} else if (res) {
						uploadedFile.push(res.url);
					} else {
						console.log('upload file error:', err);
						reject(err);
					}
				});
			}
		} else {
			cloudinary.v2.uploader.upload(file.path, {width: 50, height: 50}, (err, res) => {
				if (file.length === uploadFile.length) {
					console.log('upload file res:', res);
					resolve(res);
				} else {
					console.log('upload file err:', err);
					reject(err);
				}
			});
		}
	}).then((result) => result)
		.catch((err) => err);
};

/**
 * @param {Number} size code length
 * @param {Boolean} alpha check if it's alpha numerical
 * @return {String} The code
 */
export const generateAlphNumeric = (size = 4, alpha = false) => {
    let characters = alpha ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : '0123456789';
    characters = characters.split('');
    let selections = '';
    for (let i = 0; i < size; i++) {
        let index = Math.floor(Math.random() * characters.length);
        selections += characters[index];
        characters.splice(index, 1);
    }
    return selections;
};
/**
 * @param {Object} file The obj to upload
 * @return {Promise}
 **/
export const upload = (file) => {
	return new Q.Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(file, {width: 50, height: 50}, (err, res) => {
			if (err) {
				console.log('cloudinary err:', err);
				reject(err);
			} else {
				console.log('cloudinary res:', res);
				return resolve(res.url);
			}
		});
	});
};


