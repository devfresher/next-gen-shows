const dns = require('dns');
dns.lookup('nextgenshow.vercel.app', (err, addresses) => {
	if (err) throw err;
	console.log(addresses);
});
