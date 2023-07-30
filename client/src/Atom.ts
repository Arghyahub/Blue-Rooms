import { atom , RecoilState } from "recoil";

const userAdded:RecoilState<string> = atom({
    key: 'userAdded', // unique ID (with respect to other atoms/selectors)
    default: '', // default value (aka initial value)
});


export { userAdded } ;