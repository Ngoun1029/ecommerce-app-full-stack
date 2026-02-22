export type RegisterRequest = {
    name: string;
    gender: string;
    email: string;
    password: string;
    image: File | null;
    roleId: number;
    dob: string;
    
}