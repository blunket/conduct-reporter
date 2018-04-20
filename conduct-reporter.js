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
				"cancel": "Cancel",
				"members_description": "Your report will be sent to the following people:",
			},
			"wrapper_class": "cr-modal",
			"show_users": true
		}
		this.options = cr.__extend(true, modalDefaults, modalOptions);
		this.modal = false;

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
				if (typeof callback === 'function') {
					callback(xhr.status == 201, xhr.status);
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
					<li class="cr-member">
						<img class="cr-member-avatar" src="` + member.avatar + `" alt="` + member.name + `">
						<span class="cr-member-username">@` + member.username + `</span>
					</li>
				`;
			}

			var modalHtml = `
				<div class='` + cr.options.wrapper_class + `' id='cr-modal'>
				<h1 class="cr-modal-title">` + cr.options.labels.modal_title + `</h1>
			`;
			if (cr.options.show_users) {
				modalHtml += `
					<p class="cr-members-description">` + cr.options.labels.members_description + `</p>
					<div class="cr-member-list">
						<ul class="cr-members">` + membersHtml + `</ul>
					</div>
				`;
			}
			modalHtml += `
				<form action="" id="cr-modal-form">
					<div class="cr-question">
						<label for="cr-name">` + cr.options.labels.name + `</label>
						<input tabindex="1" type="text" id="cr-name" name="name" />
					</div>
					<div class="cr-question">
						<label for="cr-contact">` + cr.options.labels.contact + `</label>
						<input tabindex="2" type="text" id="cr-contact" name="contact" />
					</div>
					<div class="cr-question">
						<label for="cr-message">` + cr.options.labels.message + `</label>
						<textarea tabindex="3" id="cr-message" name="message"></textarea>
					</div>
					<div class="cr-buttons">
						<input tabindex="5" type="button" class="cr-cancel" value="` + cr.options.labels.cancel + `">
						<input tabindex="4" type="submit" class="cr-submit" value="` + cr.options.labels.submit + `">
					</div>
				</form>
				</div>
			`;
			cr.modal = basicLightbox.create(modalHtml, {
				afterShow: function() {
					cr.__formInit();
				}
			});
			cr.modal.show();
		});
	}

	__formInit() {
		var cr = this;
		document.getElementById("cr-name").focus();
		document.getElementsByClassName("cr-cancel")[0].onclick = function() {
			cr.modal.close();
		}
		document.getElementById("cr-modal-form").onsubmit = function(e) {
			e.preventDefault();
			cr.sendReport({
				"reporter": document.getElementById("cr-name").value,
				"contact": document.getElementById("cr-contact").value,
				"report": document.getElementById("cr-message").value
			}, function(success, status) {
				console.log(success, status);
			});
		}
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
