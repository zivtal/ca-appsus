import { utilService } from "../services/utils.service.js";

const getFolder = {
	props: ['folder'],
	template: `<div @click="$emit('change',folder)">{{folder}}</div>`,
}

const folderList = {
	props: ['folders'],
	components: {
		getFolder,
	},
	template: `
		<section class="mail-folder flex columns">
			<template v-for="folder in folders">
				<get-folder :class="{selected: folder === active}" :folder="folder" @change="folderChange"></get-folder>
			</template>
		</section>
	`,
	data() {
		return {
			active: 'Inbox',
		}
	},
	methods: {
		folderChange(activeFolder) {
			this.active = activeFolder;
			console.log(this.active);
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
			</section>
		</section>
	`,
}

export default {
	props: [],
	components: {
		folderList,
	},
	template: `
		<section class="mail-app flex">
			<folder-list :folders="folders"/>

			<section class="mail-list">
				<section class="controls">controls</section>
				<section class="list flex columns">
					<section class="preview flex">
						<div class="star">X</div>
						<div class="content"><p>content</p></div>
						<div class="date"><p>date</p></div>
						<div class="controls flex">kkk</div>
					</section>
				</section>
			</section>
		</section>
    `,
	data() {
		return {
			mails: null,
			folders: ['All', 'Inbox', 'Sent', 'Drafts', 'Trash'],
		};
	},
	created() {
		this.mails = utilService.createDemo('')
	},
	updated() { },
	destroyed() { },
	methods: {},
	computed: {},
	watch: {}
};
