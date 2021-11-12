import { noteService } from '../services/note-service.js';
import { utilService } from '../../../services/utils.service.js';

export default {
	props: [ 'editNote' ],
	components: {},
	template: `
           <form @submit.prevent="save">
            <div class="add-note-inputs flex"> 
                <div class="pinned-container flex"> 
                    <input type="text" placeHolder="Title" class="add-note-title" v-model="title" >
                    <img src="apps/note/imgs/pinned.svg" @click.prevent="pinnedNote" :class="{'note-pinned':true,ismark:isPinned}"/>
                </div>
                <input type="text" PlaceHolder="Add a note" v-model="txt" class="add-note-text" :placeHolder="setPlaceHolder">
            </div>
            <div class="new-note-toolbar flex">
                <div class="note-type-btns">
                    <input type="color" v-model="backgroundColor" class="color-input" value="#545454" />
                    <img src="apps/note/imgs/color.svg" class="color-icon" />
                <img src="apps/note/imgs/text.svg" @click.stop.prevent="setObjType('text')" />
                <img src="apps/note/imgs/img.svg"  @click.stop.prevent="setObjType('image')"/>
                <img src="apps/note/imgs/video.svg"  @click.stop.prevent="setObjType('video')"/> 
                <img src="apps/note/imgs/todos.svg" @click.stop.prevent="setObjType('todo')"/>
                </div>
                <div class="note-panel-control">
                <button class="submit-btn" type="submit" >Add</button>
                    <button @click.prevent="closeEditNote" class="close-modal-btn">close</button>
    </div>
            </div>
        </form> 
    `,
	data() {
		return {
			setPlaceHolder: 'amir',
			title: '',
			txt: '',
			isPinned: false,
			noteType: '',
			backgroundColor: '#545454',
			placeHolder: {
				text: 'Please write some text',
				image: 'Please paste your image url',
				video: 'Please paste your video url',
				todo: 'Please write some todos'
			},
			editMode: false
		};
	},
	created() {
		if (this.editNote) {
			this.editMode = true;
			this.title = this.editNote.info.title;
			if (this.editNote.type === 'NoteTxt') {
				this.title = this.editNote.info.title;
				this.txt = this.editNote.info.txt;
				this.noteType = this.editNote.type;
				this.backgroundColor = this.editNote.style.backgroundColor;
			} else if (this.editNote.type === 'NoteImg' || this.editNote.type === 'NoteVideo') {
				this.title = this.editNote.info.title;
				this.txt = this.editNote.info.url;
				this.noteType = this.editNote.type;
			} else if (this.editNote.type === 'NoteToDo') {
				var txtTodos = '';
				this.title = this.editNote.info.title;
				this.editNote.info.todos.map((todo) => (txtTodos += todo.txt + ','));
				txtTodos = txtTodos.substring(0, txtTodos.length - 1);
				this.txt = txtTodos;
				this.noteType = this.editNote.type;
			}
		}
	},
	updated() {},
	destroyed() {},
	methods: {
		setObjType(noteType) {
			this.noteType = noteType;
			this.setPlaceHolder = this.placeHolder[noteType];
		},
		save() {
			this.closeEditNote();
			if (this.editMode) {
				this.editNote.info.title = this.title;
				this.editNote.style = this.backgroundColor;
				if (this.editNote.type === 'NoteImg' || this.editNote.type === 'NoteVideo')
					this.editNote.info.url = this.txt;
				else {
					this.editNote.info.txt = this.txt;
				}
				this.editMode = false;
				return;
			}
			const backgroundColor = this.backgroundColor;
			if (this.noteType === 'text') {
				const txtInfo = { title: this.title, txt: this.txt };
				this.$emit('cmpType', {
					type: 'NoteTxt',
					val: txtInfo,
					style: backgroundColor,
					isPinned: this.isPinned
				});
			} else if (this.noteType === 'image') {
				const imgInfo = { title: this.title, url: this.txt };
				this.$emit('cmpType', { type: 'NoteImg', val: imgInfo, style: backgroundColor });
			} else if (this.noteType === 'video') {
				const videoInfo = { title: this.title, url: this.txt };
				this.$emit('cmpType', { type: 'NoteVideo', val: videoInfo, style: backgroundColor });
			} else if (this.noteType === 'todo') {
				const todosTxt = this.txt.split(',');
				const todos = [];
				todosTxt.map((todo) => {
					const task = {
						txt: todo,
						doneAt: new Date(),
						id: utilService.makeId(),
						checked: false
					};
					todos.push(task);
				});
				const toDoInfo = { title: this.title, todos: todos, label: null };
				this.$emit('cmpType', {
					isEdit: this.editMode,
					type: 'NoteToDo',
					val: toDoInfo,
					style: backgroundColor
				});
			}
			this.title = null;
			this.txt = null;
			this.closeEditNote();
		},
		closeEditNote() {
			this.$emit('isShown');
		},
		pinnedNote() {
			this.isPinned = !this.isPinned;
			console.log(this.isPinned);
			if (this.editMode) this.editNote.isPinned = this.isPinned;
		}
	},
	computed: {},
	watch: {},
	components: {
		noteService,
		utilService
	}
};
