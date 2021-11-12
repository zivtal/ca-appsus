import { booksView } from "../apps/book/cmp/books-view.cmp.js";
import { bookReview } from "../apps/book/cmp/book-review.cmp.js";
import { googleBook } from "../apps/book/cmp/googlebook-app.cmp.js";

export default {
    props: [],
    components: {
        booksView,
        bookReview,
        googleBook,
    },
    template: `
        <section class="main-app">
            <books-view v-if="!isSearch && !book"/>
            <book-review v-else-if="book"/>
            <google-book v-else :text="search" />
        </section>
    `,
    data() {
        return {
            book: null,
            isSearch: false,
            search: null,
        }
    },
    watch: {
        '$route.params.bookId': {
            handler(get) {
                this.book = get;
            },
            immediate: true,
        },
        '$route.query.search': {
            handler(get) {
                this.search = get;
                this.isSearch = (get !== undefined);
            },
            immediate: true,
        }
    },
}