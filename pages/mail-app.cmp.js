import { mailService } from "../apps/mail/js/services/email-app.service.js";
import { utilService } from "../services/utils.service.js";

const folderList = {
	props: ['folders', 'active', 'unread'],
	template: `
		<section class="mail-folder flex columns">
			<button class="flex align-center"><img src="./apps/mail/img/compose.png"/><p>Compose</p></button>
			<template v-for="folder in folders">
				<div @click="folderChange(folder)" :class="{selected: folder === activeFolder}"><span class="title">{{folder}}</span><span class="number">{{unread[folder]}}</span></div>
			</template>
		</section>
	`,
	data() {
		return {
			activeFolder: this.active,
		}
	},
	created() {
		console.log(this.active);
	},
	methods: {
		folderChange(activeFolder) {
			this.activeFolder = activeFolder;
			this.$router.push({ path: `/mail/${activeFolder.toLowerCase()}` });
		}
	},
}

const mailPreview = {
	props: ['mail'],
	template: `
	<div>
		<section class="preview flex" :class="{unread:!mail.isRead}" @click="toggleExtended" @mouseover="mouseOver" @mouseleave="mouseLeave">
			<div class="star" @click.stop="mail.isStarred = !mail.isStarred">
				<img v-if="mail.isStarred" src="./apps/mail/img/star-active.svg"/>
				<img v-if="!mail.isStarred" src="./apps/mail/img/star-disabled.svg"/>
			</div>
			<div class="content"><p>{{mail.subject}}</p></div>
			<div v-if="!controls" class="date"><p>{{sent}}</p></div>
			<div v-if="controls" class="controls flex">
				<img src="apps/mail/img/reply.svg"/>
				<img src="apps/mail/img/trash.png" @click.stop="$emit('remove',mail)"/>
				<img src="apps/mail/img/unread.png"/>
				<img src="apps/mail/img/fullscreen.svg" @click.stop="goTo(mail)"/>
			</div>
		</section>
		<transition name="slide-fade">
			<section v-if="extended" class="preview-extended">
				{{mail.body}}
			</section>
		</transition>
	</div>
	`,
	data() {
		return {
			extended: false,
			controls: false,
		}
	},
	methods: {
		mouseOver() {
			this.controls = true;
		},
		mouseLeave() {
			this.controls = false;
		},
		toggleExtended() {
			this.extended = !this.extended;
		},
		goTo(mail) {
			this.$router.push({ path: `/mail/${mail.folder.toLowerCase()}/${mail.id}` });
		}
	},
	computed: {
		star() {
			return (this.mail.isStarred) ? '*' : '';
		},
		sent() {
			return utilService.getTimeFormat(this.mail.sentAt);
		}
	},
}

const mailList = {
	props: ['mails'],
	components: {
		mailPreview,
	},
	template: `
		<section class="mail-list">
			<section class="controls">
				<button>Read/Unread</button>
				<button>Starred/Unstarred</button>
				<button>Date</button>
				<button>Subject</button>
			</section>
			<section class="list flex columns">
				<template v-for="mail in mails">
					<mail-preview :mail="mail" @remove="removeMail"/>
				</template>
			</section>
		</section>
	`,
	methods: {
		removeMail(mail) {
			mailService.remove(mail.id)
				.then(this.$emit('remove', mail))
				.catch(err => console.log(err));
		}
	}
}

const mailFullscreen = {
	props: ['mail'],
	template: `
		<section class="mail-read">
			<section class="controls flex">
				<button @click="goBack"> < Back </button>
				<img src="apps/mail/img/reply.svg"/>
				<img src="apps/mail/img/trash.png" @click.stop="$emit('remove',mail)"/>
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
				<section>

			</section>
		</section>
	`,
	methods: {
		goBack() {
			console.log('k');
			this.$router.push(`/mail/${this.mail.folder}`);
		},
	},
	computed: {
		tagForDisplay() {
			return mail.folder;
		},
	}
}

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
				<mail-fullscreen v-if="active.mail" :mail="active.mail" />
				<mail-list v-else :mails="mails.filtered" :folder="active" :key="refresh" @remove="remove"/>
			</section>
		</section>
    `,
	data() {
		return {
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
				folders: ['All', 'Inbox', 'Sent', 'Draft'],
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
			const idx = this.mails.filtered.findIndex(item => item === mail);
			this.mails.filtered.splice(idx, 1);
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
				const all = (this.mails.folders[0] === active.folder);
				this.mails.filtered = (all) ? this.mails.all : this.mails.all.filter(item => item.folder === active.folder);
			},
			deep: true,
		},
		mails: {
			handler(mails) {
				const all = this.mails.all;
				mails.folders.forEach((folder, idx) => {
					const count = all.filter(item => (idx) ? item.folder === folder && !item.isRead : !item.isRead).length;
					this.mails.unread[folder] = count;
				});
			},
			deep: true,
		},
		'$route.params': {
			handler(get) {
				if (get.folder) {
					const idx = this.mails.folders.findIndex(folder => folder.toLowerCase() === get.folder.toLowerCase());
					this.active.folder = this.mails.folders[idx];
				}
				this.active.mail = (get.mailId) ? this.mails.all.find(item => item.id === get.mailId) : null;
			},
			immediate: true,
		},
	}
};
