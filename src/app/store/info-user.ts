import { create } from 'zustand';
import { IFormRegister } from '../(auth)/register/page';

type State = {
  formRegister: IFormRegister;
  emailError: { email: string; error: string };
};

type Action = {
  updateForm: (form: State['formRegister']) => void;
  saveEmailError: (emailError: State['emailError']) => void;
};

export const useFormRegisterStore = create<State & Action>((set) => ({
  formRegister: {
    company: '',
    name: '',
    email: '',
    birthday: '',
    gender: 'MALE',
    password: '',
    confirmPass: '',
    isTerm: false,
    isPolicy: false,
  },
  emailError: { email: '', error: '' },
  saveEmailError: (emailError: { email: string; error: string }) => set({ emailError }),
  updateForm: (form: IFormRegister) => set({ formRegister: form }),
}));
