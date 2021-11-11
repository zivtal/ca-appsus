import { eventBus } from "../../../../services/event.bus-service.js";

export const folderList = {
    props: ['folders', 'active', 'unread'],
    components: {
        eventBus,
    },
    template: `
		<section class="mail-folder flex columns">
			<button class="flex align-center"><img src="./apps/mail/img/compose.png"/><p>Compose</p></button>
			<template v-for="folder,idx in folders">
				<div @click="folderChange(folder)" :class="{selected: folder.toLowerCase() === activeFolder}">
                    <img :src="'./apps/mail/img/' + getImage(idx)" />
                    <span class="title">{{folder}}</span><span class="number">{{unread[folder]}}</span>
                </div>
			</template>
		</section>
	`,
    data() {
        return {
            activeFolder: this.active.toLowerCase(),
            index: 0,
        }
    },
    create() {
        eventBus.$on('mailFolderChange', console.log);
    },
    methods: {
        getImage(idx) {
            const imgs = ['all.png', 'inbox.png', 'sent.png', 'draft.png'];
            return (imgs[idx]) ? imgs[idx] : 'default.png';
        },
        folderChange(activeFolder) {
            console.log(activeFolder);
            activeFolder = activeFolder.toLowerCase();
            this.activeFolder = activeFolder;
            this.$router.push({ path: `/mail/${activeFolder}` });
        }
    },
}
