import controlPanelBtns from './control-panel-btns.js';

const NoteTxt = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex">
                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
            <control-panel-btns />
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
const NoteImg = {
	props: [ 'note' ],
	template: `
        <div class="user-note flex">
                <h1> {{note.info.title}}</h1>
                <p v-if="note.info.txt"> {{note.info.txt}}</p>
            <control-panel-btns />
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

export default {
	props: [ 'notes' ],
	template: `
    <div class="main-note">
    <div class="main-note-container">
        <section class="add-note-container">
            <div class="add-note-inputs flex"> 
                <div class="pinned-container flex"> 
                    <input type="text" PlaceHolder="Title" class="add-note-title">
                    <button class="note-pinned">Pinend</button>
                </div>
                <input type="text" PlaceHolder="Add a note" class="add-note-text">
            </div>
            <div class="new-note-toolbar flex">
                <div class="note-type-btns"> 
                <button> color </button>
                <button> text </button>
                <button> image </button>
                <button> video </button>
                <button> todo </button>
                </div>
                <div class="note-panel-control">
                <button> add </button>
                    <button> close </button>
    </div>
            </div>
        </section>
        <section class="preview-note grid">
            <template v-for="note in notes">
                <component  :is="mode" :note="note" :change="setNotesType(note)"> </component>
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
			mode: 'NoteTxt',
			demoNotes: this.notes
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		setNotesType(note) {
			// this.mode = note.type;
			console.log(note.type);
		}
	},
	computed: {},
	watch: {},
	components: {
		NoteTxt,
		NoteImg,
		controlPanelBtns
	}
};
