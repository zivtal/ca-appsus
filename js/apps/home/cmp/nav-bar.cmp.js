export default {
	props: [],
	components: {},
	template: `
	<nav class="navbar-container flex">
		<img @click="homePage" src="./img/logo.png" class="main-logo">
		<img src="./img/burger.svg" @click="openMenu" class="menu-burger" />
		<div class="apps-menu flex" v-if="isMenuOpen">
			<a @click="booksPage"><img src="./img/books.png" /> </a>
			<a @click="emailPage"> <img src="./img/gmail.png" /> </a>
			<a @click="notePage"> <img src="./img/keep.png" /> </a>
</div>
</nav>
    `,
	data() {
		return {
			isMenuOpen: false
		};
	},
	created() { },
	updated() { },
	destroyed() { },
	methods: {
		openMenu() {
			this.isMenuOpen = !this.isMenuOpen;
		},
		notePage() {
			this.$router.push('/note/');
			this.openMenu();
		},
		emailPage() {
			this.$router.push('/mail/');
			this.openMenu();
		},
		booksPage() {
			this.$router.push('/book/');
			this.openMenu();
		},
		homePage() {
			this.$router.push('/');
		}
	},
	computed: {},
	watch: {}
};
