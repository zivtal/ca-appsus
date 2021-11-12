import { utilService } from '../../../services/utils.service.js';
import { storageService } from '../../../services/async-storage.service.js';
export const noteService = {
	query,
	addNote,
	hexColor,
	rgbToHex,
	RGBTo
};
var NOTE_KEY = 'notes';
_createDemoQuery();

function _createDemoQuery() {
	let notes = utilService.loadFromStorage(NOTE_KEY);
	if (!notes || !notes.length) {
		notes = utilService.createDemo('json/notes.json');
		utilService.saveToStorage(NOTE_KEY, notes);
	}
	return notes;
}

function query() {
	return storageService.query(NOTE_KEY);
}

function save(item) {
	if (item.id) return storageService.put(NOTE_KEY, item);
	else return storageService.post(NOTE_KEY, item);
}

function addNote(type, info, style, isPinned) {
	const noteToSave = {
		type,
		isPinned: isPinned || false,
		info,
		style: {
			backgroundColor: style,
			isDark: hexColor(style)
		}
	};
	return save(noteToSave).then((note) => note);
}

function hexColor(color) {
	const hex = color.replace('#', '');
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
	return brightness > 155;
}

function rgbToHex(rgb) {
	var hex = Number(rgb).toString(16);
	if (hex.length < 2) {
		hex = '0' + hex;
	}
	return hex;
}

function RGBTo(rgb) {
	// Choose correct separator
	let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
	// Turn "rgb(r,g,b)" into [r,g,b]
	rgb = rgb.substr(4).split(')')[0].split(sep);

	let r = (+rgb[0]).toString(16),
		g = (+rgb[1]).toString(16),
		b = (+rgb[2]).toString(16);

	if (r.length == 1) r = '0' + r;
	if (g.length == 1) g = '0' + g;
	if (b.length == 1) b = '0' + b;

	return '#' + r + g + b;
}
