import { atom , RecoilState } from "recoil";

const userAdded:RecoilState<string> = atom({
    key: 'userAdded', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

interface rooms {
    roomid: string,
    roomName: string,
    last_vis: number
}

interface jsonUser {
    name: string,
    rooms: rooms[] ,
}

const userRooms:RecoilState<jsonUser> = atom({
    key: 'userData',
    default:{name:'',rooms:[]}  as jsonUser
})


interface userMsg {
    _id: string,
    user: string,
    msg: string
}

interface chatType {
    selected: boolean,
    _id: string,
    group: boolean,
    user_msg: [] | userMsg[] ,
    name: string,
    latest_msg: number,
}

const currOpenChat: RecoilState<chatType> = atom({
    key: 'currOpenChat',
    default: {selected: false} as chatType,
});


interface userMsg {
    _id: string,
    user: string,
    msg: string
}

interface chatDatas {
    _id: string,
    group: boolean,
    user_msg: userMsg[] | [],
    name: string[],
    latest_msg: number
}

const chatDataStore: RecoilState< chatDatas[] | []> = atom({
    key: 'chatDataStore',
    default: [] as chatDatas[],
});


export { userAdded , currOpenChat , chatDataStore , userRooms } ;