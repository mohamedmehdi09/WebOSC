export type TokenPayload = {
  user_id: string;
  super: boolean;
  emailVerified: boolean;
};

export type FrontendUser = {
  user_id: string;
  name: string;
  middlename: string | null;
  lastname: string;
  email: string;
  isMale: boolean | null;
};
