export const folderList = {
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
