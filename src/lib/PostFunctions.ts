import type {
	PostUserProfilStructure,
	TextColorPost,
	LikeObjectStructure,
	PostStructure
} from './types/Post';

export function likeCounter(likeObject: LikeObjectStructure) {
	likeObject.likeCount += likeObject.liked ? -1 : 1;
	likeObject.liked = !likeObject.liked;
	return likeObject;
}

export function checkForHashtags(post: PostUserProfilStructure | PostStructure) {
	const text = post.content;
	const words = text.split(' ');
	let wordId: number = 0;
	let newPost: TextColorPost[] = [
		{
			hashtagClass: '',
			text: '',
			wordID: 0
		}
	];

	if (words !== null) {
		newPost = words.map((word) => {
			let hashtagClass: string = '';
			if (word.startsWith('#')) {
				hashtagClass = 'text-blue-600';
			}
			return { hashtagClass: hashtagClass, text: word, wordID: wordId++ };
		});
	}
	return newPost;
}
