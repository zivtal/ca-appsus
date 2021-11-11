import { utilService } from "../../../../services/utils.service.js";
import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../../services/event.bus-service.js";

export const mailPreview = {
    props: ['mail'],
    template: `
	<div>
		<section class="preview flex" :class="{unread:!mail.isRead}" @click="toggleExtended" @mouseover="mouseOver" @mouseleave="mouseLeave">
			<div class="star" @click.stop="$emit('star',mail)">
				<img v-if="mail.isStarred" src="./apps/mail/img/star-active.svg"/>
				<img v-if="!mail.isStarred" src="./apps/mail/img/star-disabled.svg"/>
			</div>
			<div class="content" :class="{deleted: isInTrash}"><p>{{mail.subject}}</p></div>
			<div v-if="!controls" class="date"><p>{{sent}}</p></div>
			<div v-if="controls" class="controls flex">
				<img src="./apps/mail/img/reply.svg" title="Quick reply" @click.stop="reply(mail)"/>
				<img src="./apps/mail/img/trash.png" :title="delTitle" @click.stop="removeMail(mail)"/>
				<img :src="'./apps/mail/img/'+markImg+'.png'" :title="markAs" @click.stop="markRead(mail)"/>
				<img src="./apps/mail/img/fullscreen.svg" title="Full screen" @click.stop="goTo(mail)"/>
			</div>
		</section>
		<transition name="slide-fade">
			<section v-if="extended" class="preview-extended">
				{{mail.body}}
			</section>
		</transition>
	</div>
	`,
    data() {
        return {
            extended: false,
            controls: false,
        }
    },
    methods: {
        mouseOver() {
            this.controls = true;
        },
        mouseLeave() {
            this.controls = false;
        },
        toggleExtended() {
            this.extended = !this.extended;
        },
        goTo(mail) {
            mail.isRead = true;
            mailService.save(mail)
                .then((mail) => {
                    if (mail.folder === 'draft') {
                        const mode = (mail.reply) ? 'reply' : 'forward';
                        const id = mail[mode];
                        this.$router.push({ path: `/mail/${mail.folder}?id=${id}&mode=${mode}` })
                    } else {
                        this.$router.push({ path: `/mail/${mail.folder}?id=${mail.id}` })
                    }
                })
                .catch(err => console.log(err));
        },
        reply(mail) {
            this.$router.push({ path: `/mail/${mail.folder}?id=${mail.id}&mode=reply` });
        },
        markRead(mail) {
            mail.isRead = !mail.isRead;
            eventBus.$emit('mailSave', mail);
        },
        removeMail(mail) {
            eventBus.$emit('mailRemove', mail);
        },
    },
    computed: {
        sent() {
            return utilService.getTimeFormat(this.mail.sentAt);
        },
        markAs() {
            return (this.mail.isRead) ? 'Mark as unread' : "Mark as read";
        },
        markImg() {
            return (this.mail.isRead) ? 'read' : "unread";
        },
        delTitle() {
            return (this.mail.folder === 'trash') ? 'Delete forever' : 'Delete';
        },
        isInTrash() {
            return this.mail.folder === 'trash';
        }
    },
}

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
            this.page.index = (this.page.index > 0) ? this.page.index - 1 : this.lastPage;
            console.log(this.page.index);
        },
        next() {
            this.page.index = (this.page.index < this.lastPage - 1) ? this.page.index + 1 : 0;
            console.log(this.page.index);
        }
    },
    computed: {
        lastPage() {
            return (this.mails) ? Math.ceil((this.mails.length - 1) / this.page.size) : null;
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
