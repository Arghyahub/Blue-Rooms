export interface rooms {
    roomid: string,
    roomName: string,
    last_vis: number
}

export interface newRoomType {
    roomid: string,
    roomName: string,
    notify: boolean
}

export interface roomProp {
    rooms: newRoomType[] | [] ,
    name: string
}

export interface userMsg {
    _id: string,
    user: string,
    msg: string
}

export interface chatDatas {
    _id: string,
    group: boolean,
    user_msg: userMsg[] | [],
    members: string[],
    latest_msg: number
}

export interface chatDataJson {
    _id: string,
    group: boolean,
    user_msg: userMsg[] | [],
    name: string[],
    latest_msg: number
}