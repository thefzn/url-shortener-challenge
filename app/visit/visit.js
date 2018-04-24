const VisitModel = require('./schema');
const url = require('../url/url');

/**
 * Lookup for registered visits by hash.
 * 'null' will be returned when no matches were found.
 * @param {string} hash
 * @returns {array}
 */
async function getAll(hash) {
  let source = await VisitModel.find({ hash });
  return source;
}
/**
 * Registers a visit on a hash
 * @param {string} hash
 * @returns {object}
 */
async function register(hash) {
	let source = await url.getUrl( hash );
	if(source){
		// Create a new model instance
		const newVisit = new VisitModel({
			hash: hash,
			date: Date.now(),
		});
		const saved = await newVisit.save();
		return saved != null;
	}
	return false;
}

module.exports = {
  getAll,
  register
}
