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

export interface homeProps {
    name: string,
    rooms: rooms | []
}

export interface jsonUser {
    name: string,
    rooms: rooms | [] ,
    token?: boolean,
    msg?: string,
    valid?: boolean
}