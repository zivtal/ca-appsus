import notePreview from '../apps/note/js/cmps/note-preview.cmp.js';
import { noteService } from '../apps/note/js/services/note-service.js';
import { eventBus } from '../services/event.bus-service.js';

export default {
	props: [],
	components: {},
	template: `
	<section class="main-note">
        <note-preview :notes="notesToShow"  />
</section>
`,
	data() {
		return {
			notes: null,
			filterBy: null
		};
	},
	created() {
		this.loadNotes();
		eventBus.$on('showChange', this.handleEvent);
		eventBus.$on('copyNote', this.updateNotes);
		eventBus.$on('removenote', this.removeNote);
		eventBus.$on('filtered', this.notesToShow);
	},
	updated() {},
	destroyed() {},
	methods: {
		loadNotes() {
			const demoNotes = noteService.query();
			this.notes = demoNotes;
			console.log(this.notes);
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
		}
	},
	computed: {
		notesToShow(filterBy) {
			if (!filterBy) return this.notes;
			this.filterBy = filterBy;
			console.log(filterBy);
			const { type, txt } = filterBy;

			return this.notes.filter((note) => {
				return note.type === type && note.title.toLowerCase().includes(txt.toLowerCase());
			});
		}
	},
	watch: {},
	components: {
		notePreview
	}
};
