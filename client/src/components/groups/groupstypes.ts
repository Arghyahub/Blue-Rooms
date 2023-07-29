export interface rooms {
    roomid: string,
    last_vis: number
}

export interface roomProp {
    rooms: rooms[] | []
}