import { mailService } from "../apps/mail/js/services/email-app.service.js";
import { utilService } from "../services/utils.service.js";
import { eventBus } from "../services/event.bus-service.js";
import { mailList } from "../apps/mail/js/cmp/mail-list.cmp.js";
import { folderList } from "../apps/mail/js/cmp/mail-folderlist.cmp.js";
import { mailFullscreen } from "../apps/mail/js/cmp/mail-fullscreen.js";
import { mailCompose } from "../apps/mail/js/cmp/mail-compose.cmp.js";

export default {
	props: [],
	components: {
		eventBus,
		folderList,
		mailList,
		mailFullscreen,
		mailCompose,
	},
	template: `
		<section class="mail-app main-app">
			<section class="search-bar">
			</section>
			<section v-if="mails.all" class="display flex">
				<folder-list :folders="mails.folders" :active="active.folder" :unread="mails.unread" @change="folderChange"/>
				<mail-fullscreen v-if="active.mail" :mail="active.mail"  @remove="remove" @save="save"/>
				<mail-list v-else-if="mails.filtered" :mails="mails.filtered" :folder="active" :key="refresh" @remove="remove" @star="star"/>
			</section>
			<mail-compose />
		</section>
    `,
	data() {
		return {
			id: null,
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
			refresh: Date.now(),
		};
	},
	created() {
		mailService.query()
			.then(mails => {
				this.mails.all = mails;
				eventBus.$on('mailSave', this.save);
				eventBus.$on('mailRemove', this.remove);
			})
			.catch(err => console.log(err));
	},
	updated() { },
	destroyed() { },
	methods: {
		folderChange(active) {
			this.active.folder = active;
		},
		remove(mail) {
			const splicer = function (mail, mails) {
				const idx = mails.filtered.findIndex(item => item === mail);
				mails.filtered.splice(idx, 1);
			};
			if (mail.folder === 'trash') {
				mailService.remove(mail.id)
					.then(() => splicer(mail, this.mails))
					.catch(err => console.log(err));
			} else {
				mail.folder = 'trash';
				mailService.save(mail)
					.then(() => splicer(mail, this.mails))
					.catch(err => console.log(err));
			}
		},
		star(mail) {
			mail.isStarred = !mail.isStarred;
			mailService.save(mail)
				.then()
				.catch(err => console.log(err));
		},
		save(mail) {
			mailService.save(mail)
				.then(save => {
					eventBus.$emit('mailDraftId', save.id);
					const index = this.mails.all.findIndex(item => item.id === save.id);
					if (index < 0) { this.mails.all.push(save) } else { this.mails.all[index] = save };
				})
				.catch(err => console.log(err));
		}
	},
	computed: {
		numOfMails() {
			return this.mails.filtered.length;
		}
	},
	watch: {
		active: {
			handler(active) {
				if (this.mails.all) {
					const all = (!active.folder || this.mails.folders[0].toLowerCase() === active.folder);
					this.mails.filtered = (all) ? this.mails.all : this.mails.all.filter(item => item.folder === active.folder);
				}
				if (this.mails.filtered && !this.active.maill) {
					const sort = active.sort;
					// console.log(sort);
				}
			},
			deep: true,
		},
		mails: {
			handler(mails) {
				if (mails.all) {
					const folders = mails.folders;
					const other = mails.all.filter(item => !folders.includes(utilService.camelCaseToSentence(item.folder)));
					other.forEach(item => {
						if (!folders.includes(utilService.camelCaseToSentence(item.folder))) folders.push(utilService.camelCaseToSentence(item.folder));
					});
					mails.folders.forEach((folder, idx) => {
						const count = this.mails.all.filter(item => (idx) ? item.folder === folder.toLowerCase() && !item.isRead : !item.isRead).length;
						this.mails.unread[folder] = count;
					});
					this.active.folder = (this.$route.params.folder) ? this.$route.params.folder : 'inbox';
					this.active.mail = (this.$route.query.id) ? this.mails.all.find(item => item.id === this.$route.query.id) : null;
					eventBus.$emit('mailFolderChange', this.active.folder);
				}
			},
			deep: true,
			immediate: true,
		},
		'$route.params.folder': {
			handler(get, from) {
				this.active.folder = (this.mails.all && get) ? get : null;
				eventBus.$emit('mailFolderChange', this.active.folder);
			},
			immediate: true,
		},
		'$route.query.id': {
			handler(get) {
				this.active.mail = (this.mails.all && get) ? this.mails.all.find(item => item.id === get) : null;
			},
			immediate: true,
		}
	}
};
