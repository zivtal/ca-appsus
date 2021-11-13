import { utilService } from '../../../services/utils.service.js';
import { storageService } from '../../../services/async-storage.service.js';
export const noteService = {
	query,
	addNote,
	hexColor,
	getHexColor,
	getEmptyNote,
	getNoteByid,
	save
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

function getEmptyNote() {
	return {
		id: '',
		type: null,
		isPinned: false,
		info: [],
		style: {
			backgroundColor: '#dadce0',
			isDark: false
		}
	};
}
function query() {
	return storageService.query(NOTE_KEY);
}

function save(item) {
	console.log(item);
	if (item.id) return storageService.put(NOTE_KEY, item);
	else return storageService.post(NOTE_KEY, item);
}

function addNote(type, info, style = '#545454', isPinned) {
	const noteToSave = {
		type,
		isPinned: isPinned || false,
		info,
		style: {
			backgroundColor: style,
			isDark: false
		}
	};
	return save(noteToSave).then((note) => note);
}

function getNoteByid(note) {
	return query().then((items) => {
		return items.filter((item) => item.id === note.id);
	});
}

function hexColor(color) {
	const hex = color.replace('#', '');
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
	return brightness > 155;
}

function _rgbToHex(r, g, b) {
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getHexColor(style) {
	var style = style.slice(4, style.length - 1).split(',');
	var r = parseInt(style[0]);
	var g = parseInt(style[1]);
	var b = parseInt(style[2]);
	return _rgbToHex(r, g, b);
}
