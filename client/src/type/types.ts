export interface IUser {
    _id: string,
    name: string, 
    email: string, 
    isAdmin?: boolean,
    status?: "online" | "offline" ,
    token: string , 
}