import { eventBus } from '../../../services/event.bus-service.js';
import addNewNote from './add-new-note.cmp.js';
import { utilService } from '../../../services/utils.service.js';
import { noteService } from '../services/note-service.js';

export default {
	props: [ 'note' ],
	components: {},
	template: `
	<div class="note-toolbar-container">
            <div class="note-toolbar">
                <img src="img/note/edit.svg" @click="openEditor" ></img>
                <!-- <input type="color" v-model="backgroundColor" value="#f1f3f4" @blur="changeColor" class="color-input"/> -->
				<div class="colors-container-edit grid" v-if="isColorShow"> 
						<div class="color-select" @click=setColorChoice  :style="{background:color}" v-for="color in colors"></div>
					</div>
				<img src="img/note/color.svg"  @click="isColorShow = !isColorShow" />
                <img src="img/note/label.svg" /> 
                <img src="img/note/duplicate.svg" @click="duplicateNote"/>
                <img src="img/note/delete.svg" @click="removeNote"/>
                <img src="img/note/export.svg" @click="exportToMail" />
            </div>
			<section class="note-editor-main">
			
				 </section>
</div>
    `,
	data() {
		return {
			isColorShow: false,
			currNote: this.note,
			backgroundColor: '#f1f3f4',
			colors: [
				'#DE3163',
				'#FF7F50',
				'#FFBF00',
				'#DFFF00',
				'#CCCCFF',
				'#6495ED',
				'#40E0D0',
				'#9FE2BF',
				'#dadce0'
			]
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		setColorChoice(ev) {
			const hexColor = noteService.getHexColor(ev.target.style.backgroundColor);
			this.backgroundColor = hexColor;
			this.isColorShow = !this.isColorShow;
			this.note.style.backgroundColor = this.backgroundColor;
		},
		changeColor() {
			eventBus.$emit('showChange', { note: this.currNote, color: this.backgroundColor });
		},
		openEditor() {
			console.log(this.note);
			eventBus.$emit('openModal', this.note);
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
		},
		exportToMail() {
			var subject;
			var txt;
			if (this.note.type === 'NoteTxt') {
				txt = this.note.info.txt;
				subject = this.note.info.title;
			} else if (this.note.type === 'NoteImg' || this.note.type === 'NoteVideo') {
				txt = this.note.info.url;
				subject = this.note.info.title;
			} else {
				this.note.info.todos.map((todo) => (txt += todo.txt + ','));
				txt = txt.substring(9, txt.length - 1);
				subject = this.note.info.title;
			}
			if (!txt) txt = 'Write new text';
			if (!subject) subject = 'Write new title';

			this.$router.push(`/mail/?compose&to=amirinbar@gmail.com&subject=${subject}&body=${txt}`);
		}
	},
	computed: {},
	watch: {},
	components: {
		eventBus,
		addNewNote
	}
};
