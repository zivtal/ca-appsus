
function SetCaretPosition(el, pos) {
    // Loop through all child nodes
    for (var node of el.childNodes) {
        if (node.nodeType == 3) { // we have a text node
            if (node.length >= pos) {
                // finally add our range
                var range = document.createRange(),
                    sel = window.getSelection();
                range.setStart(node, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done
            } else {
                pos -= node.length;
            }
        } else {
            pos = SetCaretPosition(node, pos);
            if (pos == -1) {
                return -1; // no need to finish the for loop
            }
        }
    }
    return pos; // needed because of recursion stuff
}

export const mailEditor = {
    props: [],
    components: {},
    template: `
        <div class="mail-compose">
            <div class="window" :class="windowSize">
                <div class="title">
                    <span class="text">New Message</span>
                    <span class="close" @click="cancel">×</span>
                    <span class="maximized" @click.stop="isMaximaized = !isMaximaized">
                        <img src="./img/mail/expand_window.png"/>
                    </span>
                </div>
                <section class="content">
                    <!-- <div><input type="text" placeholder="From" v-model="mail.from" readonly/></div>
                    <div><input type="text" placeholder="To" v-model="mail.to"/></div>
                    <div><input type="text" placeholder="Subject" v-model="mail.subject"/></div> -->
                    <div class="style-control">
                        <button>Bold</button>
                    </div>
                    <div contenteditable id="compose-editor" @input="update($event.target)" style="height:500px"></div>
                </section>
                <div class="buttons">
                    <button type="submit" @click="send">Send</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            html: '',
        }
    },
    created() { },
    updated() { },
    destroyed() { },
    methods: {
        update(el) {
            this.html = '<span style="color:red">' + el.innerHTML;
            el.innerHTML = this.html;
            SetCaretPosition(el, el.innerText.length);
        }
    },
    computed: {},
    watch: {
        html: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal);
            }
        }
    },
}