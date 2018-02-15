class ConductReporter {

	constructor(server, el, modalOptions) {
		var cr = this;

		// remove trailing slash if there is any
		if (server.charAt(server.length - 1) == '/') {
			this.server = server.substr(0, server.length - 1);
		} else {
			this.server = server;
		}

		if (typeof basicLightbox !== 'object' && (typeof el !== 'undefined' || typeof modalOptions !== 'undefined')) {
			console.warn("The basicLightbox JavaScript plugin is required to use the modal functionality of the ConductReporter plugin. It is not required unless the modal functionality is needed.")
		}

		var modalDefaults = {
			"labels": {
				"name": "Your name",
				"contact": "Your contact info (slack, email, etc.)",
				"message": "What happened?",
			},
			"wrapper_class": "conduct-reporter-modal",
		}
		this.options = cr.__extend(true, modalDefaults, modalOptions);

		document.querySelectorAll(el).forEach(function(el, i) {
			el.addEventListener("click", function(e) {
				e.preventDefault();
				cr.showModal();
			});
		});
	}

	// getMembers performs a GET request to the /members endpoint and
	// passes the response to the callback as an object
	getMembers(callback) {
		var cr = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				if (xhr.status == 200) {
					if (typeof callback === 'function') {
						callback(JSON.parse(xhr.responseText));
					}
				} else {
					throw new Error("ConductReport.getMembers: Server at " + cr.server + " did not respond with status code 200");
				}
			}
		}
		xhr.open('GET', cr.server + "/members", true);
		xhr.send(null);
	}

	// sendReport performs a POST to the /report endpoint and passes
	// true to the callback upon success, or false upon failure
	sendReport(data, callback) {
		var cr = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				if (xhr.status != 201 && xhr.status != 400) {
					throw new Error("ConductReport.sendReport: Server responded with unexpected status code");
				} else {
					if (typeof callback === 'function') {
						if (xhr.status == 201) {
							callback(true);
						} else if (xhr.status == 400) {
							callback(false);
						}
					}
				}
			}
		}
		xhr.open('POST', cr.server + "/report", true);
		xhr.send(JSON.stringify(data));
	}

	// showModal uses the basicLightbox plugin to create a modal popup with form
	showModal() {
		var cr = this;
		var modal = basicLightbox.create(`
			<div class='` + cr.options.wrapper_class + `' id='conduct-reporter-modal'>
			<form action="">
				<div class="conduct-reporter-question">
					<label for="name">` + cr.options.labels.name + `</label>
					<input type="text" id="conduct-reporter-name" name="name" />
				</div>
				<div class="conduct-reporter-question">
					<label for="contact">` + cr.options.labels.contact + `</label>
					<input type="text" id="conduct-reporter-contact" name="contact" />
				</div>
				<div class="conduct-reporter-question">
					<label for="message">` + cr.options.labels.message + `</label>
					<textarea id="conduct-reporter-message" name="message"></textarea>
				</div>
			</form>
			</div>
		`);
		modal.show();
	}

	// source: https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
	// mimics jQuery's $.extend
	__extend() {
		var crm = this;
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = crm.__extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	}

}