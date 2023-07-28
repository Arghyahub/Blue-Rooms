interface msgGroup {
    uName: string,
    msg : string
}

interface rooms {
    group: boolean,
    name: string[],
    latestMsg: number,
    msg: msgGroup[]
}

export interface roomProp {
    rooms: rooms[] | []
}