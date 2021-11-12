import { utilService } from '../../../services/utils.service.js';

export const noteService = {
	query,
	addNote,
	createDemoQuery,
	hexColor
};

var gNotes;
var NOTE_KEY = 'notes';

function createDemoQuery() {
	gNotes = utilService.createDemo('json/notes.json');
	utilService.saveToStorage(NOTE_KEY, gNotes);
}

function query() {
	const notes = utilService.loadFromStorage(NOTE_KEY) || [];
	return notes;
}

function addNote(type, info, style, isPinned) {
	const id = utilService.makeId();
	const noteToSave = {
		id,
		type,
		isPinned: isPinned || false,
		info,
		style: {
			backgroundColor: style,
			isDark: hexColor(style)
		}
	};
	gNotes.unshift(noteToSave);
	utilService.saveToStorage(NOTE_KEY, gNotes);
	return noteToSave;
}

// function _saveNotes() {
// 	storageService.saveToStorage('notesDB', gNotes);
// }

function hexColor(color) {
	const hex = color.replace('#', '');
	const c_r = parseInt(hex.substr(0, 2), 16);
	const c_g = parseInt(hex.substr(2, 2), 16);
	const c_b = parseInt(hex.substr(4, 2), 16);
	const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
	return brightness > 155;
}
