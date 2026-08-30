import axiosInstance from '../axiosInstance';
import type { VocabCard, Vocab } from '../../types';
import type { ApiResponse, PaginatedResponse } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';

export interface VocabListParams {
  page?: number;         // 0-indexed (Spring pagination)
  size?: number;
  q?: string;            // search query
  tag?: string;          // comma-separated tags, e.g. "UPSC,GRE"
  type?: string;         // vocabType filter
  userId?: number;       // logged in user ID
}

const VOCAB_BASE = '/vocabs';
const USER_BASE = '/user';

export const vocabApi = {
  /**
   * Get paginated vocab list.
   * If logged in (userId available), uses GET /vocabs/private/all/user?userId={userId}
   * If guest/not logged in, uses GET /vocabs/public/all
   */
  getVocabList: async (params: VocabListParams = {}): Promise<PaginatedResponse<VocabCard>> => {
    const authState = useAuthStore.getState();
    const token = localStorage.getItem('vv-auth-token');
    const activeUserId = params.userId ?? (token && authState?.user?.id ? authState.user.id : undefined);

    const isPrivate = Boolean(activeUserId);
    const url = isPrivate ? `${VOCAB_BASE}/private/all/user` : `${VOCAB_BASE}/public/all`;

    const res = await axiosInstance.get<PaginatedResponse<any>>(url, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 9,
        ...(isPrivate && activeUserId ? { userId: activeUserId } : {}),
        ...(params.q ? { q: params.q } : {}),
        ...(params.tag ? { tag: params.tag } : {}),
        ...(params.type ? { type: params.type } : {}),
      },
    });

    const rawData = res.data;
    const content: VocabCard[] = (rawData.content || []).map((item: any) => {
      // 1. Private User Response ({ vocabResponse: {...}, bookmarked: true/false, learned: true/false })
      if (item && item.vocabResponse && typeof item.vocabResponse === 'object') {
        return {
          vocab: item.vocabResponse as Vocab,
          isBookmarked: Boolean(item.bookmarked ?? item.isBookmarked),
          isLearned: Boolean(item.learned ?? item.isLearned),
        };
      }
      // 2. Wrapped VocabCard ({ vocab: {...}, isBookmarked, isLearned })
      if (item && item.vocab && typeof item.vocab === 'object') {
        return {
          vocab: item.vocab as Vocab,
          isBookmarked: Boolean(item.isBookmarked ?? item.bookmarked),
          isLearned: Boolean(item.isLearned ?? item.learned),
        };
      }
      // 3. Raw Vocab entity ({ id, vocab: "Bear in mind", ... })
      return {
        vocab: item as Vocab,
        isBookmarked: Boolean(item?.isBookmarked ?? item?.bookmarked),
        isLearned: Boolean(item?.isLearned ?? item?.learned),
      };
    });

    return {
      ...rawData,
      content,
    };
  },

  /**
   * Get a single vocab entry by ID.
   * GET /vocab/:id
   */
  getVocabById: async (id: number): Promise<VocabCard> => {
    const res = await axiosInstance.get<ApiResponse<VocabCard>>(`${VOCAB_BASE}/${id}`);
    return res.data.data ?? (res.data as unknown as VocabCard);
  },

  /**
   * Toggle bookmark state for the authenticated user.
   * POST /user/bookmark/:vocabId
   * OPEN: confirm endpoint and whether it's POST or PATCH
   */
  toggleBookmark: async (vocabId: number): Promise<void> => {
    await axiosInstance.post(`${USER_BASE}/bookmark/${vocabId}`);
  },

  /**
   * Toggle learned state for the authenticated user.
   * POST /user/learned/:vocabId
   * OPEN: confirm endpoint and whether it's POST or PATCH
   */
  toggleLearned: async (vocabId: number): Promise<void> => {
    await axiosInstance.post(`${USER_BASE}/learned/${vocabId}`);
  },

  /**
   * Get the authenticated user's bookmarked words.
   * GET /user/bookmarks
   */
  getBookmarked: async (): Promise<VocabCard[]> => {
    const res = await axiosInstance.get<any>(`${USER_BASE}/bookmarks`);
    const rawList = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    return rawList.map((item: any) =>
      item && item.vocab && typeof item.vocab === 'object'
        ? item
        : { vocab: item, isLearned: false, isBookmarked: true }
    );
  },

  /**
   * Get the authenticated user's learned words.
   * GET /user/learned
   */
  getLearned: async (): Promise<VocabCard[]> => {
    const res = await axiosInstance.get<any>(`${USER_BASE}/learned`);
    const rawList = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    return rawList.map((item: any) =>
      item && item.vocab && typeof item.vocab === 'object'
        ? item
        : { vocab: item, isLearned: true, isBookmarked: false }
    );
  },

  /**
   * Toggle practice queue state for the authenticated user.
   * POST /user/practice/:vocabId
   */
  togglePractice: async (vocabId: number): Promise<void> => {
    await axiosInstance.post(`${USER_BASE}/practice/${vocabId}`);
  },

  /**
   * Get the authenticated user's practice queue.
   * GET /user/practice
   */
  getPracticeQueue: async (): Promise<VocabCard[]> => {
    const res = await axiosInstance.get<any>(`${USER_BASE}/practice`);
    const rawList = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
    return rawList.map((item: any) =>
      item && item.vocab && typeof item.vocab === 'object'
        ? item
        : { vocab: item, isLearned: false, isBookmarked: false }
    );
  },
};
