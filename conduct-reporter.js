class ConductReporter {
	constructor(server) {
		// remove trailing slash if there is any
		if (server.charAt(server.length - 1) == '/') {
			this.server = server.substr(0, server.length - 1);
		} else {
			this.server = server;
		}
	}

	// getMembers performs a GET request at the /members endpoint
	// and passes the response to a callback function as an object
	getMembers(callback) {
		var cr = this;
		var xhr = new XMLHttpRequest();
		var data = [];
		xhr.onreadystatechange = function() {
		    if (xhr.readyState == XMLHttpRequest.DONE) {
		    	if (xhr.status == 200) {
		    		callback(JSON.parse(xhr.responseText));
		    	} else {
		    		throw new Error("Could not get members: Server at " + cr.server + " did not respond with status code 200");
		    	}
		    }
		}
		xhr.open('GET', cr.server + "/members", true);
		xhr.send(null);
	}

}