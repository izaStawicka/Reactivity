import { User } from "./user";

export interface Profile{
    userName: string,
    displayName: string,
    image?: string,
    bio?: string,
    photos? : Photo[]
}

export class Profile implements Profile
{
    constructor(user: User) {
       this.displayName = user.displayName;
       this.image = user.image;
       this.userName = user.userName;
    }     
}

export interface Photo{
    id: string,
    url: string,
    isMain: boolean
}