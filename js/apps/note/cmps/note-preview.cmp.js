import controlPanelBtns from './control-panel-btns.js';
import { noteService } from '../services/note-service.js';
import addNewNote from './add-new-note.cmp.js';
import noteFilter from './note-filter.cmp.js';
import { eventBus } from '../../../services/event.bus-service.js';
import { NoteTxt } from './note-type.cmp.js';
import { NoteImg } from './note-type.cmp.js';
import { NoteVideo } from './note-type.cmp.js';
import { NoteToDo } from './note-type.cmp.js';

export default {
	props: [ 'notes' ],
	template: `
    <div class="main-note main-layout-note" >
    <div class="main-note-container">
		<transition name="slide-fade">
		<add-new-note v-if="show" @cmpType="addNewNote" class="add-note-container" />
</transition>
		<note-filter :notes="notes"/>
		<h1>Pinned</h1>
        <section class="pinned-note">
		<transition-group name="bounce"  >
                <component :is="note.type" :note="note" v-if="note.isPinned" v-for="note in getPinnednotes" :key="note.id"  :ind="note"
              > 
			</component>
</transition-group>
        </section>
		<hr/>
		<h1>Others</h1>
        <section class="others-note">
		<transition-group name="bounce" >

			<component :is="note.type" :note="note" v-if="!note.isPinned" v-for="note in notes" :key="note.id"  :ind="note"
              > </component>
			 </transition-group>

        </section>
        <section class="others-note">

        </section>
</div>
</div>
    `,
	data() {
		return {
			demoNotes: this.notes,
			show: this.isShow
		};
	},
	created() {
		eventBus.$on('showModal', this.slideNewPage);
		eventBus.$on('tRemoveNote');
	},
	updated() {},
	destroyed() {},
	methods: {
		slideNewPage(isShow) {
			this.show = isShow;
		},
		addNewNote(val) {
			noteService.addNote(val.type, val.val, val.style).then((note) => {
				eventBus.$emit('addNote', note);
			});
		}
	},
	computed: {
		getPinnednotes() {
			return this.notes.filter((note) => note.isPinned);
		}
	},
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
