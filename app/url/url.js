const encoder = require('../encoder');
const { domain } = require('../../environment');
const SERVER = `${domain.protocol}://${domain.host}`;

const UrlModel = require('./schema');
const parseUrl = require('url').parse;
const validUrl = require('valid-url');

/**
 * Lookup for existant, active shortened URLs by hash.
 * 'null' will be returned when no matches were found.
 * @param {string} hash
 * @returns {object}
 */
async function getUrl(hash, force = false) {
	const params = force ? { hash } : { active: true, hash, removedAt: null };
  let source = await UrlModel.findOne( params );
  return source;
}

/**
 * Generate an unique hash-ish- for an URL.
 * @param {string} id
 * @returns {string} hash
 */
function generateHash(date) {
  return encoder.encode(date);
}

/**
 * Generate a random token that will allow URLs to be (logical) removed
 * @returns {string} uuid v4
 */
function generateRemoveToken(date) {
	const k = "zxcvbnmasdfghjklqwertyuiopPOIUYTREWQLKJHGFDSAMNBVCXZ1234567890";
  return encoder.encode(date, "", k);
}

/**
 * Create an instance of a shortened URL in the DB.
 * Parse the URL destructuring into base components (Protocol, Host, Path).
 * An Error will be thrown if the URL is not valid or saving fails.
 * @param {string} url
 * @param {string} hash
 * @returns {object}
 */
async function shorten(url) {

  if (!isValid(url)) {
    throw new Error('Invalid URL');
  }

  // Get URL components for metrics sake
	
	let date = new Date().getTime();
	let hash = generateHash(date);
	let exists = await getUrl(hash);
	if(exists != null){
		return shorten(url); // we already await so this should return a different hash
	}
  const urlComponents = parseUrl(url);
  const protocol = urlComponents.protocol || '';
  const domain = `${urlComponents.host || ''}${urlComponents.auth || ''}`;
  const path = `${urlComponents.path || ''}${urlComponents.hash || ''}`;
	const createdAt = Date.now();

  // Generate a token that will alow an URL to be removed (logical)
  const removeToken = generateRemoveToken(date);

  // Create a new model instance
  const shortUrl = new UrlModel({
    url,
    protocol,
    domain,
    path,
    hash,
    isCustom: false,
    removeToken,
    active: true
  });

  const saved = await shortUrl.save();
	
  return {
    url,
    shorten: `${SERVER}/${hash}`,
    hash,
    removeUrl: `${SERVER}/api/url/${hash}?token=${removeToken}`,
		active: true,
		createdAt 
  };

}

/**
 * Soft or hard delete an existing url/hash.
 * @param {string} hash
 * @param {boolean} force
 * @returns {object}
 */
async function remove(hash, force = false) {
	var res = null;
	if(force){
		res = await UrlModel.remove({ hash });
	}else{
		res = await UrlModel.findOneAndUpdate({ hash }, { $set: { removedAt: Date.now() }} );
	}
	return res;
}

/**
 * Update ah existing hash.
 * @param {string} hash
 * @param {object} updates
 * @returns {object}
 */
async function update(hash, updates) {
	updates = typeof updates == "object" ? updates : {};
	let res = await UrlModel.findOneAndUpdate({ hash }, { $set: updates } );
	return res;
}

/**
 * List active URLs, just for testing.
 * @param {string} hash
 * @returns {object}
 */
async function getList(all = false) {
	const params = all ? {} : { removedAt: null };
  let source = await UrlModel.find(params);
  return source;
}

/**
 * Validate URI
 * @param {any} url
 * @returns {boolean}
 */
function isValid(url) {
  return validUrl.isUri(url);
}

/**
 * Generate a safe version of UrlModel
 * @param {UrlModel} url
 * @returns {UrlModel}
 */
function getSecure(url){
		const shorten = url.shorten || `${SERVER}/${url.hash}`;
		const removeUrl =  url.removeUrl || `${SERVER}/api/url/${url.hash}?token=${url.removeToken}`;
		return secure = {
			"active": url.active,
			"createdAt": url.createdAt,
			"url": url.url,
			"hash": url.hash,
			"isCustom": url.isCustom,
			"removeToken": url.removeToken,
			"removedAt": url.removedAt,
			shorten,
			removeUrl
		};
}

module.exports = {
  shorten,
	remove,
	update,
	getList,
  getUrl,
	getSecure
}
