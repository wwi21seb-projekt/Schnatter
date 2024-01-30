import { createToast } from '$lib/Toasts';
import type { Feed } from '$lib/types/Feed';
import { getFeed } from '$lib/utils/Feed';
import type { ToastStore } from '@skeletonlabs/skeleton';

export async function fetchPosts(
	token: string,
	toastStore: ToastStore,
	feedData: Feed,
	limit: number,
	feedType?: string
) {
	try {
		const response = await getFeed(token, limit, feedData.pagination.lastPostId, feedType);

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
