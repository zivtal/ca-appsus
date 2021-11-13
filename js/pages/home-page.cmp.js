export default {
	template: `
        <section class="home-page main-app flex align-center columns">
			<h1 class="home-page-title">AppSus - Take Your Productivity To The Highest Level</h1>
			<section class="apps-cards flex">
				<article class="box-app flex">
					<img src="./img/gmail.png" />
					<div>
						AppSus Email-service' offers the most fast and qualified Email-Services these days, 
						makes it easier for you to manage your emails. 
					</div> 
					<button class="default-button" @click="goToMail">Try it now</button>
				</article>
				<article class="box-app flex">
					<img src="./img/keep.png" />
					<div>
						Manage your thoughts, and lists with AppSus' Keep-Service,
						our service supports videos and pictures to be kept.
					</div> 
					<button class="default-button" @click="goToKeep">Try it now</button>
				</article>
				<article class="box-app flex">
					<img src="./img/books.png">
					<div>
						Manage your books with AppSus' Books-Service!
					</div>
					<button class="default-button" @click="goToBook">Try it now</button>
				</article>
			</section>
		</section>
    `,
	methods: {
		goToMail() {
			this.$router.push({ path: `/mail` });
		},
		goToKeep() {
			this.$router.push({ path: `/note` });
		},
		goToBook() {
			this.$router.push({ path: `/book` });
		},
	}
};
