import Image from "next/image";
import React from "react";
import chatImg from "./chatimg.jpg";

type Props = {};

const GroupNotSelected = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full h-full">
      <div>
        <Image src={chatImg} height={250} width={250} alt="Not selected svg" />
      </div>
      <p className="font-medium text-lg">No chats selected</p>
    </div>
  );
};

export default GroupNotSelected;
