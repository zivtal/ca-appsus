import homePage from '../../pages/home-page.cmp.js';
import mailPage from '../../pages/mail-app.cmp.js';
import notePage from '../../pages/note-app.cmp.js';

const routes = [
	{
		path: '/',
		component: homePage
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
		path: '/mail/folder',
		component: mailPage,
		props: route => ({ query: router.query.id })
	},
	{
		path: '/note',
		component: notePage
	}
];

export const router = new VueRouter({ routes });
