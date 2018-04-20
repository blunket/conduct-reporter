
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

`.getMembers()`

The `.getMembers()` method performs a GET request to the /members endpoint and passes the response as an argument to a callback function as an array of objects. These are the active members in the channel to which the report will be made. Each object contains a `name`, a `username`, and an `avatar` property (user data from Slack).

Example usage:

```javascript
cr.getMembers(function(members) {
	var membersHtml = '';

	for (var i = 0; i < members.length; i++) {
		let member = members[i];
		membersHtml += `
			<li class="cr-member">
				<img class="cr-member-avatar" src="` + member.avatar + `" alt="` + member.name + `">
				<span class="cr-member-username">@` + member.username + `</span>
			</li>
		`;
	}

	document.getElementById("#memberList").innerHTML = membersHtml;
})
```

`.sendReport()`

The `.sendReport()` method performs a POST request to the /report endpoint. It requires at least the first of two arguments: `data`, `callback`.

The `data` argument should be an object with three properties:

* `report` - The message of what happened. This is required.
* `reporter` - Optional name of the person filing the report.
* `contact` - Optional contact details.

It passes two arguments to a callback function:

* `success` (bool) - Whether the report was successfully sent.
* `status` (int) - The HTTP status returned by the API.

Example usage:

```javascript
cr.sendReport({
	report: "Something happened",
	reporter: "Andrew"
	contact: "@blunket (on slack)"
}, function(success, status) {
	if (success) {
		// yay!
	} else {
		console.log(status);
	}
})
```
