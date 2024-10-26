export const USER_INPUT = {
  COMPANY: {
    minLength: 1,
    message: '会社名を入力してください',
  },
  NAME: {
    minLength: 1,
    message: '氏名を入力してください',
  },
  EMAIL: {
    minLength: 1,
    message: 'メールアドレスを正しく入力してください',
    emailExisted:
      'このメールアドレスは既に登録されています。別のメールアドレスをご登録ください。',
    emailRegistered: 'このメールアドレスは既に登録されています。',
  },
  PASSWORD: {
    minLength: 8,
    maxLength: 16,
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/,
    message: 'パスワードを正しく入力してください',
  },
  CONFIRM_PASSWORD: { message: 'パスワードが一致しません' },
  GENDER: [
    { value: 'MALE', lable: '男性' },
    { value: 'FEMALE', lable: '女性' },
    { value: 'OTHER', lable: 'その他' },
  ],
  BIRTHDAY: {
    maxLength: 8,
    message: '生年月日を正しく入力してください',
    regex: /^[0-9]{8}/,
  },
  TERM: {
    message: '同意をする場合チェックをしてください',
  },
  POLICY: {
    message: '同意をする場合チェックをしてください',
  },
  LOGIN_FAULT: {
    message:
      'メールアドレス、パスワードの入力に誤りがあります。正しい情報を入力している場合、メールアドレスの認証が完了していない可能性があります。',
  },
};

export const ERR_TITLE_MANUAL = 'タイトルを入力してください';

export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum GENDER_JP {
  MALE = '男性',
  FEMALE = '女性',
  OTHER = 'その他',
}

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum USER_ROLE_JP {
  ADMIN = '管理者',
  MEMBER = '一般',
}
