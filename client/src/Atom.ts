import { atom , RecoilState } from "recoil";

const userAdded:RecoilState<string> = atom({
    key: 'userAdded', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});

const chatDummy = {
    _id: '',
    group: false,
    user_msg: [{
        _id: '', user: '', msg: ''
    }],
    name: [''],
    latest_msg: 0,
}

interface userMsg {
    _id: string,
    user: string,
    msg: string
}

interface chatType {
    _id: string;
    group: boolean;
    user_msg: [] | userMsg[] ;
    name: [] | string[];
    latest_msg: number;
}
  
const currOpenChat: RecoilState<chatType> = atom({
    key: 'currOpenChat',
    default: chatDummy
});

export { userAdded , currOpenChat } ;