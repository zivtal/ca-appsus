import { eventBus } from '../../../services/event.bus-service.js';

export default {
	props: [ 'notes' ],
	components: {},
	template: `
    <div class="main-filter">
		<div class="filter-container">
			<div class="filter-txt-container">
			<span class="filter-type-title">Filter by Note Type </span>
			<select v-model="filterBy.type" @change="filter">
				<option value="All">All</option>
				<option value="NoteTxt">Text</option>
				<option value="NoteImg">Image</option>
				<option value="NoteVideo">Video</option>
				<option value="NoteToDo">Todos</option>
				<option value="audio">Audio</option>
			</select>
</div>
			<div class="filter-txt-container">
			<span class="filter-txt-title">Filter by title</span>
        <input @input="filter" v-model="filterBy.txt" />
</div>
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
