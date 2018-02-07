class ConductReporter {
	constructor(server) {
		// remove trailing slash if there is any
		if (server.charAt(server.length - 1) == '/') {
			this.server = server.substr(0, server.length - 1);
		} else {
			this.server = server;
		}
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

}