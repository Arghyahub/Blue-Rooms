export interface friendJson {
    name: string,
    id: string
}

export interface addFriendValid {
    success: boolean;
    err?: string,
    roomId?: string
}