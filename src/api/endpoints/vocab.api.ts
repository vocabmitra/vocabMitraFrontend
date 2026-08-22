import axiosInstance from '../axiosInstance';
import type { VocabCard } from '../../types';
import type { ApiResponse, PaginatedResponse } from '../../types';

export interface VocabListParams {
  page?: number;         // 0-indexed (Spring pagination)
  size?: number;
  q?: string;            // search query
  tag?: string;          // comma-separated tags, e.g. "UPSC,GRE"
  type?: string;         // vocabType filter
}

const VOCAB_BASE = '/vocab';
const USER_BASE = '/user';

export const vocabApi = {
  /**
   * Get paginated vocab list with optional filters.
   * GET /vocab?page=0&size=9&q=...&tag=...
   * OPEN: confirm exact query param names with backend
   */
  getVocabList: async (params: VocabListParams = {}): Promise<PaginatedResponse<VocabCard>> => {
    const res = await axiosInstance.get<PaginatedResponse<VocabCard>>(VOCAB_BASE, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 9,
        ...(params.q ? { q: params.q } : {}),
        ...(params.tag ? { tag: params.tag } : {}),
        ...(params.type ? { type: params.type } : {}),
      },
    });
    return res.data;
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
    const res = await axiosInstance.get<ApiResponse<VocabCard[]>>(`${USER_BASE}/bookmarks`);
    return res.data.data ?? (res.data as unknown as VocabCard[]);
  },

  /**
   * Get the authenticated user's learned words.
   * GET /user/learned
   */
  getLearned: async (): Promise<VocabCard[]> => {
    const res = await axiosInstance.get<ApiResponse<VocabCard[]>>(`${USER_BASE}/learned`);
    return res.data.data ?? (res.data as unknown as VocabCard[]);
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
    const res = await axiosInstance.get<ApiResponse<VocabCard[]>>(`${USER_BASE}/practice`);
    return res.data.data ?? (res.data as unknown as VocabCard[]);
  },
};
