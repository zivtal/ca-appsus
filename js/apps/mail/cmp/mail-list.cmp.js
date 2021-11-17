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
                <svg viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path></svg>            </section>
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
