export interface IUser {
    _id?: string;
    username?: string;
    isAdmin?: boolean;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}