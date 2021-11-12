import { eventBus } from '../../../services/event.bus-service.js';

export default {
	props: [ 'notes' ],
	components: {},
	template: `
    <div class="main-filter">
		<div class="filter-container">
			<div class="filter-type-container">
				<input v-model="filterBy.type" id="All" name="All" @change="filter" type="radio" value="All" checked>
				<label for="All">All</label>
				<input v-model="filterBy.type" id="NoteTxt" name="NoteTxt" @change="filter" type="radio" value="NoteTxt" >
				<label for="NoteTxt"><img src="apps/note/imgs/text.svg"/></label>
				<input v-model="filterBy.type" id="noteImg" name="NoteImg" @change="filter" type="radio" value="NoteImg" >
				<label for="NoteImg"><img src="apps/note/imgs/img.svg"/></label>
				<input v-model="filterBy.type" id="noteVideo" name="NoteVideo" @change="filter" type="radio" value="NoteVideo" >
				<label for="NoteVideo"><img src="apps/note/imgs/video.svg" /></label>
				<input v-model="filterBy.type" id="noteToDo" name="NoteToDo" @change="filter" type="radio" value="NoteToDo" >
				<label for="noteToDo"><img src="apps/note/imgs/todos.svg"/></label>                
				
			</div>
			<div class="filter-txt-container flex">
				<button @click="slideModal" class="add-new-note-btn">
				<transition name="slide-fade" mode="out-in">
<span :key="mark">{{mark}}</span>
</transition>
</button>

				<div class="add-new-note-txt">
				<svg class="icon-search-svg" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
				<input @input="filter" v-model="filterBy.txt" class="filter-txt-input" placeHolder="Search..." />
</div>
			</div>
</div>
</div>
    `,
	data() {
		return {
			filterBy: { type: 'All', txt: '' },
			show: true,
			isPlus: true,
			mark: '+'
		};
	},
	created() {},
	updated() {},
	destroyed() {},
	methods: {
		filter() {
			console.log(this.filterBy.txt);
			eventBus.$emit('filtered', this.filterBy);
		},
		slideModal() {
			if (this.isPlus) this.mark = '-';
			else this.mark = '+';
			this.isPlus = !this.isPlus;
			eventBus.$emit('showModal', this.show);
			this.show = !this.show;
		}
	},
	computed: {},
	watch: {},
	components: {
		eventBus
	}
};
