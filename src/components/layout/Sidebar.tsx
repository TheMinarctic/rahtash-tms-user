import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { Divider } from "@nextui-org/react";
import { BiLogOutCircle } from "react-icons/bi";
import { useAuth } from "@/contexts/AuthContext";
import { TbTruckDelivery } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiPackage } from "react-icons/fi";
import { objectToQueryString } from "@/utils/object-to-query-string";

interface Menu {
  title: string;
  icon: JSX.Element;
  href?: string;
  // subMenus?: SubMenu[];
}

interface SubMenu {
  title: string;
  href: string;
  icon?: JSX.Element;
}

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const THEME_MODE = "theme_mode";
const SIDEBAR_SELECTED_PARENT_MENU = "sidebar_selected_menu";

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem(THEME_MODE));

  const [selectedParentMenu, setSelectedParentMenu] = useState<undefined | string>(
    localStorage.getItem(SIDEBAR_SELECTED_PARENT_MENU || undefined)
  );

  const toggleMenu = (title: string) => {
    if (selectedParentMenu === title) {
      setSelectedParentMenu(undefined);
      localStorage.setItem(SIDEBAR_SELECTED_PARENT_MENU, undefined);
    } else {
      setSelectedParentMenu(title);
      localStorage.setItem(SIDEBAR_SELECTED_PARENT_MENU, title);
    }
  };

  const handleNavigation = (href: string) => {
    const object = {
      page: "1",
      ordering: href === "/shipments" ? "updated_at" : null,
    };

    const searchParamsString = objectToQueryString(object);

    navigate({ pathname: href, search: searchParamsString });
  };

  return (
    <div
      className={cn(
        `relative hidden select-none border-e border-border bg-background p-5 pt-10 duration-300 md:flex md:flex-col`,
        open ? "w-72" : "w-20"
      )}
    >
      {/* TOGGLE BUTTON */}
      <img
        src="/assets/control.png"
        className={cn(
          `absolute -right-3 top-9 w-7 cursor-pointer rounded-full border-2 border-primary`,
          !open && "rotate-180"
        )}
        onClick={() => setOpen(!open)}
      />

      {/* LOGO */}
      <div className="flex items-center gap-x-4">
        <img src="/R.png" className={cn(`h-10 w-10 duration-500`, open && "rotate-[360deg]")} />

        <h1
          className={cn(
            `origin-left text-base font-medium text-foreground duration-200`,
            !open && "scale-0"
          )}
        >
          Rahtash
        </h1>
      </div>

      <Divider className="mt-8" />

      {/* MENU LIST ITEMS */}
      <ul className="flex-1 pt-6">
        {Menus.map((Menu, index) => (
          <React.Fragment key={index}>
            <li
              className={cn(
                `mb-2 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-base hover:bg-muted`,
                Menu.title === selectedParentMenu && "bg-muted text-primary"
              )}
              onClick={() => {
                if (Menu.href) {
                  handleNavigation(Menu.href);
                }
                // else if (Menu.subMenus) {
                //   toggleMenu(Menu.title);
                // }
              }}
            >
              <span>{Menu.icon}</span>

              <span className={cn(`${!open && "hidden"} flex-1 origin-left duration-200`)}>
                {Menu.title}
              </span>

              {/* {Menu.subMenus && open && selectedParentMenu === Menu.title ? (
                <FiChevronDown className="text-primary" />
              ) : (
                <FiChevronRight className="text-muted-foreground" />
              )} */}
            </li>

            {/* SUB MENU ITEMS */}
            {/* {Menu.subMenus && selectedParentMenu === Menu.title && open && (
              <ul className="mb-2 ps-8">
                {Menu.subMenus.map((subMenu, subIndex) => (
                  <li
                    key={subIndex}
                    className={cn(
                      `mb-2 flex cursor-pointer items-center gap-x-4 rounded-md p-2 text-sm text-accent-foreground hover:bg-muted`,
                      subMenu.href === location.pathname && "bg-muted"
                    )}
                    onClick={() => handleNavigation(subMenu.href)}
                  >
                    {subMenu.icon || <FiPackage className="size-5 text-sky-400" />}
                    <span>{subMenu.title}</span>
                  </li>
                ))}
              </ul>
            )} */}
          </React.Fragment>
        ))}

        <li
          onClick={logout}
          className={`mb-8 flex cursor-pointer items-center gap-x-4 rounded-md p-2 hover:bg-red-100/50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-200`}
        >
          <BiLogOutCircle className="size-6 text-red-500" />
          <span className={`${!open && "hidden"} origin-left duration-200`}>Log out</span>
        </li>
      </ul>

      {/* THEME MANAGE */}
      <div className="flex h-10 w-full items-center border-t pt-4">
        <div className="flex h-full items-center">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              if (!theme || theme === "light") {
                setTheme("dark");
                document.body.classList.add("dark");
                localStorage.setItem(THEME_MODE, "dark");
              } else {
                setTheme("light");
                document.body.classList.remove("dark");
                localStorage.setItem(THEME_MODE, "light");
              }
            }}
          >
            {theme !== "dark" ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

const Menus: Menu[] = [
  {
    title: "Shipments",
    icon: <TbTruckDelivery className="w-7 text-blue-600 h-7" />,
    href: "/shipments",
  },
];
