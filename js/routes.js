import homePage from './pages/home-page.cmp.js';
import bookPage from './pages/book-page.cmp.js';
import mailPage from './pages/mail-app.cmp.js';
import notePage from './pages/note-app.cmp.js';

const routes = [
	{
		path: '/',
		component: homePage
	},
	{
		path: '/book',
		component: bookPage
	},
	{
		path: '/book/:bookId',
		component: bookPage
	},
	{
		path: '/mail',
		component: mailPage
	},
	{
		path: '/mail/:folder?',
		component: mailPage,
	},
	{
		path: '/note',
		component: notePage
	}
];

export const router = new VueRouter({ routes });
