import { modalService } from "../service/popup-modal.service.js";

const textBox = {
    props: ['data'],
    template: `<input :id="data.key" :type="data.type" v-model="data.value" autocomplete="off" />`,
};

const textArea = {
    props: ['data'],
    template: `<textarea :id="data.key" v-model="data.value" ></textarea>`,
};

const selectBox = {
    props: ['data'],
    template: `
        <select :id="data.key" v-model="data.value">
            <option v-for="(option,idx) in data.options" :value="option">{{ options[idx] }}</option>
        </select>
    `,
    created() {
        this.options = this.data.options;
        if (this.data.symbol) this.options = this.options.map(option => this.data.symbol.repeat(option));
    },
};

const modalField = {
    props: ['data'],
    components: {
        textBox,
        textArea,
        selectBox,
    },
    template: `
        <div class="field" :class="fieldClass">
            <template v-if="!data.component">
                {{data.value}}
            </template>
            <template v-else>
                <label :class="labelClass" :for="data.key">{{data.title}}:</label>
                <component :is="data.component" :data="data" @setInput="setInput($event, idx)"></component>
            </template>
        </div>
    `,
    computed: {
        fieldClass() {
            return { doublecol: this.data.component === 'textArea' };
        },
        labelClass() {
            return { warning: this.data.isFailed };
        },
    },
}

const modalPreview = {
    props: ['data'],
    template: `
        <div v-if="!data.isImage" v-for="data in content" :key="data.key"><span class="label">{{data.title}}:\t</span>{{data.value}}</div>
        <img v-else :src="data.value"/>
    `,
    created() {
    }
}

export default {
    props: ['settings'],
    components: {
        modalField,
        modalPreview,
    },
    template: `
        <div v-if="content" class="popup-modal" @keydown.esc="onCancel">
            <div class="window" @click.stop="">
                <div class="title">
                    <span class="text">{{title}}</span>
                    <span type="button" class="close" @click="onCancel">×</span>
                </div>
                <div>
                    <!-- preview mode -->
                    <div v-if="isPreview" class="preview">
                        <!-- <div v-if="!data.isImage" v-for="data in content" :key="data.key"><span class="label">{{data.title}}:\t</span>{{data.value}}</div>
                        <img v-else :src="data.value"/> -->
                        <img :src="item.thumbnail"/>
                        <div><span class="label">Title:\t</span>{{item.title}}</div>
                        <div><span class="label">Subtitle:\t</span>{{item.subtitle}}</div>
                        <div><span class="label">Authors:\t</span>{{getAuthors}}</div>
                        <div :class="yearStyle"><span class="label">Year:\t</span>{{item.publishedDate}}</div>
                        <div><span class="label">Description:\t</span>{{getDescription}}</div>
                        <div :class="pageStyle"><span class="label">Total Pages:\t</span>{{item.pageCount}}</div>
                        <div><span class="label">Categories:\t</span>{{getCategories}}</div>
                        <div :class="priceStyle"><span class="label">Price:\t</span>{{item.listPrice.amount}} {{item.listPrice.currencyCode}}</div>
                    </div>
                    <!-- edit mode -->
                    <form v-else :class="formStyle" @submit.stop.prevent="onSubmit" :key="refresh">
                        <modal-field v-for="data in content" :data="data" :key="data.key"></modal-field>
                    </form>
                </div>
                <div class="buttons">
                        <button v-if="yes" class="yes" type="submit" @click.stop.prevent="onSubmit">{{yes}}</button>
                        <button v-if="no" class="no" @click.stop.prevent="onCancel">{{no}}</button>
                    </div>
            </div>
        </div>
    `,
    created() {
        this.no = null;
        this.yes = null;
        this.item = null;
        this.refresh = Date.now();
        for (const key in this.settings) {
            const value = this.settings[key];
            this[key] = value;
        }
        const hiddenKeys = (this.action === "preview") ? ['id', 'isOnSale'] : ['id'];
        const requiredKeys = ['title'];
        this.reStructure(hiddenKeys, requiredKeys);
    },
    methods: {
        reStructure(hiddenKeys = [], requiredKeys = []) {
            if (!this.content) this.content = modalService.load(this.item, hiddenKeys, requiredKeys);
            this.content.forEach(item => {
                if (!item.title && item.key) item.title = modalService.title([item.key]);
            });
        },
        onSubmit() {
            switch (this.action) {
                case 'add':
                case 'modify':
                    if (modalService.check(this.content)) {
                        const copy = modalService.save(this.item, this.content);
                        this.$emit('yes', (this.action) ? this.action : null, copy);
                    } else this.refresh = Date.now();
                    break;
                case 'review':
                    if (modalService.check(this.content)) {
                        const item = modalService.save({}, this.content);
                        this.$emit('yes', (this.action) ? this.action : null, this.item, item);
                    } else this.refresh = Date.now();
                    break;
                default:
                    this.$emit('yes', (this.action) ? this.action : null, this.item || null);
                    break;
            }
        },
        onCancel() {
            this.$emit('no');
        },
    },
    computed: {
        formStyle() {
            return { 'large': this.content.some(item => item.component === 'textArea') }
        },
        isPreview() {
            return (this.action === 'preview');
        },
        // ex
        getAuthors() {
            return Array(this.item.authors).join();
        },
        getCategories() {
            return Array(this.item.categories).join();
        },
        getDescription() {
            if (!desc) return;
            var desc = this.item.description;
            desc = desc.split(' ')
            desc = desc.splice(0, 10).join(' ') + ' ... (read more)';
            return desc;
        },
        pageStyle() {
            return { 'long-reading': this.item.pageCount > 500, 'descent-reading': this.item.pageCount < 500 && this.item.pageCount > 200, 'light-reading': this.item.pageCount < 100 }
        },
        yearStyle() {
            const year = new Date().getFullYear();
            return { 'veteran-book': year - this.item.publishedDate > 10, 'new-book': year - this.item.publishedDat < 1 }
        },
        priceStyle() {
            return { 'on-sale': this.item.listPrice.isOnSale };
        }
    }
};
