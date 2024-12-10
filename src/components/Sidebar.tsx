/* eslint-disable jsx-a11y/alt-text */
import {
    Divider,
} from "@nextui-org/react";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbTruckDelivery } from "react-icons/tb";
import { BiLogOutCircle } from "react-icons/bi";
import { useAuth } from "@/contexts/AuthContext";

interface Menu {
    title: string;
    icon: JSX.Element;
    href: string;
}

interface SidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {

    const { logout } = useAuth()
    const Menus: Menu[] = [
        {
            title: "Shipments",
            icon: <TbTruckDelivery className="w-7 text-blue-600 h-7" />,
            href: "/shipments",
        },
    ];

    const [selectItem, setSelectItem] = useState<string | undefined>();
    const navigate = useNavigate();


    return (
        <div
            className={`hidden md:block ${open ? "w-72" : "w-20"} bg-[#18181b] p-5 relative pt-14 duration-300`}
        >
            <img
                src="/assets/control.png"
                className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"
                    }`}
                onClick={() => setOpen(!open)}
            />
            <div className="flex gap-x-4 items-center">
                <img
                    src="/assets/favicon.ico"
                    className={`cursor-pointer h-10 w-10 duration-500 ${open && "rotate-[360deg]"}`}
                />
                <h1
                    className={`text-white origin-left font-medium text-base duration-200 ${!open && "scale-0"}`}
                >
                    Rahtash
                </h1>
            </div>
            <Divider className="bg-light-white mt-8" />
            <ul className="pt-6">
                {Menus.map((Menu, index) => (
                    <li
                        key={index}
                        className={`flex rounded-md p-2 mb-8 cursor-pointer hover:bg-light-white text-gray-100 text-lg items-center gap-x-4 
                                    ${Menu.title === selectItem ? "bg-[#3e3c3c]" : ""}`}
                        onClick={() => {
                            navigate(Menu.href);
                            setSelectItem(Menu.title);
                        }}
                    >
                        {Menu.icon}
                        <span className={`${!open && "hidden"} origin-left duration-200`}>
                            {Menu.title}
                        </span>
                    </li>
                ))}

                <li
                    className={`flex rounded-md p-2 mb-8 cursor-pointer hover:bg-light-white text-gray-300 text-lg items-center gap-x-4  `}
                    onClick={logout }
                >
                   <BiLogOutCircle className="w-7 text-mainColor text-blue-600  h-7" />
                    <span className={`${!open && "hidden"} origin-left text-gray-100 duration-200`}>
                       Log out
                    </span>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;