import { utilService } from '../../../services/utils.service.js';
import demoNotes from '../../../json/notes.json';

getDemoNotes();
function getDemoNotes() {
	const demoJson = utilService.createDemo(demoNotes);
	console.log(demoJson);
}
