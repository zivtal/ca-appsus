import { mailPreview } from "./mail-preview.cmp.js";

export const mailList = {
    props: ['mails'],
    components: {
        mailPreview,
    },
    template: `
		<section class="mail-list">
            <section class="controls">
                <select v-model="filterBy.read" title="Filter by read status">
                    <option :value="0">Read/Unread</option>
                    <option :value="1">Read</option>
                    <option :value="2">Unread</option>
                </select>
                <select v-model="filterBy.star" title="Filter by starred">
                    <option :value="0">Starred/Unstarred</option>
                    <option :value="1">Starred</option>
                    <option :value="2">Unstarred</option>
                </select>
                <select v-model="sortBy.type" title="Sort by">
                    <option :value="0">Date</option>
                    <option :value="1">Subject</option>
                </select>
                <button @click="next"> » </button>
                <button @click="previous"> « </button>
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
                last: 0,
            },
            filterBy: {
                read: 0,
                star: 0,
            },
            sortBy: {
                type: 0,
                descending: true,
            }
        }
    },
    methods: {
        previous() {
            this.page.index = (this.page.index > 0) ? this.page.index - 1 : this.page.last - 1;
        },
        next() {
            this.page.index = (this.page.index < this.page.last - 1) ? this.page.index + 1 : 0;
        }
    },
    computed: {
        mailsBy() {
            const mails = this.mails.slice();
            const filtered = mails.filter(item => {
                switch (this.filterBy.read) {
                    case 1:
                        if (!item.isRead) return false;
                        break;
                    case 2:
                        if (item.isRead) return false;
                        break;
                }
                switch (this.filterBy.star) {
                    case 1:
                        if (!item.isStarred) return false;
                        break;
                    case 2:
                        if (item.isStarred) return false;
                        break;
                }
                return true;
            });
            switch (this.sortBy.type) {
                case 0: return (this.sortBy.descending) ? filtered.sort((a, b) => b.sentAt - a.sentAt) : filtered.sort((a, b) => a.sentAt - b.sentAt);
                case 1: return filtered.sort((a, b) => {
                    let fa = a.subject.toLowerCase(),
                        fb = b.subject.toLowerCase();
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                });
            }
        },
        mailDisplay() {
            const all = this.mailsBy.slice();
            const display = all.splice(this.page.index * this.page.size, this.page.size);
            return display;
        },
    },
    watch: {
        mailsBy: {
            handler(mails) {
                console.log(mails);
                this.page.last = Math.ceil(mails.length / this.page.size);
            },
            immediate: true,
            deep: true,
        }
    }
}
