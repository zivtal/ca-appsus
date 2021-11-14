import { quickReply } from "./mail-quickreply.cmp.js";
import { eventBus } from "../../../services/event.bus-service.js";
import { utilService } from "../../../services/utils.service.js";

export const mailFullscreen = {
	props: ['mail'],
	components: {
		quickReply,
	},
	template: `
		<section class="mail-read" @keydown.esc="resetMode">
			<section class="controls flex">
				<img src="./img/mail/back.png" title="Go back" @click="goBack"/>
				<img v-if="!mail.folder.includes('draft')" src="./img/mail/note.svg" title="Add to notes" @click="addToNotes"/>
				<img src="./img/mail/trash.png" :title="delTitle" @click="remove(mail)"/>
				<img v-if="mail.restore && mail.folder.includes('trash')" src="./img/mail/restore.png" title="Restore mail" @click.stop="restoreMail(mail)"/>
				<img :src="'./img/mail/'+markImg+'.png'" :title="markAs" @click="markRead(mail)"/>
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
                        <button @click="quickReply"><img src="./img/mail/reply.png"><p>Reply</p></button>
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
		},
		addToNotes() {
			this.$router.push({ path: `/note/?to=${this.mail.from}&title=${this.mail.subject}&txt=${this.mail.body}` });
		},
		markRead(mail) {
			mail.isRead = !mail.isRead;
			eventBus.$emit('mailSave', mail);
		},
		restoreMail(mail) {
			eventBus.$emit('mailRestore', mail);
		},
	},
	computed: {
		tagForDisplay() {
			return this.mail.folder;
		},
		markAs() {
			return (this.mail.isRead) ? 'Mark as unread' : "Mark as read";
		},
		markImg() {
			return (this.mail.isRead) ? 'read' : "unread";
		},
		delTitle() {
			return (this.mail.folder.includes('trash')) ? 'Delete forever' : 'Delete';
		},
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
