var express = require('express');
var router = express.Router();
var fs = require('fs');
var showdown  = require('showdown');
showdown.setOption('tables', true);
converter = new showdown.Converter();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {prData:global.pd});
});

router.get('/projects/:project/:page', function(req, res, next) {
	if (global.app.get('env') == 'dev')
		global.pd = JSON.parse(fs.readFileSync(global.rootdir + '/assets/project-data.json'));
	var proj = req.params.project;
	var page = req.params.page;
	var json = global.pd[proj];
	var temp = json.template;
	if (temp == 'project') {
		var md   = fs.readFileSync(global.rootdir + '/assets/projects/' + proj + '/' + page + '.md', 'utf8');
		var html = converter.makeHtml(md);
		res.render(temp, {prData:json, content:html});
	} else {
		res.render(temp);
	}
});

router.get('/cv', function(req, res, next) {
	res.render('cv');
});

module.exports = router;