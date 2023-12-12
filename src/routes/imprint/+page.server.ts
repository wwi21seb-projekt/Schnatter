import type { PageServerLoad } from "./$types";

export const load = (async ({})=>{
    const text:string = 'hier ist Text';
    //const response = await fetch('http://localhost:5173/imprint/imprint');
    //const imprintText = await response.json();
    //console.log(imprintText);

    return{
        text: text
    };
}) satisfies PageServerLoad