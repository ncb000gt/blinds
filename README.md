Blinds
========

Blinds is simply a web frontend to Riak. I had tried to use others to inspect objects within the DB and they either clobbered my data or didn't work. So, instead of whining about it I wrote this little tool. It looks horrendous but it works as I expect it to. At some point I'll work on the design unless someone beats me to it.

For now, enjoy the ugly.


Installation
========

* Install [Riak](http://www.basho.com/products_riak_overview.php)
* Install [NodeJS](http://www.nodejs.org) 0.4.x
* Install [NPM](http://www.npmjs.org)
* Install [Jade](http://jade-lang.com), [Express](http://expressjs.com) and [Riak-JS](http://www.riakjs.com)
 * `sudo npm install jade express riak-js`
* Clone Blinds
 * `git clone git://github.com/ncb000gt/blinds.git`


Usage
========

In the blonds directory you just need to run the server.
`sudo node server.js`

Then, direct your browser to http://localhost:5000/


Requirements
========

* NodeJS - 0.4.2
* ExpressJS - master (there were problems with 1.0.8)
* Jade - 0.8.1


Other things being used
========

* Riak (duh)
* JQuery
* JSON-js


License
========

MIT
