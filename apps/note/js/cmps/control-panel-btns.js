import { eventBus } from '../../../../services/event.bus-service.js';

export default {
	props: [ 'note' ],
	components: {},
	template: `
            <div class="note-toolbar">
                <input type="color" v-model="backgroundColor" @blur="changeColor"></input>
                <button> edit note </button>
                <button> add label </button>
                <button> duplicate note </button>
                <button> delete note </button>
                <button> Export to email </button>
            </div>
    `,
	data() {
		return {
			currNote: this.note,
			backgroundColor: ''
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		changeColor() {
			eventBus.$emit('showChange', { note: this.currNote, color: this.backgroundColor });
		}
	},
	computed: {},
	watch: {},
	components: {
		eventBus
	}
};
