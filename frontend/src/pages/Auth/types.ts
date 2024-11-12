export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export interface RegisterFormProps {
  onSubmit: (username: string, email: string, password: string) => Promise<void>;
}