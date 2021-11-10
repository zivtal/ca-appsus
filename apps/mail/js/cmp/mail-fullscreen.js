import { mailService } from "../services/email-app.service.js";

export const mailFullscreen = {
	props: ['mail'],
	template: `
		<section class="mail-read">
			<section class="controls flex">
				<img src="apps/mail/img/back.png"  @click="goBack"/>
				<img src="apps/mail/img/reply.svg" />
				<img src="apps/mail/img/trash.png" @click="$emit('remove',mail)"/>
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
                    <div class="actions">
                        <button><img src="./apps/mail/img/reply.png"><p>Replay</p></button>
                        <button><img src="./apps/mail/img/reply-all.png"><p>Replay all</p></button>
                        <button><img src="./apps/mail/img/forward.png"><p>Forward</p></button>
                    </div>
                </section>
			</section>
		</section>
	`,
	methods: {
		goBack() {
			this.$router.go(-1);
		},
	},
	computed: {
		tagForDisplay() {
			return mail.folder;
		},
	}
}
