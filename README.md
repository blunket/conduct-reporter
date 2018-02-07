# Code of Conduct Reporter

This Code of Conduct Reporter JavaScript plugin is a simple plugin that allows interfacing with an instance of devICT's Code of Conduct Slack reporter.

## Synopsis

```javascript
var cr = new ConductReporter('http://localhost/'); // URL path to Slack reporter instance

cr.getMembers(function(members) {
	for (var i = 0; i < members.length; i++) {
		console.log(members[i].name);
	}
})

cr.sendReport({
	"report": "Something happened",
	"reporter": "Andrew S.",
	"contact": "@blunket"
}, function(success) {
	if (success) {
		// yay!
	} else {
		// do something
	}
})
```