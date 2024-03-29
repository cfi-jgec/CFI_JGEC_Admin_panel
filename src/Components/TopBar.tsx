"use client"

import { FaCircleUser } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useState } from "react"; 
import Profile from "./Profile"; 

function TopBar() {
    const [openProfile, setOpenProfile] = useState(false);
    return (
        <div className="fixed top-0 z-50 w-[80%] h-20 bg-topBg px-10 flex justify-end items-center shadow-xl">
            {
                <div className="flex text-2xl text-subtitle">
                    <IoNotifications className="cursor-pointer mx-2" />
                    <MdEmail className="cursor-pointer mx-2" />
                    <FaCircleUser
                        className="cursor-pointer mx-2"
                        onClick={() => setOpenProfile(true)}
                    />
                </div>
            }
            <Profile closeModal={(value: boolean) => setOpenProfile(value)} openModal={openProfile} />
        </div>
    )
}

export default TopBar