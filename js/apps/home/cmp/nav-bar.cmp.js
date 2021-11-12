export default {
	props: [],
	components: {},
	template: `
	<nav class="navbar-container flex">
		<a @click="homePage"> 
			<img src="imgs/newlogo.png" class="main-logo">
</a>
		<img src="imgs/burger.svg" @click="openMenu" class="menu-burger" />
		<div class="apps-menu flex" v-if="isMenuOpen">
			<a @click="booksPage"><img src="imgs/books.png" /> </a>
			<a @click="emailPage"> <img src="imgs/gmail.png" /> </a>
			<a @click="notePage"> <img src="imgs/keep.png" /> </a>
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
