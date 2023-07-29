import { atom , RecoilState } from "recoil";

const currentChatRec:RecoilState<string> = atom({
    key: 'currChat', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});


export { currentChatRec } ;