interface rooms {
    roomid: string,
    roomName: string,
    last_vis: number,
    roomUpdated: number
}

export interface newRoomType {
    roomid: string,
    roomName: string,
    notify: boolean
}

export interface homeProps {
    name: string,
    rooms: newRoomType[] | []
}

export interface jsonUser {
    name: string,
    rooms: newRoomType[] | [] ,
    token?: boolean,
    msg?: string,
    valid?: boolean
}

export interface fetchUserData {
    name: string,
    rooms: rooms[] | [] ,
    token?: boolean,
    msg?: string,
    valid?: boolean
}
