//nextui
import {
    Navbar,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
    Dropdown,
    DropdownTrigger,
    Avatar,
    DropdownMenu,
    DropdownItem,
    Divider,
  } from "@nextui-org/react";
  //React
  import { useState } from "react";
  //heroicons


  export default function Header() {
    const data = {
      logoDekstop: "/assets/logo.png",
      logoMobile: "/assets/logo.png",
    };
  
    const [isMenuOpen] = useState(false);
  

  
    const menuItems = [
        {
            title: "Shipments",
            icon: "",
            href: "/shipments",
        },

    ];
  
    return (
      <Navbar
        className=" z-10 justify-between w-full md:w-11/12 mx-auto h-24 md:h-16 md:pt-10   md:pb-10 bg-zinc-700 lg:bg-[#2e2c2c] backdrop-blur-lg"
        classNames={{
          wrapper: "max-w-full",
        }}
      >
        {/* Logo Mobile */}
        <Link href="/" className="order-2  ml-[4.5%]">
          <img
            src={data.logoMobile}
            alt="logo"
            className="h-20 lg:hidden mx-auto"
          />
        </Link>
  
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden order-1 text-white"
        />
        {/* Mobile Menu */}
        <NavbarMenu dir="rtl" className="bg-zinc-800/95 mt-7 pt-9 space-y-5 ">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <div className="flex gap-2">
                <span> {item.icon}</span>
                <Link className="text-white" href={item.href} size="lg">
                  {item.title}
                </Link>
              </div>
            </NavbarMenuItem>
          ))}
  
          <Divider className="bg-white" />
  
          <Dropdown placement="bottom-start" className="cursor-pointer">
            <DropdownTrigger>
              <div className="flex items-center gap-4">
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                />
                <span className="text-white">
                  {localStorage.getItem("username")}
                </span>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="light"
              className="bg-MainDark"
            >
              <DropdownItem  color="danger">
               
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarMenu>
        {/* Cart Item */}
        <div className="order-3 lg:hidden">
          {/* You can add cart icon or other element here if needed */}
        </div>
      </Navbar>
    );
  }