import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../../services/event.bus-service.js";


const quickReply = {
	props: ['reply', 'button', 'mode'],
	components: {
		eventBus,
	},
	template: `
        <div v-if="mail" class="reply">
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

export const mailFullscreen = {
	props: ['mail'],
	components: {
		quickReply,
	},
	template: `
		<section class="mail-read" @keydown.esc="resetMode">
			<section class="controls flex">
				<img src="apps/mail/img/back.png" title="Go back" @click="goBack"/>
				<img src="apps/mail/img/reply.svg" title="Reply"/>
				<img src="apps/mail/img/trash.png" title="Delete" @click="remove"/>
				<img src="apps/mail/img/unread.png" :title="markAs"/>
				<img src="apps/mail/img/fullscreen.svg" @click.stop="goTo(mail)"/>
			</section>
			<section class="mail">
				<img src="./apps/mail/img/profile.png">
				<section class="content">
					<div class="subject">
						<span class="title">{{mail.subject}}</span>
						<span class="tags">{{mail.folder}}</span>
					</div>
					<p class="from">{{mail.from}}</p>
					<p class="to">{{mail.to}}</p>
					<p class="body">
						{{mail.body}}
					</p>
                    <div v-if="!mode" class="actions">
                        <button @click="quickReply"><img src="./apps/mail/img/reply.png"><p>Replay</p></button>
                        <button @click="quickReply"><img src="./apps/mail/img/reply-all.png"><p>Replay all</p></button>
                        <button @click="quickForward"><img src="./apps/mail/img/forward.png"><p>Forward</p></button>
                    </div>
                </section>
				<quick-reply v-if="mode" :reply="mail" :button="'Send'" :mode="mode" @send="resetMode"/>
			</section>
		</section>
	`,
	data() {
		return {
			mode: null,
		}
	},
	methods: {
		remove() {
			this.$router.go(-1);
			$emit('remove', mail);
		},
		goBack() {
			this.$router.go(-1);
		},
		quickReply() {
			this.$router.push({ path: `/mail/${this.mail.folder}?id=${this.mail.id}&mode=reply` });
		},
		quickForward() {
			this.$router.push({ path: `/mail/${this.mail.folder}?id=${this.mail.id}&mode=forward` });
		},
		resetMode() {
			this.$router.push({ path: `/mail/${this.mail.folder}?id=${this.mail.id}` });
		}
	},
	computed: {
		tagForDisplay() {
			return this.mail.folder;
		},
		markAs() {
			return (this.mail.isRead) ? 'Mark as unread' : "Mark as read";
		}
	},
	watch: {
		'$route.query.mode': {
			handler(mode) {
				this.mode = (mode) ? mode : null;
			},
			immediate: true,
		}
	}
}
