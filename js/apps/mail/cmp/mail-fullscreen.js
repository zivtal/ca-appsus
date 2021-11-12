import { quickReply } from "./mail-quickreply.cmp.js";
import { eventBus } from "../../../services/event.bus-service.js";

export const mailFullscreen = {
	props: ['mail'],
	components: {
		quickReply,
	},
	template: `
		<section class="mail-read" @keydown.esc="resetMode">
			<section class="controls flex">
				<img src="./img/mail/back.png" title="Go back" @click="goBack"/>
				<img src="./img/mail/reply.svg" title="Reply"/>
				<img src="./img/mail/trash.png" title="Delete" @click="remove(mail)"/>
				<img src="./img/mail/unread.png" :title="markAs"/>
				<img src="./img/mail/fullscreen.svg" @click.stop="goTo(mail)"/>
			</section>
			<section class="mail">
				<img src="./img/mail/profile.png">
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
                        <button @click="quickReply"><img src="./img/mail/reply.png"><p>Replay</p></button>
                        <button @click="quickReply"><img src="./img/mail/reply-all.png"><p>Replay all</p></button>
                        <button @click="quickForward"><img src="./img/mail/forward.png"><p>Forward</p></button>
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
		remove(mail) {
			eventBus.$emit('mailRemove', mail);
			this.$router.go(-1);
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
