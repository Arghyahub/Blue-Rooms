interface rooms {
    roomid: string,
    roomName: string,
    last_vis: number
}

export interface homeProps {
    name: string,
    rooms: rooms[] | []
}

export interface jsonUser {
    name: string,
    rooms: rooms[] | [] ,
    token?: boolean,
    msg?: string,
    valid?: boolean
}
