import { router } from './routes.js';
import footerPage from '../pages/cmp/footer-page.cmp.js';
import navBar from '../pages/cmp/nav-bar.cmp.js';

const options = {
	el: '#app',
	router,
	template: `
	<section>
		<nav-bar />
		<router-view /> 
		<footer-page />
	</section>
    `,
	components: {
		footerPage,
		navBar
	}
};

new Vue(options);
