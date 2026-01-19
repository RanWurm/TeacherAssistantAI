'use client';

import { increaseViews as apiIncreaseViews } from '@/lib/api/articles.api';

/**
 * Increment the view count for the given article by its ID.
 * Calls the API endpoint that triggers a DB update (see backend core/backend/src/agent/db.ts).
 * Fails silently on error.
 * @param articleId
 */
export async function incrementArticleView(articleId: number): Promise<void> {
    await apiIncreaseViews(articleId);
}
