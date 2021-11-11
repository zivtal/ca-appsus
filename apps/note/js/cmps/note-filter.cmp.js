import { eventBus } from '../../../../services/event.bus-service.js';

export default {
	props: [ 'notes' ],
	components: {},
	template: `
    <div class="main-filter">
		<div class="filter-container">
        <select v-model="filterBy.type">
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="todos">Todos</option>
            <option value="audio">Audio</option>
        </select>
        <input @input="filter" v-model="filterBy.txt" />
</div>
</div>
    `,
	data() {
		return {
			filterBy: { type: '', txt: '' }
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		filter() {
			eventBus.$emit('filtered', this.filterBy);
		}
	},
	computed: {},
	watch: {},
	components: {
		eventBus
	}
};
