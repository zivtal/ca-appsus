import { eventBus } from "../../../services/event.bus-service.js";

const ICONS = {
    all: 'all.png',
    inbox: 'inbox.png',
    sent: 'sent.png',
    draft: 'draft.png',
    trash: 'trash.png',
};

export const folderList = {
    props: ['folders', 'active', 'unread'],
    components: {
        eventBus,
    },
    template: `
		<section class="mail-folder flex columns">
			<button class="flex align-center" @click="compose"><img src="./img/mail/compose.png"/><p>Compose</p></button>
			<template v-for="folder in folders">
				<div @click="folderChange(folder)" :class="{selected: folder.toLowerCase() === activeFolder}">
                    <img :src="'./img/mail/' + getImage(folder)" />
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
    methods: {
        compose() {
            this.$router.push({ path: `/mail/?compose` })
        },
        getImage(folder) {
            return ICONS[folder.toLowerCase()] || 'default.png';
        },
        folderChange(activeFolder) {
            console.log('k');
            activeFolder = activeFolder.toLowerCase();
            this.activeFolder = activeFolder;
            this.$router.push({ path: `/mail/${activeFolder}` });
        }
    },
    watch: {
        '$route.params.folder': {
            handler(get) {
                this.activeFolder = (get) || 'inbox';
            },
            immediate: true,
        },
    }
}
