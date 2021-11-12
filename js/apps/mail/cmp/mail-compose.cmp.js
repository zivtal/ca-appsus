import { eventBus } from "../../../services/event.bus-service.js";

export const mailCompose = {
    props: ['data'],
    components: {},
    template: `
        <div v-if="mail" class="mail-compose">
            <div class="window" :class="windowSize">
                <div class="title">
                    <span class="text">New Message</span>
                    <span class="close" @click="cancel">×</span>
                    <span class="maximized" @click.stop="isMaximaized = !isMaximaized">
                        <img src="./img/mail/expand_window.png"/>
                    </span>
                </div>
                <section class="content">
                    <div><input type="text" placeholder="From" v-model="mail.from" readonly/></div>
                    <div><input type="text" placeholder="To" v-model="mail.to"/></div>
                    <div><input type="text" placeholder="Subject" v-model="mail.subject"/></div>
                    <div><textarea v-model="mail.body"></textarea></div>
                </section>
                <div class="buttons">
                    <button type="submit" @click="send">Send</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            mail: null,
            mail: true,
            isMaximaized: false,
        }
    },
    created() {
        this.mail = this.data;
        this.mail.from = "zivtal@appsus.com";
        this.interval = setInterval(() => {
            this.mail.sentAt = Date.now();
            if (this.mail.body) eventBus.$emit('mailSave', this.mail);
        }, 5000);
    },
    updated() { },
    destroyed() { },
    methods: {
        cancel() {
            clearInterval(this.interval);
            this.mail = null;
            eventBus.$emit('mailComposeClose');
            this.$router.go(-1);
        },
        send() {
            clearInterval(this.interval);
            this.mail.folder = 'sent';
            this.mail.reply = null;
            this.mail.sentAt = Date.now();
            eventBus.$emit('mailSave', this.mail);
            this.mail = null;
            this.$router.go(-1);
        }
    },
    computed: {
        windowSize() {
            return { maximaized: this.isMaximaized };
        }
    },
    watch: {},
}