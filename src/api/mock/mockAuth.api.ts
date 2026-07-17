import { mockRequest } from './mockClient';
import { User } from '@/types';

export const mockAuthApi = {
  login: (email: string, _password: string) => {
    const user: User = { id: 'u_1', email, name: email.split('@')[0] };
    return mockRequest<User>(user);
  },
  signup: (email: string, _password: string) => {
    const user: User = { id: `u_${Date.now()}`, email, name: email.split('@')[0] };
    return mockRequest<User>(user);
  },
};
