import notePreview from '../apps/note/cmps/note-preview.cmp.js';
import { noteService } from '../apps/note/services/note-service.js';
import { eventBus } from '../services/event.bus-service.js';
import { utilService } from '../services/utils.service.js';
export default {
	props: [],
	components: {},
	template: `
	<section class="main-note">
        <note-preview v-if="notes" :notes="notes"/>
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
		eventBus.$on('addNote', this.addNote);
	},
	updated() {},
	destroyed() {},
	methods: {
		
		loadNotes() {
			return noteService.query().then((notes)=> {
				this.notes = notes
				return notes
			})
		},
		addNote(note) {
			this.notes.unshift(note)
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
			if (!filterBy || ((type === '' && txt === '') || type === 'All' && txt === '')) {
				this.loadNotes();
				return;
			}
			this.filterBy = filterBy;
			this.loadNotes().then((notes) => {
			 return this.notes = notes.filter((note) => {
				if (type === 'NoteToDo') return note.type === 'NoteToDo';
				if (!type) return note.info.title?.toLowerCase().includes(txt.toLowerCase());
				if (!txt) return note.type === type;
				return note.info.title?.toLowerCase().includes(txt.toLowerCase());
			})});
		}
	},
	computed: {},
	watch: {
		'$route.query': {
			handler(get) {
				console.log(get);
				if (get === null) {
				} else {
					const note = noteService.getEmptyNote();
					note.id = utilService.makeId();
					note.type = 'NoteTxt'
					note.info.title = this.$route.query.title || null;
					note.info.txt = this.$route.query.txt || null;
					eventBus.$emit('openNoteModal',note)
				}
			},
			immediate: true
		}
	},
	components: {
		notePreview
	}
};
