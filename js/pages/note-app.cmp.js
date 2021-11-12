import notePreview from '../apps/note/cmps/note-preview.cmp.js';
import { noteService } from '../apps/note/services/note-service.js';
import { eventBus } from '../services/event.bus-service.js';

export default {
	props: [],
	components: {},
	template: `
	<section class="main-note">
        <note-preview :notes="notes"/>
</section>
`,
	data() {
		return {
			notes: null,
			filterBy: null
		};
		},
		created() {
		this.loadDemo()
		this.loadNotes();
		eventBus.$on('showChange', this.handleEvent);
		eventBus.$on('copyNote', this.updateNotes);
		eventBus.$on('removenote', this.removeNote);
		eventBus.$on('filtered', this.notesToShow);
		eventBus.$on('loadQuery', this.loadNotes);
	},
	updated() {},
	destroyed() {},
	methods: {
		loadDemo() {
			noteService.createDemoQuery()
		},
		loadNotes() {
			this.notes = noteService.query();
			console.log(this.notes);
			return this.notes;
		},
		handleEvent(val) {
			console.log(val);
			const { note, color } = val;
			note.style.backgroundColor = color;
		},
		updateNotes(copyNote) {
			const { type, info, style } = copyNote;
			noteService.addNote(type, info, style.backgroundColor);
		},
		removeNote(currNote) {
			const removeNote = this.notes.findIndex((note) => note === currNote);
			this.notes.splice(removeNote, 1);
		},
		notesToShow(filterBy) {
			const { type, txt } = filterBy;
			if (!filterBy || ((type === '' && txt === '') || type === 'All')) {
				this.loadNotes();
				return;
			}
			this.filterBy = filterBy;
			this.notes = this.loadNotes().filter((note) => {
				if (type === 'NoteToDo') return note.type === 'NoteToDo';
				if (!type) return note.info.title?.toLowerCase().includes(txt.toLowerCase());
				if (!txt) return note.type === type;
				return note.type === type && note.info.title.toLowerCase().includes(txt.toLowerCase());
			});
		}
	},
	computed: {},
	watch: {},
	components: {
		notePreview
	}
};
