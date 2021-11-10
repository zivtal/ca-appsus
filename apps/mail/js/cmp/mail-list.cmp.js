import { utilService } from "../../../../services/utils.service.js";
import { mailService } from "../services/email-app.service.js";

export const mailPreview = {
    props: ['mail'],
    template: `
	<div>
		<section class="preview flex" :class="{unread:!mail.isRead}" @click="toggleExtended" @mouseover="mouseOver" @mouseleave="mouseLeave">
			<div class="star" @click.stop="$emit('star',mail)">
				<img v-if="mail.isStarred" src="./apps/mail/img/star-active.svg"/>
				<img v-if="!mail.isStarred" src="./apps/mail/img/star-disabled.svg"/>
			</div>
			<div class="content"><p>{{mail.subject}}</p></div>
			<div v-if="!controls" class="date"><p>{{sent}}</p></div>
			<div v-if="controls" class="controls flex">
				<img src="apps/mail/img/reply.svg"/>
				<img src="apps/mail/img/trash.png" @click.stop="$emit('remove',mail)"/>
				<img src="apps/mail/img/unread.png"/>
				<img src="apps/mail/img/fullscreen.svg" @click.stop="goTo(mail)"/>
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
                .then(this.$router.push({ path: `/mail/${mail.folder.toLowerCase()}?id=${mail.id}` }))
                .catch(err => console.log(err));
        }
    },
    computed: {
        star() {
            return (this.mail.isStarred) ? '*' : '';
        },
        sent() {
            return utilService.getTimeFormat(this.mail.sentAt);
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
			</section>
			<section class="list flex columns">
				<template v-for="mail in mails">
					<mail-preview :mail="mail" @remove="$emit('remove',mail)" @star="$emit('star',mail)"/>
				</template>
			</section>
		</section>
	`,
}
