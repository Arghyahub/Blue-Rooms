export interface rooms {
    roomid: string,
    last_vis: number
}

export interface roomProp {
    rooms: rooms[] | []
}

interface userChats {
    user: string, 
    msg: string
}

export interface chatDatas {
    group: boolean,
    user_msg: userChats[] | [] ,
    name: string[],
    latest_msg: number
}