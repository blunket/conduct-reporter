(function($){

	$.fn.conductReporter = function() {

		this.click(function(e) {
			e.preventDefault();

			console.log("test")
			var modal = basicLightbox.create(`
				<div class='modal'>
				<form action="">
					<div>
						<label for="name">Your name</label>
						<input type="text" id="name" name="name" />
					</div>
					<div>
						<label for="contact">Your contact info (slack, email, etc.)</label>
						<input type="text" id="contact" name="contact" />
					</div>
					<div>
						<label for="message">What happened?</label>
						<textarea id="message" name="message"></textarea>
					</div>
				</form>
				</div>
			`);
			modal.show();

		});
		return this;
	}

})(jQuery)