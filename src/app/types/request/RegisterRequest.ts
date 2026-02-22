export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
    image: File | null;
    roleId: number;
    dob: string;
    
}