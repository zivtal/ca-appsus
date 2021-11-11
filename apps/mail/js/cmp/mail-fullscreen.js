import { mailService } from "../services/email-app.service.js";
import { eventBus } from "../../../../services/event.bus-service.js";


const quickReply = {
	props: ['reply', 'button'],
	components: {
		eventBus,
	},
	template: `
        <div class="reply">
			<img src="./apps/mail/img/profile.png">
			<section class="board">
				<template v-if="!isForward">
					<p class="from"><img src="./apps/mail/img/reply.png"/>{{reply.from}}</p>
				</template>
				<template v-else>
					<label>To:</label>
					<input type="text" v-model="mail.to"/>
				</template>
				<textarea v-if="mail" v-model="mail.body"></textarea>
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
		// this.isForward = true;
		mailService.getDraft(this.reply.id)
			.then(draft => {
				this.mail = (draft) ? draft : mailService.getEmptyMail(this.reply.id);
				eventBus.$emit('save', this.mail);
				if (this.isForward) {
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
				} else {
					this.mail.to = this.reply.from;
					this.mail.from = this.reply.to;
					this.mail.subject = 'RE: ' + this.reply.subject;
				}
			})
			.catch(err => console.log(err));
		eventBus.$on('mailDraftId', (draftId) => { this.mail.id = draftId });
		this.interval = setInterval(() => {
			if (this.mail.id && this.mail.body) eventBus.$emit('save', this.mail);
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
			eventBus.$emit('save', this.mail);
			this.$emit('send');
		}
	}
}

export const mailFullscreen = {
	props: ['mail'],
	components: {
		quickReply,
	},
	template: `
		<section class="mail-read" @keydown.esc="isReplyMode = false">
			<section class="controls flex">
				<img src="apps/mail/img/back.png" @click="goBack"/>
				<img src="apps/mail/img/reply.svg" />
				<img src="apps/mail/img/trash.png" @click="remove"/>
				<img src="apps/mail/img/unread.png"/>
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
                    <div v-if="!isReplyMode" class="actions">
                        <button @click="isReplyMode = !isReplyMode"><img src="./apps/mail/img/reply.png"><p>Replay</p></button>
                        <button @click="isReplyMode = !isReplyMode"><img src="./apps/mail/img/reply-all.png"><p>Replay all</p></button>
                        <button @click="isReplyMode = !isReplyMode"><img src="./apps/mail/img/forward.png"><p>Forward</p></button>
                    </div>
                </section>
				<quick-reply v-if="isReplyMode" :reply="mail" :button="'Send'" :isForward="false" @send="isReplyMode = false"/>
			</section>
		</section>
	`,
	data() {
		return {
			isReplyMode: false,
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
	},
	computed: {
		tagForDisplay() {
			return mail.folder;
		},
	},
	watch: {
		'$route.query.reply': {
			handler(reply) {
				if (reply) this.isReplyMode = reply;
			},
			immediate: true,
		}
	}
}
