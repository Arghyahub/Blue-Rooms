import config from "@/constants/config";
import io from "socket.io-client";

const SOCKET_URL = config.server as string;

const socket = io(SOCKET_URL);

export default socket;
