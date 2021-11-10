const options = {
	el: '#app',
	router,
	template: `
	<section>
		<user-msg />
		<headerApp />
		<router-view /> 
	</section>
    `,
	components: {
		bookApp,
		headerApp,
		userMsg
	}
};

new Vue(options);
