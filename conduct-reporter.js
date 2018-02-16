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
				"modal_title": "Report an Incident",
				"name": "Your name",
				"contact": "Your contact info (slack, email, etc.)",
				"message": "What happened?",
				"submit": "Send Report",
				"members_description": "Your report will be sent to the following people.",
			},
			"wrapper_class": "cr-modal",
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
		cr.getMembers(function(members) {
			var membersHtml = '';
			for (var i = 0; i < members.length; i++) {
				let member = members[i]
				membersHtml += `
					<div class="cr-member">
						<img class="cr-member-avatar" src="` + member.avatar + `" alt="` + member.name + `">
						<span class="cr-member-name">` + member.name + `</span>
						<span class="cr-member-username">(@` + member.username + `)</span>
					</div>
				`;
			}

			var modal = basicLightbox.create(`
				<div class='` + cr.options.wrapper_class + `' id='cr-modal'>
				<h1 class="cr-modal-title">` + cr.options.labels.modal_title + `</h1>
				<div class="cr-member-list">
					<p class="cr-members-description">` + cr.options.labels.members_description + `</p>
					<div class="cr-members">` + membersHtml + `</div>
				</div>
				<form action="">
					<div class="cr-question">
						<label for="cr-name">` + cr.options.labels.name + `</label>
						<input type="text" id="cr-name" name="name" />
					</div>
					<div class="cr-question">
						<label for="cr-contact">` + cr.options.labels.contact + `</label>
						<input type="text" id="cr-contact" name="contact" />
					</div>
					<div class="cr-question">
						<label for="cr-message">` + cr.options.labels.message + `</label>
						<textarea id="cr-message" name="message"></textarea>
					</div>
					<div class="cr-submit">
						<input type="submit" value="` + cr.options.labels.submit + `">
					</div>
				</form>
				</div>
			`, {
				afterShow: function() {
					document.getElementById("cr-name").focus();
				}
			});
			modal.show();
		});
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