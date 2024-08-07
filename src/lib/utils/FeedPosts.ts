import { createToast } from '$lib/utils/Toasts';
import type { Feed } from '$lib/types/Feed';
import { getFeed } from '$lib/utils/Feed';
import type { ToastStore } from '@skeletonlabs/skeleton';
import { t } from '../../i18n';
import { get } from 'svelte/store';

export async function fetchPosts(
	token: string,
	toastStore: ToastStore,
	feedData: Feed,
	limit: number,
	feedType?: string
) {
	try {
		const response = await getFeed(
			token,
			limit,
			feedData.pagination.lastPostId,
			toastStore,
			feedType
		);

		if (response.status === 200 && response.data) {
			if (response.data.records.length !== 0) {
				feedData.records = feedData.records.concat(response.data.records);
				feedData.pagination.lastPostId = response.data.pagination.lastPostId;
				feedData.pagination.records = response.data.pagination.records;
			}
		}
	} catch (error) {
		toastStore.clear();
		toastStore.trigger(createToast(get(t)('toast.internalError'), 'error'));
	}
	return { feedData };
}
