import { utilService } from "../../../services/utils.service.js";
import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../services/event.bus-service.js";

export const mailPreview = {
    props: ['mail'],
    template: `
	<div>
		<section class="preview flex" :class="{unread:!mail.isRead}" @click="toggleExtended" @mouseover="mouseOver" @mouseleave="mouseLeave">
            <img class="star" :src="'./img/mail/'+starImg+'.svg'" @click.stop="$emit('star',mail)"/>
            <div class="content" :class="{deleted: isInTrash}"><p>{{mail.subject}}</p></div>
			<div v-if="!controls" class="date"><p>{{sent}}</p></div>
			<div v-if="controls" class="controls flex">
				<img src="./img/mail/reply.svg" title="Quick reply" @click.stop="reply(mail)"/>
				<img src="./img/mail/trash.png" :title="delTitle" @click.stop="removeMail(mail)"/>
				<img :src="'./img/mail/'+markImg+'.png'" :title="markAs" @click.stop="markRead(mail)"/>
				<img src="./img/mail/fullscreen.svg" title="Full screen" @click.stop="goTo(mail)"/>
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
                        if (mail.reply || mail.forward) {
                            const mode = (mail.reply) ? 'reply' : 'forward';
                            const id = mail[mode];
                            this.$router.push({ path: `/mail/${mail.folder}?id=${id}&mode=${mode}` });
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
        }
    },
}

