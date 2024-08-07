

interface CreateUser {
    name: string,
    surname: string,
    user_name: string,
    email: string;
    password: string;
    role_id: number;
    remember: boolean;
}
interface LoginUser {
    email: string;
    password: string;
}

export type { CreateUser, LoginUser }