class ConductReporterModal {

	constructor(el) {
		var crm = this;
		document.querySelector(el).addEventListener("click", function(e) {
			e.preventDefault();
			crm.show();
		})
	};

	show() {
		var modal = basicLightbox.create(`
			<div class='conduct-reporter-modal'>
			<form action="">
				<div>
					<label for="name">Your name</label>
					<input type="text" id="conduct-reporter-name" name="name" />
				</div>
				<div>
					<label for="contact">Your contact info (slack, email, etc.)</label>
					<input type="text" id="conduct-reporter-contact" name="contact" />
				</div>
				<div>
					<label for="message">What happened?</label>
					<textarea id="conduct-reporter-message" name="message"></textarea>
				</div>
			</form>
			</div>
		`);
		modal.show();

	}
}
