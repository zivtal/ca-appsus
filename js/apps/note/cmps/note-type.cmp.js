import controlPanelBtns from './control-panel-btns.js';
import { noteService } from '../services/note-service.js';
export const NoteTxt = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
		<img :src="pinnedSrc" class="user-note-pinned" @click="setNotePinned">
                <h1 :style="{color:replaceHex}"> {{note.info.title}}</h1>
                <p :style="{color:replaceHex}" v-if="note.info.txt">{{setTxtLength}}</p>
            <control-panel-btns  :note="note" />
        </div>
    `,
	data() {
		return {};
	},
	created() {},
	methods: {
		setNotePinned() {
			this.note.isPinned = !this.note.isPinned;
			noteService.save(this.note);
		}
	},
	computed: {
		setTxtLength() {
			if (this.note.info.txt.length > 30) {
				return this.note.info.txt.substring(0, 25);
			} else return this.note.info.txt;
		},
		replaceHex() {
			if (!this.note.style.isDark) return '#222222';
		},
		pinnedSrc() {
			if (this.note.isPinned) return 'img/note/pinnedOn.svg';
			else return 'img/note/pinned.svg';
		}
	},
	mounted() {},
	components: {
		controlPanelBtns,
		noteService
	}
};
export const NoteImg = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
		<img :src="pinnedSrc" class="user-note-pinned" @click="setNotePinned">

                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
                <img v-if="note.info.url" :src="note.info.url" class="note-img"  />
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
		setNotePinned() {
			this.note.isPinned = !this.note.isPinned;
			noteService.save(this.note);
		}
	},
	mounted() {},
	computed: {
		pinnedSrc() {
			if (this.note.isPinned) return 'img/note/pinnedOn.svg';
			else return 'img/note/pinned.svg';
		}
	},
	components: {
		controlPanelBtns
	}
};
export const NoteVideo = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
		<img :src="pinnedSrc" class="user-note-pinned" @click="setNotePinned">

                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
                <video v-if="note.info.url" controls name="media"  class="note-img" >
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
		},
		setNotePinned() {
			this.note.isPinned = !this.note.isPinned;
			noteService.save(this.note);
		}
	},
	computed: {
		pinnedSrc() {
			if (this.note.isPinned) return 'img/note/pinnedOn.svg';
			else return 'img/note/pinned.svg';
		}
	},
	mounted() {},
	components: {
		controlPanelBtns
	}
};
export const NoteToDo = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex" :style="note.style">
		<img :src="pinnedSrc" class="user-note-pinned" @click="setNotePinned">

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
		},
		setNotePinned() {
			this.note.isPinned = !this.note.isPinned;
			noteService.save(this.note);
		}
	},
	computed: {
		pinnedSrc() {
			if (this.note.isPinned) return 'img/note/pinnedOn.svg';
			else return 'img/note/pinned.svg';
		}
	},
	mounted() {},
	components: {
		controlPanelBtns
	}
};
