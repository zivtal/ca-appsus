import controlPanelBtns from 'js/apps/note/cmps/control-panel-btns.js';
import { noteService } from 'js/apps/note/services/note-service.js';
import addNewNote from 'js/apps/note/cmps/add-new-note.cmp.js';
import noteFilter from 'js/apps/note/cmps/note-filter.cmp.js';

const NoteTxt = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
		<img src="apps/note/imgs/pinned.svg" class="user-note-pinned" v-if="note.isPinned">
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
		<img src="apps/note/imgs/pinned.svg" class="user-note-pinned" v-if="note.isPinned">

                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
                <img v-if="note.info.url" :src="note.info.url" class="note-img" />
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
		<img src="apps/note/imgs/pinned.svg" class="user-note-pinned" v-if="note.isPinned">

                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
                <video v-if="note.info.url" controls name="media"  class="note-img">
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
		<img src="apps/note/imgs/pinned.svg" class="user-note-pinned" v-if="note.isPinned">

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
    <div class="main-note" >
    <div class="main-note-container">
		
		<add-new-note @cmpType="addNewNote" class="add-note-container" />
		<note-filter :notes="notes"/>
		<h1>Pinned</h1>
        <section class="pinned-note">
                <component :is="note.type" :note="note" v-if="note.isPinned" v-for="note in notes" > </component>
        </section>
		<hr/>
		<h1>Others</h1>
        <section class="others-note">
			<component :is="note.type" :note="note" v-if="!note.isPinned" v-for="note in notes" > </component>
        </section>
        <section class="others-note">

        </section>
</div>
</div>
    `,
	data() {
		return {
			demoNotes: this.notes
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
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
		addNewNote,
		noteFilter
	}
};
