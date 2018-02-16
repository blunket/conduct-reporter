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

### Basic functionality

```html
<script src="conduct-reporter.js"></script>
```

At this point you have all you need to use the basic features of the plugin. You can use both the `getMembers` and `sendReport` methods.

### Modal included

Include CSS and JS for [basicLightbox](https://github.com/electerious/basicLightbox). Also include conduct-reporter JS/CSS files. (hint: you can leave out the conduct-reporter CSS if you want to define your own styles for the modal)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/basiclightbox@4.0.0/dist/basicLightbox.min.css">
<link rel="stylesheet" href="conduct-reporter.css">

<script src="https://cdn.jsdelivr.net/npm/basiclightbox@4.0.0/dist/basicLightbox.min.js"></script>
<script src="conduct-reporter.js"></script>
```

You are now ready to use all the features of the plugin!

## Usage

### Constructor

The constructor function accepts 1 to 3 parameters.

```javascript
new ConductReporter(server)
new ConductReporter(server [, selector [, options]])
```

**Parameters**

`server`

URL path to an instance of devICT's Code of Conduct Slack reporter.

`selector`

Element query selector. If using the modal plugin, the matching elements will trigger the modal when clicked.

`options`

Options object for the modal plugin. Any defaults may be overridden. It is structured as follows:

```json
{
	"labels": {
		"name": "Your name",
		"contact": "Your contact info (slack, email, etc.)",
		"message": "What happened?",
		"submit": "Send Report"
	},
	"wrapper_class": "conduct-reporter-modal",
}
```

### Methods

The ConductReporter object has two *basic* methods.

`ConductReporter.getMembers()`

`ConductReporter.sendReport()`
