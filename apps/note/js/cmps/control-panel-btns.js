import { eventBus } from '../../../../services/event.bus-service.js';
import addNewNote from './add-new-note.cmp.js';
import { utilService } from '../../../../services/utils.service.js';

export default {
	props: [ 'note' ],
	components: {},
	template: `
            <div class="note-toolbar">
                <input type="color" v-model="backgroundColor" @blur="changeColor"></input>
                <button @click="openEditor"> edit note </button>
				<add-new-note v-if="isEditor" class="note-editor" style="opacity:100%" :editNote="note" />
                <button> add label </button>
                <button @click="duplicateNote"> duplicate note </button>
                <button @click="removeNote"> delete note </button>
                <button> Export to email </button>
            </div>
    `,
	data() {
		return {
			currNote: this.note,
			backgroundColor: '',
			isEditor: false
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		changeColor() {
			eventBus.$emit('showChange', { note: this.currNote, color: this.backgroundColor });
		},
		openEditor() {
			console.log('s');
			this.isEditor = true;
		},
		duplicateNote() {
			const copyNote = utilService.deepCopy(this.note);
			eventBus.$emit('copyNote', copyNote);
			// const copyNote = JSON.parse(stringfl());
		},
		removeNote() {
			eventBus.$emit('removenote', this.note);
		}
	},
	computed: {},
	watch: {},
	components: {
		eventBus,
		addNewNote
	}
};
