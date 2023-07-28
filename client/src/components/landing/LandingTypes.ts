export interface socials {
    icon: string,
    name: string,
    link: string
}

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

export interface jsonUser {
    name: string,
    rooms: rooms | [] ,
    token: boolean,
    msg: string,
    valid: boolean
}