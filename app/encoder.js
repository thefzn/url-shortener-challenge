
/**
 * Returns an encoded version of the date (or any positive integer) using the 
 * provided key.
 * @param {number} n
 * @param {string} c
 * @param {string} k
 * @returns {array}
 */
function encode (n, c, k){
	var n = typeof n == "number" ? n : 0, // n is Number
			c = typeof c == "string" ? c : "", // c is always string
			key = typeof k == "string" ? k : "1234567890qwertyuiopasdfghjklzQWERTYUIOPASDFGHJKLZXCVBNM+_-.~", // Use k parameter as key, of not set, use the default key
			r = key.length;
	n = n < 0 ? n * -1 : n; // Number is positive
	n = Math.floor(n) // Number is integer
	while(n > 0){
		c = key.charAt(n % r) + c;
		n = Math.floor(n / r);
	}
	
	return c;
}

module.exports = {
	encode
}