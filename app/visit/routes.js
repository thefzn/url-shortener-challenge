const router = require('express').Router();
const visits = require('./visit');

router.get('/:hash', async (req, res, next) => {

  const source = await visits.getAll(req.params.hash);

	if(source == null){
		res.status(404);
		next();
	}else{
		const accepts = req.get('Accept');

		switch (accepts) {
			case 'text/plain':
				res.end(source.length);
				break;
			default:
				res.json(source);
				break;
		}
	}
});

module.exports = router;
