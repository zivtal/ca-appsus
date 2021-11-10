const textBox = {
	props: [ 'data' ],
	template: `
        <div>
            <label>
				text
                <input type="text" v-model="text" @blur="reportVal" />
            </label>
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
	mounted() {}
};

export default {
	props: [ 'notes' ],
	components: {},
	template: `
    <div class="main-note-container">
        <section class="preview-note">
            <component is:mode :notes=notes></component>
            <article class="note-card"></article>
        </section>
        <section class="pinned-note">

        </section>
        <section class="others-note">

        </section>
</div>
    `,
	data() {
		return {
			mode: textBox,
			demoNotes: this.notes,
			cmps: [
				{
					type: 'textBox',
					data: {
						label: 'text'
					}
				}
			]
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		save() {
			console.log('d');
		}
	},
	computed: {},
	watch: {},
	components: {
		textBox
	}
};
