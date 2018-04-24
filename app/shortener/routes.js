const router = require('express').Router();
const url = require('../url/url');
const visit = require('../visit/visit');

// Basic redirection service

router.get('/', async (req, res, next) => {
		res.redirect("/ui/");
		res.end();
});

router.get('/:hash', async (req, res, next) => {
	try{
		const source = await url.getUrl(req.params.hash);

		if(source == null || source.removedAt){
			res.redirect("/ui/404");
			res.end();
		}else if(!source.active){
			res.redirect("/ui/503");
			res.end();
		}else{
			const accepts = req.get('Accept');
			const secure = {
					"active": source.active,
					"createdAt": source.createdAt,
					"url": source.url,
					"hash": source.hash,
					"isCustom": source.isCustom
			};

			switch (accepts) {
				case 'text/plain':
					res.end(source.url);
					next();
					break;
				case 'application/json':
					res.json(secure);
					next();
					break;
				default:
					try{
						let r = visit.register(req.params.hash);
						res.redirect(source.url);
						res.end();
					}catch(e){
						let err = new Error('There was an internal error. Please try again');
						err.status = 500;
						next(err);
					}
					break;
			}
		}
	}catch(e){
		let err = new Error('There was an internal error. Please try again');
		err.status = 500;
		next(err);
	}
});

module.exports = router;
