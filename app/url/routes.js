const router = require('express').Router();
const url = require('./url');
const visit = require('../visit/visit');

// Moving to a more RESTful structure

// GET Item list (active only), send "force" query parameter to force all
router.get('/', async (req, res, next) => {
	const all = req.query.force || false;
	try{
		const source = await url.getList(all);

		if(source == null){
			let err = new Error('No URLs shortened so far');
			err.status = 404;
			next(err);
		}else{
			res.json(source.map((a) => url.getSecure(a)));
			res.end();
		}
	}catch(e){
		let err = new Error('There was an internal error. Please try again');
		err.status = 400;
		next(err);
	}
});

// GET Item detail
router.get('/:hash', async (req, res, next) => {
	try{
		const source = await url.getUrl(req.params.hash);

		if(source == null){
			let err = new Error('Sorry! The shortened code is invalid.');
			err.status = 404;
			next(err);
		}else{
			res.json(url.getSecure(source));
			res.end();
		}
	}catch(e){
		let err = new Error('There was an internal error. Please try again');
		err.status = 400;
		next(err);
	}
});

// POST New item
router.post('/', async (req, res, next) => {
	if(typeof req.body.url != "string"){
		let err = new Error('URL is a required parameter');
		err.status = 400;
		next(err);
		return;
	}
  try {
    let shortUrl = await url.shorten(req.body.url);
		if(shortUrl){
			res.json(shortUrl);
			res.end();
		}else{
			let err = new Error('There was an error while saving. Please try again.');
			err.status = 500;
			next(err);
		}
  } catch (e) {
		let err = new Error('There was an internal error. Please try again');
		err.status = 500;
		next(e);
  }
});

// UPDATE existing item
router.put('/:hash', async (req, res, next) => {
	var toUpdate = {},
			hash = req.params.hash || false,
			uActive = typeof req.body.active != "undefined" ? req.body.active : null,
			uHash = req.body.hash || null,
			source,newURL,checkHash;
	
	// Check if hash exists
  try {
		source = await url.getUrl(hash,true);
  } catch (e) {
		let err = new Error('There was an internal error. Please try again');
		err.status = 500;
		next(e);
		return;
  }
	// Error when hash is not found
	if(source == null){
		let err = new Error('Sorry! The shorten code is invalid.');
		err.status = 404;
		next(err);
		return;
	}
	
	// User can only update hash or active values. Destination URL change is not allowed because it can result in malicious usage
	
		// Parse active to boolean
		if(uActive != null){
			toUpdate.active = uActive == "1" || uActive == 1 || uActive == true || uActive == "true";
		}
		// Accept only non-existing hash
		if(uHash != null){
			try {
				checkHash = await url.getUrl(uHash);
			} catch (e) {
				let err = new Error('There was an internal error. Please try again');
				err.status = 500;
				next(e);
				return;
			}
			if(checkHash == null){
				toUpdate.hash = uHash;
				// If the hash is modified, it means is a custom hash
				toUpdate.isCustom = true;
			}else{
				let err = new Error('Sorry! The shorten code is already in use.');
				err.status = 403;
				next(err);
				return;
			}

			toUpdate.active = uActive == "1" || uActive == 1 || uActive == true || uActive == "true";
		}
	
  try {
    newURL = await url.update(hash,toUpdate);
  } catch (e) {
		let err = new Error('There was an internal error. Please try again');
		err.status = 500;
		next(e);
		return;
  }
	if(newURL){
		res.json(newURL);
		res.end();
	}else{
		let err = new Error('There was an error while updating. Please try again.');
		err.status = 500;
		next(err);
	}
});

// DELETE existing item, send "force" query parameter to hard delete
router.delete('/:hash', async (req, res, next) => {
	// ?token is required
	const token = req.query.token || false;
	const force = req.query.force || false;
	var source = null;
	
	// Check if hash exists
  try {
		source = await url.getUrl(req.params.hash, true);
  } catch (e) {
		let err = new Error('There was an internal error while validating the hash. Please try again');
		err.status = 500;
		next(e);
		return;
  }

	// Error when hash is not found
	if(source == null){
		let err = new Error('Sorry! The shorten code is invalid.');
		err.status = 404;
		next(err);
		return;
	}
	// Error when token is not sent or doesn't match
	if(!token || source.removeToken != token){
		let err = new Error('Sorry! The provided Remove Token is invalid.');
		err.status = 404;
		next(err);
		return;
	}
	try{
		const r = await url.remove(req.params.hash, force);
		res.json(url.getSecure(r));
		res.end();
	} catch(e) {
		let err = new Error('There was an internal error while deleting. Please try again');
		err.status = 500;
		next(e);
	}
});

module.exports = router;
