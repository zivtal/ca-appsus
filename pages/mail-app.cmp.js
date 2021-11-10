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
	methods: {
		folderChange(activeFolder) {
			this.activeFolder = activeFolder;
			this.$emit('change', this.activeFolder);
		}
	},
}

const mailPreview = {
	props: ['mail'],
	template: `
	<div>
		<section class="preview flex" :class="{unread:!mail.isRead}" @click="toggleExtended" @mouseover="controls = true" @mouseleave="controls = false">
			<div class="star">
				<img v-if="mail.isStarred" src="./apps/mail/img/star-active.svg"/>
				<img v-if="!mail.isStarred" src="./apps/mail/img/star-disabled.svg"/>
			</div>
			<div class="content"><p>{{mail.subject}}</p></div>
			<div v-if="!controls" class="date"><p>{{sent}}</p></div>
			<div v-if="controls" class="controls flex">
				<img src="apps/mail/img/reply.svg"/>
				<img src="apps/mail/img/trash.png"/>
				<img src="apps/mail/img/unread.png"/>
				<img src="apps/mail/img/fullscreen.svg"/>
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
		toggleExtended() {
			this.extended = !this.extended;
			console.log(this.extended);
		}
	},
	computed: {
		star() {
			return (this.mail.isStarred) ? '*' : '';
		},
		sent() {
			return utilService.getTimeFormat(this.mail.sentAt);
		}
	}
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
					<mail-preview :mail="mail" />
				</template>
			</section>
		</section>
	`,
}

export default {
	props: [],
	components: {
		folderList,
		mailList,
	},
	template: `
		<section class="mail-app">
			<section class="display flex">
				<folder-list :folders="mails.folders" :active="active.folder" :unread="mails.unread" @change="folderChange"/>
				<mail-list :mails="mails.filtered" :folder="active"/>
			</section>
		</section>
    `,
	data() {
		return {
			active: {
				folder: null,
				filter: null,
				sort: null,
			},
			mails: {
				all: null,
				filtered: null,
				display: null,
				folders: ['All', 'Inbox', 'Sent', 'Draft'],
				unread: {},
			},
		};
	},
	created() {
		this.active.folder = 'Inbox';
		this.mails.all = utilService.createDemo('../json/emails.json');
		// check for more folders
		const folders = this.mails.folders;
		const other = this.mails.all.filter(item => !folders.includes(item.folder));
		other.forEach(item => { if (!folders.includes(item.folder)) folders.push(item.folder); });
		// duplicated code - exists in watch but not working with 'immediate'.
		const all = this.mails.all;
		this.mails.folders.forEach((folder, idx) => {
			const count = all.filter(item => (idx) ? item.folder === folder && !item.isRead : !item.isRead).length;
			this.mails.unread[folder] = count;
		});
	},
	updated() { },
	destroyed() { },
	methods: {
		folderChange(active) {
			this.active.folder = active;
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
				this.mails.filtered = this.mails.all.filter(item => item.folder === active.folder);
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
	}
};
