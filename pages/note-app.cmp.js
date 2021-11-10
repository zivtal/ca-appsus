import notePreview from '../apps/note/js/cmps/note-preview.cmp.js';
import { noteService } from '../apps/note/js/services/note-service.js';
import { eventBus } from '../services/event.bus-service.js';

export default {
	props: [],
	components: {},
	template: `

        <note-preview :notes="notes"  />
`,
	data() {
		return {
			notes: null
		};
	},
	created() {
		this.loadNotes();
		eventBus.$on('showChange', this.handleEvent);
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
		}
	},
	computed: {},
	watch: {},
	components: {
		notePreview
	}
};
