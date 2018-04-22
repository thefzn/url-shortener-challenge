const router = require('express').Router();
const url = require('./url');
const visit = require('../visit/visit');

router.get('/:hash', async (req, res, next) => {

  const source = await url.getUrl(req.params.hash);

  // TODO: Respond accordingly when the hash wasn't found (404 maybe?)
	if(source == null){
		res.status(404);
		next();
	}else{
		// Behave based on the requested format using the 'Accept' header.
		// If header is not provided or is */* redirect instead.
		const accepts = req.get('Accept');

		switch (accepts) {
			case 'text/plain':
				res.end(source.url);
				next();
				break;
			case 'application/json':
				let {user, removeToken, ...secure} = source;
				res.json(secure);
				next();
				break;
			default:
				visit.register(req.params.hash);
				res.redirect(source.url);
				res.end();
				break;
		}
	}
});


router.post('/', async (req, res, next) => {

  // TODO: Validate 'req.body.url' presence

  try {
    let shortUrl = await url.shorten(req.body.url);
		if(shortUrl){
			res.json(shortUrl);
			res.end();
		}else{
			next({message:"Error while saving"});
		}
  } catch (e) {
    // TODO: Personalized Error Messages
    next(e);
  }
});


router.delete('/:hash/:removeToken', async (req, res, next) => {
  // TODO: Remove shortened URL if the remove token and the hash match
  let notImplemented = new Error('Not Implemented');
  notImplemented.status = 501;
  next(notImplemented);
});

module.exports = router;
