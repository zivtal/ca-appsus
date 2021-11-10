import notePreview from '../apps/note/js/cmps/note-preview.cmp.js';
import { noteService } from '../apps/note/js/services/note-service.js';

export default {
	props: [],
	components: {},
	template: `
		
        <note-preview :notes="notes" />
`,
	data() {
		return {
			notes: null
		};
	},
	created() {
		this.loadNotes();
	},
	updated() {},
	destroyed() {},
	methods: {
		loadNotes() {
			const demoNotes = noteService.query();
			this.notes = demoNotes;
			console.log(this.notes);
		}
	},
	computed: {},
	watch: {},
	components: {
		notePreview
	}
};
