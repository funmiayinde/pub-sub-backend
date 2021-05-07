require('dotenv').config();
const PORT = process.env.PORT || 3000;

module.exports = {
	app: {
		name: "pubsub-api",
		port: PORT,
		baseUrl: `http://localhost:${PORT}`,
		clientBaseUrl: process.env.BASE_URL || '',
		upload: `upload`,
		log: "app.log"
	},
	api: {
		prefix: '/api/v1',
		resourceRegex: "^/resources/[a-zA-Z-]+",
		versions: 1,
	},
	lang: 'en',
	auth_token: {
		secret: process.env.JWT_SECRET ||'test-secret-3440',
		expiresIn: 86400,
	},
	db: {
		url: process.env.DB_URL || 'mongodb://localhost:27017/pub_sub_db'
	},
	cloudinary: {
		cloud_name: process.env.CLOUDIARY_NAME || '',
		api_key: process.env.CLOUDIARY_API || '',
		api_secret: process.env.CLOUDIARY_SECRET || ''
	},
	items_per_page: {
		default: 10
	},
    google: {
	    credentials: {
            project_id: process.env.GCP_PROJ_ID || '',
            application_key: process.env.GOOGLE_APPLICATION_DEFAULT || '',
        }
    }
};
