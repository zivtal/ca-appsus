
function setCursor(el, pos) {
    var tag = document.getElementById("compose-editor");

    // Creates range object
    var setpos = document.createRange();

    // Creates object for selection
    var set = window.getSelection();

    // Set start position of range
    setpos.setStart(tag.childNodes[0], pos);

    // Collapse range within its boundary points
    // Returns boolean
    setpos.collapse(true);

    // Remove all ranges set
    set.removeAllRanges();

    // Add range with respect to range object.
    set.addRange(setpos);

    // Set cursor on focus
    tag.focus();
}

export const mailEditor = {
    props: [],
    components: {},
    template: `
    <div class="mail-editor">
        <div contenteditable id="compose-editor" v-html="html" @input="update($event.target)" style="height:500px"></div>
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
            setCursor(el, 3);
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