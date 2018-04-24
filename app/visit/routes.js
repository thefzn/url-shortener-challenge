const router = require('express').Router();
const visits = require('./visit');

router.get('/:hash', async (req, res, next) => {
	var source;
	try {
  	source = await visits.getAll(req.params.hash);
	}catch(e){
		let err = new Error('There was an internal error. Please try again');
		err.status = 500;
		next(err);
	}

	if(source == null || !source.length){
		let err = new Error('No visits were found for this hash');
		err.status = 404;
		next(err);
	}else{
		const accepts = req.get('Accept');

		switch (accepts) {
			case 'text/plain':
				res.end(source.length);
				break;
			default:
				res.json(source);
				res.end();
				break;
		}
	}
});

module.exports = router;
