import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../services/event.bus-service.js";

export const quickReply = {
    props: ['reply', 'button', 'mode'],
    components: {
        eventBus,
    },
    template: `
        <div v-if="mail && !isNewCompose" class="reply">
			<img src="./img/mail/profile.png">
			<section class="board">
				<input ref="email" type="text" v-model="mail.to" :readonly="isReply" placeholder="To" autofocus/>
                <img @click="compose" src="./img/mail/expand_window.png"/>
				<textarea ref="content" v-if="mail" v-model="mail.body"></textarea>
				<button @click="send">{{button}}</button>
				<button class="trimmed-content" @click="addReply" title="Show trimmed content">&#903;&#903;&#903;</button>
			</section>
        </div>
    `,
    data() {
        return {
            mail: null,
            isNewCompose: false,
            isIncludeReply: false,
        }
    },
    created() {
        mailService.getDraft(this.reply.id, this.mode)
            .then(draft => {
                this.mail = (draft) ? draft : mailService.getEmptyMail();
                this.mail.sentAt = Date.now();
                eventBus.$emit('mailSave', this.mail);
                switch (this.mode) {
                    case 'forward':
                        this.mail.forward = this.reply.id;
                        this.mail.to = '';
                        const date = new Date(this.reply.sentAt);
                        this.mail.body = `\n\n\n---------- Forwarded message ---------
							\nFrom: ${this.reply.from}
							\n${date.toString()}
							\nSubject: ${this.reply.subject}
							\nTo: ${this.reply.to}
							\n\n\n${this.reply.body}`;
                        this.mail.from = 'me@appsus.com';
                        this.mail.subject = 'FW: ' + this.reply.subject;
                        this.mail.sentAt = Date.now();
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
            if (this.mail.id) eventBus.$emit('mailSave', this.mail);
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
            if (this.mode === 'reply' && !this.isIncludeReply) this.mail.body = this.mail.body + this.replyContent;
            this.mail.sentAt = Date.now();
            eventBus.$emit('mailSave', this.mail);
            this.$emit('send');
        },
        compose() {
            this.$router.push({ path: `/mail/${this.reply.folder}?id=${this.reply.id}&compose=${this.mail.id}` })
        },
        addReply() {
            this.mail.body = (this.mail.body) ? this.mail.body + this.replyContent : '\n\n' + this.replyContent;
            isIncludeReply = true;
        }
    },
    computed: {
        isReply() {
            return (this.mode === 'reply');
        },
        replyContent() {
            var body = this.reply.body.split('\n');
            body = body.map(line => (line) ? `\n>${line}` : `\n`);
            return `On ${new Date(this.reply.sentAt)} ${this.reply.from} wrote:${body}`;
        }
    }
}
