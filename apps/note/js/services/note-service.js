import { utilService } from '../../../../services/utils.service.js';

export const noteService = {
	query,
	addNote
};

var gNotes;

function query() {
	gNotes = utilService.createDemo('../../../json/notes.json');
	return gNotes;
}

function addNote(type, info, style) {
	const id = utilService.makeId();
	const noteToSave = {
		id,
		type,
		isPinned: false,
		info,
		style: {
			backgroundColor: style
		}
	};
	gNotes.unshift(noteToSave);
	console.log(noteToSave);
	return noteToSave;
}

// function _saveNotes() {
// 	storageService.saveToStorage('notesDB', gNotes);
// }
