const routes = [
	{
		path: '/',
		component: homePage
	},
	{
		path: '/mail',
		component: aboutPage
	},
	{
		path: '/note',
		component: bookApp
	}
];

export const router = new VueRouter({ routes });
