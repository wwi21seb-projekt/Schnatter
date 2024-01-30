import type { Feed } from '$lib/types/Feed';
import { createToast } from '$lib/Toasts';
import { getSearchPosts } from '$lib/utils/SearchPosts';
import type { ToastStore } from '@skeletonlabs/skeleton';

export async function searchPostsByHashtag(
	token: string,
	toastStore: ToastStore,
	q: string,
	feedData: Feed,
	postId: string,
	limit: number
) {
	try {
		const response = await getSearchPosts(token, postId, q, limit);

		if (response.status === 200 && response.data) {
			if (response.data.records.length !== 0) {
				feedData.records = feedData.records.concat(response.data.records);
				feedData.pagination.lastPostId = response.data.pagination.lastPostId;
				feedData.pagination.records = response.data.pagination.records;
			}
		} else if (response.status !== 200 && response.status !== 500 && response.customError) {
			toastStore.clear();
			toastStore.trigger(createToast(response.customError.message, 'error'));
		}
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast('Internal Server Error! Please try again later!', 'error'));
	}
	return { feedData };
}
