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

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}
