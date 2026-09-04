import axiosInstance from '../axiosInstance';
import type { Vocab } from '../../types';

export interface VocabInput {
  id?: number;
  vocab: string;
  vocabType: string;
  useCaseTag: string;
  trick: string;
  meaning: string;
  example: string;
  message?: string;
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  description: string;
  count: number;
}

// Fixed Vocab Types matching VOCAB_TYPES = ['WORD', 'PHRASE', 'IDIOM'] as const
export const FIXED_VOCAB_TYPES: AdminCategoryItem[] = [
  { id: '1', name: 'WORD', description: 'Single vocabulary term', count: 0 },
  { id: '2', name: 'PHRASE', description: 'Multi-word expression', count: 0 },
  { id: '3', name: 'IDIOM', description: 'Figurative expression', count: 0 },
];

let mockUseCaseTags: AdminCategoryItem[] = [
  { id: '1', name: 'CAT', description: 'Common Admission Test vocabulary', count: 15 },
  { id: '2', name: 'CUET', description: 'Central Universities Entrance Test', count: 10 },
  { id: '3', name: 'GRE', description: 'Graduate Record Examination', count: 14 },
  { id: '4', name: 'SSC', description: 'Staff Selection Commission', count: 7 },
  { id: '5', name: 'UPSC', description: 'Civil Services Examination', count: 8 },
];

// Initial Mock Vocabulary Data
let mockVocabs: (Vocab & { message?: string })[] = [
  {
    id: 40,
    vocab: 'Bear in mind',
    vocabType: 'PHRASE' as any,
    useCaseTag: 'CAT, CUET',
    trick: 'A bear holding a glowing lightbulb in its head.',
    meaning: 'To remember a piece of information when making a decision or thinking about a matter.',
    example: 'Bear in mind that the API rate limit resets every hour.',
    message: 'Commonly tested in CUET & CAT reading comprehension.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 39,
    vocab: 'In the grand scheme of things',
    vocabType: 'PHRASE' as any,
    useCaseTag: 'GRE, CAT',
    trick: 'Looking at the whole universe instead of just Earth.',
    meaning: 'Putting things into perspective by looking at the complete picture.',
    example: "A failing grade on one quiz isn't going to ruin your life in the grand scheme of things.",
    message: 'Idiomatic transition phrase.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 38,
    vocab: 'Aberration',
    vocabType: 'WORD' as any,
    useCaseTag: 'GRE, CAT',
    trick: 'Ab + Erration -> Abnormal error',
    meaning: 'A departure from what is normal, usual, or expected, typically one that is unwelcome.',
    example: 'They described the outburst as an aberration in his usually calm demeanor.',
    message: 'High frequency GRE word.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 37,
    vocab: 'Ephemeral',
    vocabType: 'WORD' as any,
    useCaseTag: 'GRE, UPSC',
    trick: 'E-PHONAL -> phone battery life is ephemeral',
    meaning: 'Lasting for a very short time; fleeting or transient.',
    example: 'Fame in the digital age can be remarkably ephemeral.',
    message: null as any,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 36,
    vocab: 'Ubiquitous',
    vocabType: 'WORD' as any,
    useCaseTag: 'CAT, GRE',
    trick: 'U-BI-QUIT-US -> You are everywhere and wont quit us!',
    meaning: 'Present, appearing, or found everywhere.',
    example: 'Smartphones have become ubiquitous in modern society.',
    message: null as any,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 35,
    vocab: 'Bite the bullet',
    vocabType: 'IDIOM' as any,
    useCaseTag: 'CUET, SSC',
    trick: 'Biting a bullet before a tough surgery without anesthesia.',
    meaning: 'To face a difficult or unpleasant situation with courage and fortitude.',
    example: 'I decided to bite the bullet and finish writing the report tonight.',
    message: null as any,
    updatedAt: new Date().toISOString(),
  },
];

export interface AdminPaginatedVocabResponse {
  content: (Vocab & { message?: string })[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export const adminApi = {
  /**
   * Get list of vocabulary entries for Admin Console with pagination details.
   * GET /admin/allVocabs?page={page}&size={size}&sort=id
   */
  getVocabs: async (page = 0, size = 10, sort = 'id'): Promise<AdminPaginatedVocabResponse> => {
    const pageNum = typeof page === 'number' && !isNaN(page) ? page : 0;
    const sizeNum = typeof size === 'number' && !isNaN(size) ? size : 10;

    try {
      console.log(`[adminApi] Requesting GET /admin/allVocabs?page=${pageNum}&size=${sizeNum}&sort=${sort}`);
      const res = await axiosInstance.get<any>('/admin/allVocabs', {
        params: { page: pageNum, size: sizeNum, sort },
      });
      const rawData = res.data;
      const contentArray = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.content)
          ? rawData.content
          : Array.isArray(rawData?.data)
            ? rawData.data
            : Array.isArray(rawData?.data?.content)
              ? rawData.data.content
              : [];

      const list: (Vocab & { message?: string })[] = contentArray.map((item: any) => ({
        id: Number(item.id),
        vocab: String(item.vocab || item.word || ''),
        vocabType: item.vocabType || 'WORD',
        useCaseTag: item.useCaseTag || '',
        trick: item.trick || '',
        meaning: item.meaning || '',
        example: item.example || '',
        message: item.message ?? undefined,
        updatedAt: item.updatedAt ? String(item.updatedAt) : new Date().toISOString(),
      }));

      const totalElements = Number(rawData?.totalElements ?? rawData?.data?.totalElements ?? (list.length > 0 ? list.length : mockVocabs.length));
      const totalPages = Number(rawData?.totalPages ?? rawData?.data?.totalPages ?? Math.max(1, Math.ceil(totalElements / size)));
      const currentPage = Number(rawData?.number ?? rawData?.page ?? page);

      const items = list.length > 0 ? list : [...mockVocabs].slice(currentPage * size, (currentPage + 1) * size);

      return {
        content: items,
        totalElements: list.length > 0 ? totalElements : mockVocabs.length,
        totalPages: list.length > 0 ? totalPages : Math.max(1, Math.ceil(mockVocabs.length / size)),
        number: currentPage,
        size,
        first: currentPage === 0,
        last: currentPage >= totalPages - 1,
      };
    } catch (e) {
      console.warn('[adminApi] GET /admin/all/Vocabs failed, using fallback mock dataset:', e);
    }
    const totalElements = mockVocabs.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const sliced = [...mockVocabs].slice(page * size, (page + 1) * size);
    return {
      content: sliced,
      totalElements,
      totalPages,
      number: page,
      size,
      first: page === 0,
      last: page >= totalPages - 1,
    };
  },

  getVocabById: async (id: number): Promise<(Vocab & { message?: string }) | null> => {
    try {
      const res = await axiosInstance.get<any>(`/admin/vocabs/${id}`);
      const item = res.data?.data ?? res.data;
      if (item && typeof item === 'object') return item;
    } catch (e) {
      /* ignore */
    }
    return mockVocabs.find((v) => v.id === id) || null;
  },

  createVocab: async (input: VocabInput): Promise<Vocab & { message?: string }> => {
    const payload = {
      vocab: String(input.vocab || '').trim(),
      vocabType: String(input.vocabType || 'WORD').toUpperCase().trim(),
      useCaseTag: String(input.useCaseTag || '').trim(),
      trick: String(input.trick || '').trim(),
      meaning: String(input.meaning || '').trim(),
      example: String(input.example || '').trim(),
      message: input.message ? String(input.message).trim() : '',
    };

    try {
      console.log('[adminApi] Requesting POST /admin/addVocab with payload:', payload);
      const res = await axiosInstance.post<any>('/admin/addVocab', payload);
      const created = res.data?.data ?? res.data;
      if (created && (created.id !== undefined || created.vocab)) {
        const newVocab = {
          id: Number(created.id),
          vocab: String(created.vocab || payload.vocab),
          vocabType: (created.vocabType || payload.vocabType) as any,
          useCaseTag: String(created.useCaseTag ?? payload.useCaseTag),
          trick: String(created.trick ?? payload.trick),
          meaning: String(created.meaning ?? payload.meaning),
          example: String(created.example ?? payload.example),
          message: created.message ?? payload.message ?? undefined,
          updatedAt: created.updatedAt ? String(created.updatedAt) : new Date().toISOString(),
        };
        mockVocabs = [newVocab, ...mockVocabs];
        return newVocab;
      }
    } catch (e) {
      console.warn('[adminApi] POST /admin/addVocab failed, using local fallback:', e);
    }
    const newId = mockVocabs.length > 0 ? Math.max(...mockVocabs.map((v) => v.id)) + 1 : 1;
    const newVocab = {
      id: newId,
      vocab: payload.vocab,
      vocabType: payload.vocabType as any,
      useCaseTag: payload.useCaseTag,
      trick: payload.trick,
      meaning: payload.meaning,
      example: payload.example,
      message: payload.message || undefined,
      updatedAt: new Date().toISOString(),
    };
    mockVocabs = [newVocab, ...mockVocabs];
    return newVocab;
  },

  updateVocab: async (id: number, input: VocabInput): Promise<Vocab & { message?: string }> => {
    // Only send fields supported by Spring Boot switch statement (do NOT include 'id' in body)
    const payload: Record<string, string> = {
      vocab: String(input.vocab || '').trim(),
      vocabType: String(input.vocabType || 'WORD').toUpperCase().trim(),
      useCaseTag: String(input.useCaseTag || '').trim(),
      trick: String(input.trick || '').trim(),
      meaning: String(input.meaning || '').trim(),
      example: String(input.example || '').trim(),
      message: String(input.message || '').trim(),
    };

    try {
      console.log(`[adminApi] Requesting PATCH /admin/update?id=${id} with payload:`, payload);
      const res = await axiosInstance.patch<any>('/admin/update', payload, {
        params: { id },
      });
      const updated = res.data?.data ?? res.data;
      if (updated && (updated.id !== undefined || updated.vocab)) {
        const item: Vocab & { message?: string } = {
          id: Number(updated.id ?? id),
          vocab: String(updated.vocab || payload.vocab),
          vocabType: (updated.vocabType || payload.vocabType) as any,
          useCaseTag: String(updated.useCaseTag ?? payload.useCaseTag),
          trick: String(updated.trick ?? payload.trick),
          meaning: String(updated.meaning ?? payload.meaning),
          example: String(updated.example ?? payload.example),
          message: updated.message ?? payload.message ?? undefined,
          updatedAt: updated.updatedAt ? String(updated.updatedAt) : new Date().toISOString(),
        };
        const idx = mockVocabs.findIndex((v) => v.id === id);
        if (idx !== -1) mockVocabs[idx] = item;
        return item;
      }
    } catch (e) {
      console.warn('[adminApi] PATCH /admin/update failed, using local fallback:', e);
    }
    const idx = mockVocabs.findIndex((v) => v.id === id);
    if (idx === -1) {
      const fallbackItem = {
        id,
        vocab: payload.vocab,
        vocabType: payload.vocabType as any,
        useCaseTag: payload.useCaseTag,
        trick: payload.trick,
        meaning: payload.meaning,
        example: payload.example,
        message: payload.message || undefined,
        updatedAt: new Date().toISOString(),
      };
      return fallbackItem;
    }

    const updated = {
      ...mockVocabs[idx],
      vocab: payload.vocab,
      vocabType: payload.vocabType as any,
      useCaseTag: payload.useCaseTag,
      trick: payload.trick,
      meaning: payload.meaning,
      example: payload.example,
      message: payload.message || undefined,
      updatedAt: new Date().toISOString(),
    };
    mockVocabs[idx] = updated;
    return updated;
  },

  deleteVocab: async (id: number): Promise<{ success: boolean; id: number }> => {
    try {
      const res = await axiosInstance.delete<any>(`/admin/vocabs/${id}`);
      mockVocabs = mockVocabs.filter((v) => v.id !== id);
      return res.data?.data ?? res.data ?? { success: true, id };
    } catch (e) {
      console.warn('[adminApi] DELETE /admin/vocabs failed, using local fallback:', e);
    }
    mockVocabs = mockVocabs.filter((v) => v.id !== id);
    return { success: true, id };
  },

  // --- Fixed Vocab Types ---
  getVocabTypes: async (): Promise<AdminCategoryItem[]> => {
    return FIXED_VOCAB_TYPES.map((t) => ({
      ...t,
      count: mockVocabs.filter((v) => v.vocabType.toUpperCase() === t.name).length,
    }));
  },

  // --- Taxonomy (Use Case Tags) ---
  getUseCaseTags: async (): Promise<AdminCategoryItem[]> => {
    return [...mockUseCaseTags];
  },

  addUseCaseTag: async (name: string, description: string): Promise<AdminCategoryItem> => {
    try {
      const res = await axiosInstance.post<any>('/admin/usecase-tags', { name, description });
      const created = res.data?.data ?? res.data;
      if (created && created.id) {
        mockUseCaseTags = [...mockUseCaseTags, created];
        return created;
      }
    } catch (e) { /* ignore */ }
    const newItem = {
      id: String(Date.now()),
      name: name.toUpperCase().trim(),
      description: description.trim(),
      count: 0,
    };
    mockUseCaseTags = [...mockUseCaseTags, newItem];
    return newItem;
  },

  deleteUseCaseTag: async (id: string): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/admin/usecase-tags/${id}`);
      mockUseCaseTags = mockUseCaseTags.filter((item) => item.id !== id);
      return true;
    } catch (e) { /* ignore */ }
    mockUseCaseTags = mockUseCaseTags.filter((item) => item.id !== id);
    return true;
  },
};

