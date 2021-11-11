import controlPanelBtns from './control-panel-btns.js';
import { noteService } from '../services/note-service.js';
import { utilService } from '../../../../services/utils.service.js';
import addNewNote from './add-new-note.cmp.js';

const NoteTxt = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt">{{setTxtLength}}</p>
            <control-panel-btns  :note="note" />
        </div>
    `,
	data() {
		return {};
	},
	methods: {},
	computed: {
		setTxtLength() {
			if (this.note.info.txt.length > 30) {
				return this.note.info.txt.substring(0, 25);
			} else return this.note.info.txt;
		}
	},
	mounted() {},
	components: {
		controlPanelBtns
	}
};
const NoteImg = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
                <img v-if="note.info.url" :src="note.info.url" />
            <control-panel-btns :note="note" />
        </div>
    `,
	data() {
		return {
			text: ''
		};
	},
	methods: {
		reportVal() {
			this.$emit('setInput', this.text);
		}
	},
	mounted() {},
	components: {
		controlPanelBtns
	}
};
const NoteVideo = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
                <video v-if="note.info.url" controls name="media" >
                    <source :src="note.info.url" type="video/mp4"> </source>
                </video>
                
            <control-panel-btns :note="note" />
        </div>
    `,
	data() {
		return {
			text: ''
		};
	},
	methods: {
		reportVal() {
			this.$emit('setInput', this.text);
		}
	},
	mounted() {},
	components: {
		controlPanelBtns
	}
};
const NoteToDo = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
                <h1> {{note.info.title}}</h1>
                    <ul class="user-todo-list">
                        <li v-for="todo in note.info.todos">
                            <input type="checkbox" id="checkbox-input"  @change="markToDo(todo)"  />
                            <span :class="{checked:todo.checked === false} ">{{todo.txt}}</span>
                    </li>
                    </ul>
            <control-panel-btns :note="note" />
        </div>
    `,
	data() {
		return {
			text: ''
		};
	},
	methods: {
		reportVal() {
			this.$emit('setInput', this.text);
		},
		markToDo(todo) {
			console.log(todo.checked);
			todo.checked = !todo.checked;
		}
	},
	mounted() {},
	components: {
		controlPanelBtns
	}
};

export default {
	props: [ 'notes' ],
	template: `
    <div class="main-note">
    <div class="main-note-container">
        <!-- <form @submit.prevent="save" class="add-note-container">
            <div class="add-note-inputs flex"> 
                <div class="pinned-container flex"> 
                    <input type="text" PlaceHolder="Title" class="add-note-title" v-model="title">
                    <button @click.prevent class="note-pinned">Pinend</button>
                </div>
                <input type="text" PlaceHolder="Add a note" v-model="txt" class="add-note-text" :placeHolder="setPlaceHolder">
            </div>
            <div class="new-note-toolbar flex">
                <div class="note-type-btns">
                <input type="color" v-model="backgroundColor"> color </input>
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
        </form> -->
		<add-new-note @cmpType="addNewNote" class="add-note-container" />
        <section class="preview-note grid">
            <template v-for="note in notes">
                <component :is="note.type" :note="note" > </component>
            </template>
        </section>
        <section class="pinned-note">

        </section>
        <section class="others-note">

        </section>
</div>
</div>
    `,
	data() {
		return {
			// demoNotes: this.notes,
			// setPlaceHolder: 'amir',
			// title: '',
			// txt: '',
			// noteType: '',
			// backgroundColor: '',
			// placeHolder: {
			// 	text: 'Please write some text',
			// 	image: 'Please paste your image url',
			// 	video: 'Please paste your video url',
			// 	todo: 'Please write some todos'
			// }
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		// setObjType(ev) {
		// 	this.noteType = ev.target.value;
		// 	this.setPlaceHolder = this.placeHolder[ev.target.value];
		// },
		// save() {
		// 	const backgroundColor = this.backgroundColor;
		// 	if (this.noteType === 'text') {
		// 		const txtInfo = { title: this.title, txt: this.txt };
		// 		noteService.addNote('NoteTxt', txtInfo, backgroundColor);
		// 	} else if (this.noteType === 'image') {
		// 		const imgInfo = { title: this.title, url: this.txt };
		// 		noteService.addNote('NoteImg', imgInfo, backgroundColor);
		// 	} else if (this.noteType === 'video') {
		// 		const videoInfo = { title: this.title, url: this.txt };
		// 		noteService.addNote('NoteVideo', videoInfo, backgroundColor);
		// 	} else if (this.noteType === 'todo') {
		// 		const todosTxt = this.txt.split(',');
		// 		const todos = [];
		// 		todosTxt.map((todo) => {
		// 			const task = {
		// 				txt: todo,
		// 				doneAt: new Date(),
		// 				id: utilService.makeId(),
		// 				checked: false
		// 			};
		// 			todos.push(task);
		// 		});
		// 		const toDoInfo = { title: this.title, todos: todos, label: null };
		// 		noteService.addNote('NoteToDo', toDoInfo, backgroundColor);
		// 	}
		// 	this.title = '';
		// 	this.txt = '';
		// }

		addNewNote(val) {
			noteService.addNote(val.type, val.val, val.style);
			console.log(this.notes);
		}
	},
	computed: {},
	watch: {},
	components: {
		NoteTxt,
		NoteImg,
		NoteVideo,
		NoteToDo,
		controlPanelBtns,
		noteService,
		addNewNote
	}
};
