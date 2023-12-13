import type { PageServerLoad } from './$types';

type imprint = {
	text: string;
};

export const load = (async ({}) => {
	try {
		//const text:string = 'hier ist Text';
		const url: string = 'http://localhost:3000' + '/api/v1/imprint';
		const response = await fetch(url);
		const responseObject: imprint = await response.json();
		const imprintText: string = responseObject.text;
		console.log(responseObject.text);

		return {
			text: imprintText
		};
	} catch (error) {}
}) satisfies PageServerLoad;
