export type LoginPayload = { 
    username: string; 
    password: string 
};
export type RegisterPayload = { 
    username: string; 
    password: string 
};

export interface AuthService {
  login(data: LoginPayload): Promise<{ token: string }>;
  register(data: RegisterPayload): Promise<void>;
}