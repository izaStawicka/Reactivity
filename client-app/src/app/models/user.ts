export interface User{
    userName: string,
    displayName: string,
    image?: string,
    token: string
}

export interface UserFormValues{
    email: string,
    password: string,
    userName?: string,
    displayName?: string
}