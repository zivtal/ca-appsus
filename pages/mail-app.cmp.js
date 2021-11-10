import { mailService } from "../apps/mail/js/services/email-app.service.js";
import { utilService } from "../services/utils.service.js";
import { mailList } from "../apps/mail/js/cmp/mail-list.cmp.js";
import { folderList } from "../apps/mail/js/cmp/mail-folderlist.cmp.js";
import { mailFullscreen } from "../apps/mail/js/cmp/mail-fullscreen.js";

export default {
	props: [],
	components: {
		folderList,
		mailList,
		mailFullscreen,
	},
	template: `
		<section class="mail-app main-app">
			<section class="search-bar">

			</section>
			<section v-if="mails.all" class="display flex">
				<folder-list :folders="mails.folders" :active="active.folder" :unread="mails.unread" @change="folderChange"/>
				<mail-fullscreen v-if="active.mail" :mail="active.mail"  @remove="remove"/>
				<mail-list v-else :mails="mails.filtered" :folder="active" :key="refresh" @remove="remove" @star="star"/>
			</section>
		</section>
    `,
	data() {
		return {
			id: null,
			active: {
				folder: null,
				filter: null,
				sort: null,
				mail: null,
			},
			mails: {
				all: null,
				filtered: null,
				display: null,
				folders: ['All', 'Inbox', 'Sent', 'Draft', 'Trash'],
				unread: {},
			},
			refresh: Date.now(),
		};
	},
	created() {
		mailService.query()
			.then(mails => {
				this.mails.all = mails
				// check for more folders
				const folders = this.mails.folders;
				const other = this.mails.all.filter(item => !folders.includes(item.folder));
				other.forEach(item => { if (!folders.includes(item.folder)) folders.push(item.folder); });
				this.active.folder = 'Inbox';
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
			if (mail.folder === 'Trash') {
				mailService.remove(mail.id)
					.then(() => splicer(mail, this.mails))
					.catch(err => console.log(err));
			} else {
				mail.folder = 'Trash';
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
				const all = (!active.folder || this.mails.folders[0] === active.folder);
				this.mails.filtered = (all) ? this.mails.all : this.mails.all.filter(item => item.folder === active.folder);
			},
			deep: true,
		},
		'$route.params.folder': {
			handler(get) {
				console.log(get);
				if (get) {
					const idx = this.mails.folders.findIndex(folder => folder.toLowerCase() === get.toLowerCase());
					this.active.folder = this.mails.folders[idx];
				}
			},
			immediate: true,
		},
		'$route.query.id': {
			handler(get) {
				this.active.mail = (get) ? this.mails.all.find(item => item.id === get) : null;
			},
			immediate: true,
		}
	}
};
