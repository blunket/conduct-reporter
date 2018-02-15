# Code of Conduct Reporter

This Code of Conduct Reporter JavaScript plugin is a simple plugin that allows interfacing with an instance of devICT's Code of Conduct Slack reporter. Also included is an optional modal popup plugin, which can be bound to a link to allow users to make reports easily.

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

## Installation

No dependencies are required to use the basic features of the ConductReporter plugin. If you intend to use the included modal popup feature, however, the [basicLightbox](https://github.com/electerious/basicLightbox) plugin is required.

Basic example (CSS and JS):

```html
<link rel="stylesheet" href="conduct-reporter.css">
<script src="conduct-reporter.js"></script>
```