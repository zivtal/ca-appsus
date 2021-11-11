import { noteService } from '../services/note-service.js';
import { utilService } from '../../../../services/utils.service.js';

export default {
	props: [ 'editNote' ],
	components: {},
	template: `
           <form @submit.prevent="save" >
            <div class="add-note-inputs flex"> 
                <div class="pinned-container flex"> 
                    <input type="text" placeHolder="Title" class="add-note-title" v-model="title">
                    <button @click.prevent class="note-pinned">Pinend</button>
                </div>
                <input type="text" PlaceHolder="Add a note" v-model="txt" class="add-note-text" :placeHolder="setPlaceHolder">
            </div>
            <div class="new-note-toolbar flex">
                <div class="note-type-btns">
                <input type="color" v-model="backgroundColor"></input>
                <button value="text" @click.stop.prevent="setObjType"> text </button>
                <button value="image" @click.stop.prevent="setObjType"> image </button>
                <button value="video" @click.stop.prevent="setObjType"> video </button>
                <button value="todo" @click.stop.prevent="setObjType"> todo </button>
                </div>
                <div class="note-panel-control">
                <button type="submit"> Add Note </button>
                    <button @click.prevent> close </button>
    </div>
            </div>
        </form> 
    `,
	data() {
		return {
			setPlaceHolder: 'amir',
			title: '',
			txt: '',
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
		setObjType(ev) {
			this.noteType = ev.target.value;
			this.setPlaceHolder = this.placeHolder[ev.target.value];
		},
		save() {
			if (this.editMode) {
				this.editNote.info.title = this.title;
				if (this.editNote.type === 'NoteImg' || this.editNote.type === 'NoteVideo')
					this.editNote.info.url = this.txt;
				else {
					this.editNote.info.txt = this.txt;
				}
				return;
			}
			const backgroundColor = this.backgroundColor;
			if (this.noteType === 'text') {
				console.log(this.demoNotes);
				const txtInfo = { title: this.title, txt: this.txt };
				this.$emit('cmpType', { type: 'NoteTxt', val: txtInfo, style: backgroundColor });
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
				// noteService.addNote('NoteToDo', toDoInfo, backgroundColor);
				this.$emit('cmpType', {
					isEdit: this.editMode,
					type: 'NoteToDo',
					val: toDoInfo,
					style: backgroundColor
				});
			}
			this.title = null;
			this.txt = null;
		}
	},
	computed: {},
	watch: {},
	components: {
		noteService,
		utilService
	}
};
