import { create } from 'zustand';
import { User } from '../types/user';

type State = {
  currentUser: User;
};

type Action = {
  saveCurrentUser: (currentUser: State['currentUser']) => void;
};

export const useCurrentUser = create<State & Action>((set) => ({
  currentUser: {
    company: '',
    email: '',
    id: '',
    joinedAt: '',
    birthday: '',
    gender: '',
    name: '',
    role: '',
  },
  saveCurrentUser: (currentUser: User) => set({ currentUser }),
}));
