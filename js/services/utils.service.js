export const utilService = {
	saveToStorage,
	loadFromStorage,
	deepCopy,
	createDemo,
	getTimeFormat,
	getLowerCase,
	makeId,
	camelCaseToSentence,
	getHexToRgb,
	isRgbDarkColor,
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

function makeId(length = 6) {
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

function camelCaseToSentence(input, isOnlyFirst = true) {
	if (!input) return;
	if (typeof input === 'string') input = [input];
	return input.map(key => key.replace(/[A-Z]/g, letter => (isOnlyFirst) ? ` ${letter.toLowerCase()}` : ` ${letter}`).replace(/[a-z]/, letter => letter.toUpperCase())).join(' » ')
};

function getHexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function isRgbDarkColor(color) {
	return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) < 50;
}

function getLowerCase(str) {
	return str.toLowerCase();
}