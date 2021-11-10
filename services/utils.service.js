export const utilService = {
	saveToStorage,
	loadFromStorage,
	deepCopy,
	createDemo,
	getTimeFormat,
	makeId
};

function saveToStorage(key, val) {
	localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
	var val = localStorage.getItem(key);
	return JSON.parse(val);
}

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function createDemo(fileUrl) {
	var request = new XMLHttpRequest();
	request.open('GET', fileUrl, false);
	request.send(null);
	return JSON.parse(request.responseText);
}

function makeId(length = 5) {
	var txt = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return txt;
}

function getTimeFormat(timestamp, countryCode = 'en-US') {
	const year = new Date().getFullYear();
	const date = new Date(timestamp);
	var options =
		year === date.getFullYear()
			? {
					month: 'short',
					day: 'numeric'
				}
			: {
					year: '2-digit',
					month: 'numeric',
					day: 'numeric'
				};
	return date.toLocaleDateString(countryCode, options);
}
