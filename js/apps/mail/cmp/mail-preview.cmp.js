import { utilService } from "../../../services/utils.service.js";
import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../services/event.bus-service.js";

export const mailPreview = {
    props: ['mail'],
    template: `
	<div>
		<section class="preview flex" :class="{unread:!mail.isRead}" @click="toggleExtended" @mouseover="mouseOver" @mouseleave="mouseLeave">
            <img class="star" :src="'./img/mail/'+starImg+'.svg'" @click.stop="setStarred(mail)"/>
            <div class="content" :class="{deleted: isInTrash}"><p>{{mailSubject}}</p></div>
			<div v-if="!controls" class="date"><p>{{sent}}</p></div>
			<div v-if="controls" class="controls flex">
				<img v-if="mail.folder !== 'draft'" src="./img/mail/reply.svg" title="Quick reply" @click.stop="reply(mail)"/>
				<img v-if="mail.restore && mail.folder === 'trash'" src="./img/mail/restore.png" title="Restore mail" @click.stop="restoreMail(mail)"/>
				<img src="./img/mail/trash.png" :title="delTitle" @click.stop="removeMail(mail)"/>
				<img :src="'./img/mail/'+markImg+'.png'" :title="markAs" @click.stop="markRead(mail)"/>
				<img src="./img/mail/note.svg" title="Add to notes" @click.stop="addToNotes(mail)"/>
				<img src="./img/mail/fullscreen.svg" title="Full screen" @click.stop="goTo(mail)"/>
			</div>
		</section>
		<transition name="slide-fade">
			<section v-if="extended && mail.body" class="preview-extended">
				{{contentPreview}}
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
                        if (mail.reply || mail.forward) {
                            const mode = (mail.reply) ? 'reply' : 'forward';
                            const id = mail[mode];
                            mailService.getById(id)
                                .then(item => {
                                    this.$router.push({ path: (item) ? `/mail/${mail.folder}?id=${id}&mode=${mode}` : `/mail/?compose=${mail.id}` });
                                });
                        } else this.$router.push({ path: `/mail/?compose=${mail.id}` });
                    } else this.$router.push({ path: `/mail/${mail.folder}?id=${mail.id}` });
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
        restoreMail(mail) {
            eventBus.$emit('mailRestore', mail);
        },
        addToNotes() {
            this.$router.push({ path: `/note/?to=${this.mail.from}&title=${this.mail.subject}&txt=${this.mail.body}` });
        },
        setStarred(mail) {
            eventBus.$emit('mailStarred', mail);
        }
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
            return (this.mail.folder === 'trash' && this.$route.params.folder !== 'trash');
        },
        starImg() {
            return (this.mail.isStarred) ? 'star-active' : "star-disabled";
        },
        mailSubject() {
            return this.mail.subject || 'No subject';
        },
        contentPreview() {
            var body = this.mail.body;
            return body.split('\n').filter(item => item).splice(0, 5).join('\n') + '  ...';
        }
    },
    watch: {
        '$route.params': {
            handler() { this.extended = false; },
            immediate: true,
        },
    }
}

