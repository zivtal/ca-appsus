import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../../services/event.bus-service.js";

export const quickReply = {
    props: ['reply', 'button', 'mode'],
    components: {
        eventBus,
    },
    template: `
        <div v-if="mail && !isNewCompose" class="reply">
			<img src="./apps/mail/img/profile.png">
			<section class="board">
				<label>To:</label>
				<input ref="email" type="text" v-model="mail.to" :readonly="isReply" autofocus/>
				<textarea ref="content" v-if="mail" v-model="mail.body"></textarea>
				<button @click="send">{{button}}</button>
			</section>
        </div>
    `,
    data() {
        return {
            mail: null,
            isNewCompose: false,
        }
    },
    created() {
        mailService.getDraft(this.reply.id, this.mode)
            .then(draft => {
                this.mail = (draft) ? draft : mailService.getEmptyMail();
                eventBus.$emit('mailSave', this.mail);
                switch (this.mode) {
                    case 'forward':
                        this.mail.forward = this.reply.id;
                        this.mail.to = '';
                        const date = new Date(this.reply.sentAt);
                        this.mail.body = `
							\n\n---------- Forwarded message ---------
							\nFrom: ${this.reply.from}
							\n${date.toString()}
							\nSubject: ${this.reply.subject}
							\nTo: ${this.reply.to}
							\n\n\n${this.reply.body}`;
                        this.mail.from = 'me@appsus.com';
                        this.mail.subject = 'FW: ' + this.reply.subject;
                        break;
                    case 'reply':
                        this.mail.reply = this.reply.id;
                        this.mail.to = this.reply.from;
                        this.mail.from = this.reply.to;
                        this.mail.subject = 'RE: ' + this.reply.subject;
                        break;
                }
            })
            .catch(err => console.log(err));
        eventBus.$on('mailDraftId', (draftId) => { this.mail.id = draftId });
        this.interval = setInterval(() => {
            if (this.mail.id && this.mail.body) eventBus.$emit('mailSave', this.mail);
        }, 5000);
    },
    destroyed() {
        clearInterval(this.interval);
    },
    methods: {
        send() {
            clearInterval(this.interval);
            this.mail.folder = 'sent';
            this.mail.reply = null;
            this.mail.sentAt = Date.now();
            eventBus.$emit('mailSave', this.mail);
            this.$emit('send');
        }
    },
    computed: {
        isReply() {
            return (this.mode === 'reply');
        }
    }
}
