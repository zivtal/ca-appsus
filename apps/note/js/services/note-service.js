import { utilService } from '../../../../services/utils.service.js';

export const noteService = {
	query
};

function query() {
	return utilService.createDemo('../../../json/notes.json');
}

// function renderCards() {
// 	const data = getDemoNotes();
// 	console.log(data);
// 	var strHtml = '';
// }
