import { mailPreview } from "./mail-preview.cmp.js";

export const mailList = {
    props: ['mails'],
    components: {
        mailPreview,
    },
    template: `
		<section class="mail-list">
            <section class="controls flex">
				<button>Read/Unread</button>
				<button>Starred/Unstarred</button>
				<button>Date</button>
				<button>Subject</button>
                <button @click="previous"> « </button>
                <button @click="next"> » </button>
			</section>
			<section class="list flex columns">
				<template v-for="mail in mailDisplay">
					<mail-preview :mail="mail" @remove="$emit('remove',mail)" @star="$emit('star',mail)"/>
				</template>
			</section>
		</section>
	`,
    data() {
        return {
            page: {
                display: null,
                index: 0,
                size: 10,
            }
        }
    },
    methods: {
        previous() {
            this.page.index = (this.page.index > 0) ? this.page.index - 1 : this.lastPage - 1;
            console.log(this.page.index);
        },
        next() {
            this.page.index = (this.page.index < this.lastPage - 1) ? this.page.index + 1 : 0;
            console.log(this.page.index);
        }
    },
    computed: {
        lastPage() {
            return Math.ceil(this.mails.length / this.page.size);
        },
        mailDisplay() {
            const all = this.mails.slice();
            const display = all.splice(this.page.index * this.page.size, this.page.size);
            return display;
        },
    },
    watch: {
        'page.index': {
            handler(index, OldIndex) {
                // console.log(index, OldIndex);
            },
            immediate: true,
        },
    }
}
