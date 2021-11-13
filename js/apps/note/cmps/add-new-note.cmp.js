import { noteService } from '../services/note-service.js';
import { utilService } from '../../../services/utils.service.js';
import { eventBus } from '../../../services/event.bus-service.js';

export default {
	props: [ 'editNote' ],
	components: {},
	template: `
           <form @submit.prevent="save">
            <div class="add-note-inputs flex"> 
                <div class="pinned-container flex"> 
                    <input type="text" placeHolder="Title" class="add-note-title" v-model="title" >
                    <img :src="pinnedSrc" @click.prevent="pinnedNote" :class="{'note-pinned':true,ismark:isPinned}" :title="titleCalc"/>
                </div>
                <input type="text" PlaceHolder="Add a note" v-model="txt" class="add-note-text" :placeHolder="setPlaceHolder">
            </div>
            <div class="new-note-toolbar flex">
				<div class="note-type-btns">
					<div class="colors-container grid" v-if="isColorShow"> 
						<div class="color-select" @click=setColorChoice :style="{background:color}" v-for="color in colors"></div>
					</div>
                    <img src="img/note/color.svg" @click="isColorShow = !isColorShow" class="color-icon" title="Color" />
                <img src="img/note/text.svg" @click.stop.prevent="setObjType('text')" title="Text" />
                <img src="img/note/img.svg"  @click.stop.prevent="setObjType('image')" title="Image"/>
                <img src="img/note/video.svg"  @click.stop.prevent="setObjType('video')" title="Video"/> 
                <img src="img/note/todos.svg" @click.stop.prevent="setObjType('todo')" title="ToDo List"/>
                </div>
                <div class="note-panel-control">
                <button class="submit-btn" type="submit">Add</button>
                    <button @click="slideModal" class="close-modal-btn">close</button>
    </div>
            </div>
        </form> 
    `,
	data() {
		return {
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
			],
			isShow: false,
			setPlaceHolder: 'Write text here',
			title: '',
			txt: '',
			isPinned: false,
			noteType: '',
			backgroundColor: '#f1f3f4',
			isColorShow: false,
			placeHolder: {
				text: 'Please write some text',
				image: 'Please paste your image url',
				video: 'Please paste your video url',
				todo: 'Please write some todos',
				noTxt: 'Please choose message type below'
			},
			editMode: false,
			pinnedSrc: 'img/note/pinned.svg',
			currNote: this.editNote,
			isPlus: false,
			mark: '+'
		};
	},
	created() {
		this.initAddNote();
	},
	updated() {},
	destroyed() {},
	methods: {
		initAddNote() {
			if (this.currNote) {
				this.editMode = true;
				this.title = this.currNote.info.title;
				if (this.currNote.type === 'NoteTxt') {
					this.title = this.currNote.info.title;
					this.txt = this.currNote.info.txt;
					this.noteType = this.currNote.type;
					this.backgroundColor = this.currNote.style.backgroundColor;
				} else if (this.currNote.type === 'NoteImg' || this.editNote.type === 'NoteVideo') {
					this.title = this.currNote.info.title;
					this.txt = this.currNote.info.url;
					this.noteType = this.currNote.type;
				} else if (this.currNote.type === 'NoteToDo') {
					var txtTodos = '';
					this.title = this.currNote.info.title;
					this.currNote.info.todos.map((todo) => (txtTodos += todo.txt + ','));
					txtTodos = txtTodos.substring(0, txtTodos.length - 1);
					this.txt = txtTodos;
					this.noteType = this.currNote.type;
				}
			}
		},

		slideModal() {
			if (this.editMode) eventBus.$emit('closeModal');
			else eventBus.$emit('changeModal', this.editMode);
		},
		setColorChoice(ev) {
			const hexColor = noteService.getHexColor(ev.target.style.backgroundColor);
			this.backgroundColor = hexColor;
			this.isColorShow = !this.isColorShow;
		},
		setObjType(noteType) {
			this.noteType = noteType;
			this.setPlaceHolder = this.placeHolder[noteType];
		},
		async save() {
			eventBus.$emit('closeModal');
			if (this.editMode) {
				this.editNote.info.title = this.title;
				this.editNote.style.backgroundColor = this.backgroundColor;
				if (this.editNote.type === 'NoteImg' || this.editNote.type === 'NoteVideo')
					this.editNote.info.url = this.txt;
				else {
					this.editNote.info.txt = this.txt;
				}
				this.editMode = false;
				const id = await noteService.getNoteByid(this.editNote);
				console.log('fsd');
				if (id.length !== 0) return;
			}
			if (!this.noteType) {
				this.setPlaceHolder = 'Please choose message type below';
				return;
			}
			eventBus.$emit('changesign');
			const backgroundColor = this.backgroundColor;
			if (this.noteType === 'text' || this.editNote.type === 'NoteTxt') {
				const txtInfo = { title: this.title, txt: this.txt };
				console.log(txtInfo);
				console.log(this.editNote);
				this.$emit('cmpType', {
					type: 'NoteTxt',
					val: txtInfo,
					style: backgroundColor,
					isPinned: this.isPinned
				});
				if (this.editNote.type === 'NoteTxt') {
					noteService.addNote(this.editNote.type, txtInfo, backgroundColor).then((note) => {
						eventBus.$emit('addNote', note);
					});
					return;
				}
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
		},
		pinnedNote() {
			this.isPinned = !this.isPinned;
			if (!this.isPinned) this.pinnedSrc = 'img/note/pinned.svg';
			else this.pinnedSrc = 'img/note/pinnedOn.svg';

			if (this.editMode) this.editNote.isPinned = this.isPinned;
		}
	},
	computed: {
		titleCalc() {
			if (this.isPinned) return 'Pinned';
			if (!this.isPinned) return 'UnPinned';
		}
	},
	watch: {},
	components: {
		noteService,
		utilService
	}
};
