import { utilService } from "../../../services/utils.service.js";

function setCaret(el) {
    const range = document.createRange()
    const selection = window.getSelection()
    const last = el.childNodes.length - 1;
    range.setStart(el.childNodes[last], 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

export const mailEditor = {
    props: [],
    components: {},
    template: `
        <div class="mail-compose">
            <div class="window">
            <!-- <div class="window" :class="windowSize">
                <div class="title">
                    <span class="text">New Message</span>
                    <span class="close" @click="cancel">×</span>
                    <span class="maximized" @click.stop="isMaximaized = !isMaximaized">
                        <img src="./img/mail/expand_window.png"/>
                    </span>
                </div> -->
                <section class="content">
                    <!-- <div><input type="text" placeholder="From" v-model="mail.from" readonly/></div>
                    <div><input type="text" placeholder="To" v-model="mail.to"/></div>
                    <div><input type="text" placeholder="Subject" v-model="mail.subject"/></div> -->
                    <div class="style-control">
                        <button>Bold</button>
                    </div>
                    <div contenteditable id="compose-editor" innerHTML="<span>" @key.enter.stop="cosole.log" @keydown.stop="update($event.target,$event.key)" style="height:500px"></div>
                </section>
                <div class="buttons">
                    <!-- <button type="submit" @click="send">Send</button> -->
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            html: '<div>',
        }
    },
    created() { },
    updated() { },
    destroyed() { },
    methods: {
        update(el, key) {
            console.log(key);
            this.html = '<span style="color:red">' + el.innerHTML + '</span>';
            el.innerHTML = this.html;
            // utilService.setCaretPosition(el);
            setCaret(el);
        }
    },
    computed: {},
    watch: {
        html: {
            handler(newVal, oldVal) {
                // console.log(newVal, oldVal);
            }
        }
    },
}