export const mailCompose = {
    props: ['send'],
    components: {},
    template: `
        <div v-if="mail" class="mail-compose">
            <div class="window" :class="windowSize">
                <div class="title">
                    <span class="text">New Message</span>
                    <span class="close" @click="mail = null">×</span>
                    <span class="maximized" @click.stop="isMaximaized = !isMaximaized">
                        <img src="./apps/mail/img/expand_window.png"/>
                    </span>
                </div>
                <section class="content">
                    <div><input type="text" placeholder="From"/></div>
                    <div><input type="text" placeholder="To" /></div>
                    <div><input type="text" placeholder="Subject" /></div>
                    <div><textarea></textarea></div>
                </section>
                <div class="buttons">
                    <button type="submit">Send</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            mail: true,
            isMaximaized: false,
        }
    },
    created() { },
    updated() { },
    destroyed() { },
    methods: {},
    computed: {
        windowSize() {
            return { maximaized: this.isMaximaized };
        }
    },
    watch: {},
}