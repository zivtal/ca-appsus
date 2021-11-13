import { mailPreview } from "./mail-preview.cmp.js";
import { eventBus } from "../../../services/event.bus-service.js";

export const mailList = {
    props: ['mails'],
    components: {
        eventBus,
        mailPreview,
    },
    template: `
		<section class="mail-list">
            <section class="search">
                <svg focusable="false" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                <input type="text" v-model="filterBy.search" />
                <svg class="goxjub" focusable="false" viewBox="0 0 24 24"><path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path><path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path><path fill="#fbbc05" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path><path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path></svg>
            </section>
            <section class="controls">
                <select v-model="filterBy.read" title="Filter by read status">
                    <option :value="0">All</option>
                    <option :value="1">Read</option>
                    <option :value="2">Unread</option>
                </select>
                <select v-model="filterBy.star" title="Filter by starred">
                    <option :value="0">All</option>
                    <option :value="1">Starred</option>
                    <option :value="2">Unstarred</option>
                </select>
                <select v-model="sortBy.type" title="Sort by">
                    <option :value="0">Date</option>
                    <option :value="1">Subject</option>
                </select>
                <button @click="next"> » </button>
                <div>{{getPageDisplay}}</div>
                <button @click="previous"> « </button>
			</section>
			<section class="list flex columns">
				<template v-for="mail in mailDisplay">
					<mail-preview :mail="mail" @remove="$emit('remove',mail)"/>
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
                search: null,
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
        },
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
                if (this.filterBy.search) {
                    const text = this.filterBy.search.toLowerCase();
                    const results = [];
                    ['subject', 'body', 'from', 'to'].forEach(key => results.push(!item[key] || !item[key].toLowerCase().includes(text)));
                    if (results.every(result => result)) return false;
                };
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
        getPageDisplay() {
            return (this.page.index + 1) + '/' + this.page.last
        }
    },
    watch: {
        mailsBy: {
            handler(mails) {
                this.page.last = Math.ceil(mails.length / this.page.size);
            },
            immediate: true,
            deep: true,
        }
    }
}
