import axiosInstance from '../axiosInstance';
import type { VocabCard, Vocab } from '../../types';
import type { ApiResponse, PaginatedResponse } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { AUTH_TOKEN_KEY } from '../../utils/constants';

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

/**
 * Retrieve current JWT auth token from all possible storage locations.
 */
function getAuthToken(): string | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('vv-auth-token');
  if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
    return token;
  }
  const storeToken = useAuthStore.getState()?.token;
  if (storeToken && storeToken.trim() !== '' && storeToken !== 'null') {
    return storeToken;
  }
  try {
    const persisted = localStorage.getItem('vv-auth');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (parsed?.state?.token) return parsed.state.token;
    }
  } catch (e) { /* ignore */ }
  return null;
}

/**
 * Check if the user is authenticated.
 */
function isUserLoggedIn(): boolean {
  const token = getAuthToken();
  if (token) return true;
  const authState = useAuthStore.getState();
  return Boolean(authState?.isAuthenticated || authState?.user);
}

export const vocabApi = {
  /**
   * Get paginated vocab list.
   * If logged in, uses GET /vocabs/private/all/user with Bearer JWT header
   * If guest/not logged in, uses GET /vocabs/public/all
   */
  getVocabList: async (params: VocabListParams = {}): Promise<PaginatedResponse<VocabCard>> => {
    const token = getAuthToken();
    const isLoggedIn = isUserLoggedIn();
    const url = isLoggedIn ? `${VOCAB_BASE}/private/all/user` : `${VOCAB_BASE}/public/all`;

    console.log(`[vocabApi] Fetching vocabs from ${url} (isLoggedIn: ${isLoggedIn}, hasToken: ${Boolean(token)})`);

    const res = await axiosInstance.get<PaginatedResponse<any>>(url, {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 9,
        sortBy: 'id',
        ...(params.q ? { q: params.q } : {}),
        ...(params.tag ? { tag: params.tag } : {}),
        ...(params.type ? { type: params.type } : {}),
      },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
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
   * POST /user/bookmarkVocab?VocabId={vocabId}
   */
  toggleBookmark: async (vocabId: number): Promise<string> => {
    const res = await axiosInstance.post<string>(`${USER_BASE}/bookmarkVocab`, null, {
      params: { VocabId: vocabId },
    });
    return typeof res.data === 'string' ? res.data : 'Bookmark is successfull';
  },

  /**
   * Toggle learned state for the authenticated user.
   * POST /user/markVocabIsLearned?VocabId={vocabId}
   */
  toggleLearned: async (vocabId: number): Promise<string> => {
    const res = await axiosInstance.post<string>(`${USER_BASE}/markVocabIsLearned`, null, {
      params: { VocabId: vocabId },
    });
    return typeof res.data === 'string' ? res.data : 'Word status updated successfully';
  },

  /**
   * Get the authenticated user's bookmarked words (paginated).
   * GET /user/private/bookmarkedVocabs?page={page}&size={size}
   */
  getBookmarkedVocabs: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VocabCard>> => {
    const token = getAuthToken();
    console.log(`[vocabApi] Fetching bookmarked vocabs from ${USER_BASE}/private/bookmarkedVocabs?page=${page}&size=${size}`);

    const res = await axiosInstance.get<PaginatedResponse<any> | any>(`${USER_BASE}/private/bookmarkedVocabs`, {
      params: { page, size },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    });

    const rawData = res.data;
    const contentArray = Array.isArray(rawData?.content)
      ? rawData.content
      : Array.isArray(rawData?.data)
      ? rawData.data
      : Array.isArray(rawData)
      ? rawData
      : [];

    const content: VocabCard[] = contentArray.map((item: any) => {
      // If item.vocabResponse is an object, use it; if item.vocab is an object, use it; otherwise item itself is VocabResponse
      const vocabObj =
        item && typeof item.vocabResponse === 'object' && item.vocabResponse !== null
          ? item.vocabResponse
          : item && typeof item.vocab === 'object' && item.vocab !== null
          ? item.vocab
          : item;

      const vocab: Vocab = {
        id: Number(vocabObj.id),
        vocab: String(vocabObj.vocab || vocabObj.word || ''),
        vocabType: vocabObj.vocabType || 'word',
        useCaseTag: vocabObj.useCaseTag || '',
        trick: vocabObj.trick || '',
        meaning: vocabObj.meaning || '',
        example: vocabObj.example || '',
        message: vocabObj.message ?? null,
        updatedAt: vocabObj.updatedAt ? String(vocabObj.updatedAt) : '',
      };

      return {
        vocab,
        isBookmarked: true,
        isLearned: Boolean(item?.isLearned ?? item?.learned ?? false),
      };
    });

    return {
      content,
      totalPages: rawData?.totalPages ?? 1,
      totalElements: rawData?.totalElements ?? content.length,
      size: rawData?.size ?? size,
      number: rawData?.number ?? page,
      first: rawData?.first ?? page === 0,
      last: rawData?.last ?? true,
      empty: rawData?.empty ?? content.length === 0,
    };
  },

  /**
   * Get the authenticated user's bookmarked words.
   * GET /user/private/bookmarkedVocabs
   */
  getBookmarked: async (page = 0, size = 50): Promise<VocabCard[]> => {
    const res = await vocabApi.getBookmarkedVocabs(page, size);
    return res.content;
  },

  /**
   * Get the authenticated user's learned words (paginated).
   * GET /user/private/learnedVocabs?page={page}&size={size}
   */
  getLearnedVocabs: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<VocabCard>> => {
    const token = getAuthToken();
    console.log(`[vocabApi] Fetching learned vocabs from ${USER_BASE}/private/learnedVocabs?page=${page}&size=${size}`);

    const res = await axiosInstance.get<PaginatedResponse<any> | any>(`${USER_BASE}/private/learnedVocabs`, {
      params: { page, size },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    });

    const rawData = res.data;
    const contentArray = Array.isArray(rawData?.content)
      ? rawData.content
      : Array.isArray(rawData?.data)
      ? rawData.data
      : Array.isArray(rawData)
      ? rawData
      : [];

    const content: VocabCard[] = contentArray.map((item: any) => {
      const vocabObj =
        item && typeof item.vocabResponse === 'object' && item.vocabResponse !== null
          ? item.vocabResponse
          : item && typeof item.vocab === 'object' && item.vocab !== null
          ? item.vocab
          : item;

      const vocab: Vocab = {
        id: Number(vocabObj.id),
        vocab: String(vocabObj.vocab || vocabObj.word || ''),
        vocabType: vocabObj.vocabType || 'word',
        useCaseTag: vocabObj.useCaseTag || '',
        trick: vocabObj.trick || '',
        meaning: vocabObj.meaning || '',
        example: vocabObj.example || '',
        message: vocabObj.message ?? null,
        updatedAt: vocabObj.updatedAt ? String(vocabObj.updatedAt) : '',
      };

      return {
        vocab,
        isLearned: true,
        isBookmarked: Boolean(item?.isBookmarked ?? item?.bookmarked ?? false),
      };
    });

    return {
      content,
      totalPages: rawData?.totalPages ?? 1,
      totalElements: rawData?.totalElements ?? content.length,
      size: rawData?.size ?? size,
      number: rawData?.number ?? page,
      first: rawData?.first ?? page === 0,
      last: rawData?.last ?? true,
      empty: rawData?.empty ?? content.length === 0,
    };
  },

  /**
   * Get the authenticated user's learned words.
   * GET /user/private/learnedVocabs
   */
  getLearned: async (page = 0, size = 50): Promise<VocabCard[]> => {
    const res = await vocabApi.getLearnedVocabs(page, size);
    return res.content;
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

  /**
   * Filter vocabulary cards by useCaseTag (e.g. "CUET", "UPSC", "GRE", "CAT", "SSC")
   * GET /user/private/filterVocab?useCaseTag={useCaseTag}&page={page}&size={size}&sortBy={sortBy}
   */
  filterVocabByUseCaseTag: async (
    useCaseTag: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id'
  ): Promise<PaginatedResponse<VocabCard>> => {
    const token = getAuthToken();
    console.log(`[vocabApi] Fetching filtered vocabs for tag "${useCaseTag}" (page=${page}, size=${size})`);

    const res = await axiosInstance.get<PaginatedResponse<any> | any>(`${USER_BASE}/private/filterVocab`, {
      params: {
        useCaseTag,
        page,
        size,
        sortBy,
      },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    });

    const rawData = res.data;
    const contentArray = Array.isArray(rawData?.content)
      ? rawData.content
      : Array.isArray(rawData?.data)
      ? rawData.data
      : Array.isArray(rawData)
      ? rawData
      : [];

    const content: VocabCard[] = contentArray.map((item: any) => {
      const vocabObj =
        item && typeof item.vocabResponse === 'object' && item.vocabResponse !== null
          ? item.vocabResponse
          : item && typeof item.vocab === 'object' && item.vocab !== null
          ? item.vocab
          : item;

      const vocab: Vocab = {
        id: Number(vocabObj.id),
        vocab: String(vocabObj.vocab || vocabObj.word || ''),
        vocabType: vocabObj.vocabType || 'word',
        useCaseTag: vocabObj.useCaseTag || '',
        trick: vocabObj.trick || '',
        meaning: vocabObj.meaning || '',
        example: vocabObj.example || '',
        message: vocabObj.message ?? null,
        updatedAt: vocabObj.updatedAt ? String(vocabObj.updatedAt) : '',
      };

      return {
        vocab,
        isLearned: Boolean(item?.isLearned ?? item?.learned ?? false),
        isBookmarked: Boolean(item?.isBookmarked ?? item?.bookmarked ?? false),
      };
    });

    return {
      content,
      totalPages: rawData?.totalPages ?? 1,
      totalElements: rawData?.totalElements ?? content.length,
      size: rawData?.size ?? size,
      number: rawData?.number ?? page,
      first: rawData?.first ?? page === 0,
      last: rawData?.last ?? true,
      empty: rawData?.empty ?? content.length === 0,
    };
  },
};
