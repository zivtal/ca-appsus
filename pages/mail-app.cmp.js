import { utilService } from "../services/utils.service.js";

const getFolder = {
	props: ['folder'],
	template: `<div @click="$emit('change',folder)">{{folder}}</div>`,
}

const folderList = {
	props: ['folders', 'active'],
	components: {
		getFolder,
	},
	template: `
		<section class="mail-folder flex columns">
			<template v-for="folder in folders">
				<get-folder :class="{selected: folder === activeFolder}" :folder="folder" @change="folderChange"></get-folder>
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
		<section class="preview flex">
			<div class="star">X</div>
			<div class="content"><p>content</p></div>
			<div class="date"><p>date</p></div>
			<div class="controls flex">kkk</div>
		</section>
	`
}

const mailList = {
	props: ['mails'],
	components: {
		mailPreview,
	},
	template: `
		<section class="mail-list">
			<section class="controls">controls</section>
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
		<section class="mail-app flex">
			<folder-list :folders="mails.folders" :active="active" @change="folderChange"/>
			<mail-list :mails="mails.filtered" :folder="active"/>
		</section>
    `,
	data() {
		return {
			active: null,
			mails: {
				all: null,
				filtered: null,
				display: null,
				folders: ['All', 'Inbox', 'Sent', 'Draft'],
			},
		};
	},
	created() {
		this.active = 'Inbox';
		this.mails.all = utilService.createDemo('../json/emails.json');
		const folders = this.mails.folders;
		const other = this.mails.all.filter(item => !folders.includes(item.folder));
		other.forEach(item => { if (!folders.includes(item.folder)) folders.push(item.folder); });
	},
	updated() { },
	destroyed() { },
	methods: {
		folderChange(active) {
			this.active = active;
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
				this.mails.filtered = this.mails.all.filter(item => item.folder === active);
				console.log(this.mails.filtered);
			},
			deep: true,
		},
	}
};
