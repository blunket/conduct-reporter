class ConductReporterModal {

	constructor(el, options) {
		var crm = this;

		var defaults = {
			"labels": {
				"name": "Your name",
				"contact": "Your contact info (slack, email, etc.)",
				"message": "What happened?",
			},
			"wrapper_class": "conduct-reporter-modal",
		}
		this.options = crm.__extend(true, defaults, options);

		document.querySelectorAll(el).forEach(function(el, i) {
			el.addEventListener("click", function(e) {
				e.preventDefault();
				crm.show();
			});
		});
	};

	show() {
		var crm = this;
		var modal = basicLightbox.create(`
			<div class='` + crm.options.wrapper_class + `' id='conduct-reporter-modal'>
			<form action="">
				<div>
					<label for="name">` + crm.options.labels.name + `</label>
					<input type="text" id="conduct-reporter-name" name="name" />
				</div>
				<div>
					<label for="contact">` + crm.options.labels.contact + `</label>
					<input type="text" id="conduct-reporter-contact" name="contact" />
				</div>
				<div>
					<label for="message">` + crm.options.labels.message + `</label>
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
