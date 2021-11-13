import { eventBus } from '../../../services/event.bus-service.js';
import addNewNote from './add-new-note.cmp.js';
import { utilService } from '../../../services/utils.service.js';

export default {
	props: [ 'note' ],
	components: {},
	template: `
	<div class="note-toolbar-container">
            <div class="note-toolbar">
                <img src="img/note/edit.svg" @click="openEditor" ></img>
                <input type="color" v-model="backgroundColor" value="#f1f3f4" @blur="changeColor" class="color-input"/>
				<img src="img/note/color.svg" />
                <img src="img/note/label.svg" /> 
                <img src="img/note/duplicate.svg" @click="duplicateNote"/>
                <img src="img/note/delete.svg" @click="removeNote"/>
                <img src="img/note/export.svg" />
            </div>
			<section class="note-editor-main">
				<add-new-note v-if="isEditor" class="note-editor" :editNote="note" @isShown="isShown" />
				 </section>
</div>
    `,
	data() {
		return {
			currNote: this.note,
			backgroundColor: '#f1f3f4',
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
			this.isEditor = true;
		},
		duplicateNote() {
			const copyNote = utilService.deepCopy(this.note);
			eventBus.$emit('copyNote', copyNote);
		},
		removeNote() {
			eventBus.$emit('removenote', this.note);
			// eventBus.$emit('tRemoveNote', this.note);
		},
		isShown() {
			this.isEditor = !this.isEditor;
		}
	},
	computed: {},
	watch: {},
	components: {
		eventBus,
		addNewNote
	}
};
