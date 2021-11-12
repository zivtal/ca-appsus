import { eventBus } from '../../../services/event.bus-service.js';
import addNewNote from './add-new-note.cmp.js';
import { utilService } from '../../../services/utils.service.js';

export default {
	props: [ 'note' ],
	components: {},
	template: `
	<div class="note-toolbar-container">
            <div class="note-toolbar">
                <img src="apps/note/imgs/edit.svg" @click="openEditor"></img>
                <input type="color" v-model="backgroundColor" value="#545454" @blur="changeColor" class="color-input"/>
				<img src="apps/note/imgs/color.svg" />
                <img src="apps/note/imgs/label.svg" /> 
                <img src="apps/note/imgs/duplicate.svg" @click="duplicateNote"/>
                <img src="apps/note/imgs/delete.svg" @click="removeNote"/>
                <img src="apps/note/imgs/export.svg" />
            </div>
			<section>
				<add-new-note v-if="isEditor" class="note-editor" :editNote="note" @isShown="isShown" />
				 </section>
</div>
    `,
	data() {
		return {
			currNote: this.note,
			backgroundColor: '#545454',
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
