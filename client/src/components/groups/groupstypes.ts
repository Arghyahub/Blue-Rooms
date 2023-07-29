interface msgGroup {
    uName: string,
    msg : string
}

export interface rooms {
    group: boolean,
    name: string[],
    latestMsg: number,
    msg: msgGroup[]
}

export interface roomProp {
    rooms: rooms[] | []
}