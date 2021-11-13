import { mailService } from '../apps/mail/services/email-app.service.js';
import { utilService } from '../services/utils.service.js';
import { eventBus } from '../services/event.bus-service.js';
import { mailList } from '../apps/mail/cmp/mail-list.cmp.js';
import { folderList } from '../apps/mail/cmp/mail-folderlist.cmp.js';
import { mailFullscreen } from '../apps/mail/cmp/mail-fullscreen.js';
import { mailCompose } from '../apps/mail/cmp/mail-compose.cmp.js';
import { mailEditor } from "../apps/mail/cmp/mail-richeditor.cmp.js";

export default {
	props: [],
	components: {
		eventBus,
		folderList,
		mailList,
		mailFullscreen,
		mailCompose,
		mailEditor,
	},
	template: `
		<section class="mail-app main-app">
			<section class="search-bar">
			</section>
			<section v-if="mails.all" class="display flex">
				<folder-list :folders="mails.folders" :active="active.folder" :unread="mails.unread" @change="folderChange" :key="updated"/>
				<mail-fullscreen v-if="active.mail" :mail="active.mail"  @remove="remove" @save="save"/>
				<mail-list v-else-if="mails.filtered" :mails.sync="mails.filtered" :folder="active" @remove="remove" @star="star"/>
			</section>
			<mail-compose v-if="compose" :data="compose" />
			<!-- <mail-editor/> -->
		</section>
    `,
	data() {
		return {
			id: null,
			updated: Date.now(),
			active: {
				folder: null,
				sort: {
					date: true,
					subject: false,
				},
				mail: null,
			},
			mails: {
				all: null,
				filtered: null,
				display: null,
				folders: ['All', 'Inbox', 'Sent', 'Draft'],
				unread: {},
			},
			compose: null,
		};
	},
	created() {
		mailService.query()
			.then(mails => {
				this.mails.all = mails;
				eventBus.$on('mailSave', this.save);
				eventBus.$on('mailStarred', this.star);
				eventBus.$on('mailRemove', this.remove);
				eventBus.$on('mailRestore', this.restore);
				eventBus.$on('mailComposeClose', () => this.compose = null);
			})
			.catch(err => console.log(err));
	},
	updated() { },
	destroyed() { },
	methods: {
		folderChange(active) {
			this.active.folder = active;
		},
		splicer(mail, mails) {
			const idx = mails.findIndex(item => item === mail);
			if (idx > -1) mails.splice(idx, 1);
		},
		remove(mail) {
			if (mail.folder === 'trash') {
				mailService.remove(mail.id)
					.then(() => {
						this.splicer(mail, this.mails.filtered);
						this.splicer(mail, this.mails.all);
						this.refresh();
					})
					.catch(err => console.log(err));
			} else {
				mail.restore = mail.folder;
				mail.folder = 'trash';
				mailService.save(mail)
					.then(() => {
						if (this.active.folder !== 'all') this.splicer(mail, this.mails.filtered);
						this.refresh();
					})
					.catch(err => console.log(err));
			}
		},
		restore(mail) {
			mail.folder = mail.restore;
			mail.restore = null;
			mailService.save(mail)
				.then(() => this.$router.go(-1))
				.catch(err => console.log(err));
		},
		star(mail) {
			mail.isStarred = !mail.isStarred;
			mailService.save(mail)
				.then(() => this.refresh())
				.catch(err => console.log(err));
		},
		save(mail) {
			mailService.save(mail)
				.then(save => {
					eventBus.$emit('mailDraftId', save.id);
					const index = this.mails.all.findIndex(item => item.id === save.id);
					if (index < 0) { this.mails.all.push(save) } else { this.mails.all[index] = save };
					this.refresh();
				})
				.catch(err => console.log(err));
		},
		refresh() {
			const folders = this.mails.folders;
			const other = this.mails.all.filter(item => !folders.includes(utilService.camelCaseToSentence(item.folder)));
			other.forEach(item => {
				if (!folders.includes(utilService.camelCaseToSentence(item.folder))) folders.push(utilService.camelCaseToSentence(item.folder));
			});
			this.mails.folders.forEach((folder, idx) => {
				const count = this.mails.all.filter(item => (idx) ? item.folder === folder.toLowerCase() && !item.isRead : !item.isRead).length;
				this.mails.unread[folder] = count;
			});
			this.active.folder = (this.$route.params.folder) ? this.$route.params.folder : 'inbox';
			this.active.mail = (this.$route.query.id) ? this.mails.all.find(item => item.id === this.$route.query.id) : null;
			this.updated = Date.now();
		}
	},
	computed: {},
	watch: {
		active: {
			handler(active) {
				if (this.mails.all) {
					const all = (!active.folder || this.mails.folders[0].toLowerCase() === active.folder);
					this.mails.filtered = (all) ? this.mails.all : this.mails.all.filter(item => item.folder === active.folder);
				}
				if (this.mails.filtered && !this.active.maill) {
					const sort = active.sort;
				}
			},
			deep: true,
		},
		mails: {
			handler(mails) {
				if (mails.all) this.refresh();
			},
			deep: true,
			immediate: true,
		},
		'$route.query.compose': {
			handler(get) {
				if (get === null) {
					const mail = mailService.getEmptyMail();
					mail.id = utilService.makeId();
					mail.to = this.$route.query.to || null;
					mail.subject = this.$route.query.subject || null;
					mail.body = this.$route.query.body || null;
					this.compose = mail;
				} else if (get) {
					mailService.getById(get)
						.then(mail => this.compose = (mail) ? mail : null);
				}
			},
			immediate: true,
		},
		'$route.params.folder': {
			handler(get) {
				this.active.folder = this.mails.all && get ? get : null;
			},
			immediate: true,
		},
		'$route.query.id': {
			handler(get) {
				this.active.mail = (this.$route.params.folder && this.mails.all && get) ? this.mails.all.find(item => item.id === get) : null;
			},
			immediate: true,
		}
	}
};
