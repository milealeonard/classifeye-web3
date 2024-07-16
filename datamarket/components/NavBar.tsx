import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";

export const NavBar = ({ title }: { title: string }): React.ReactElement => {
  const router = useRouter();
  // const [isOpen, setIsOpen] = React.useState(false);
  // const toggleMenu = () => {
  //   setIsOpen(!isOpen);
  // }
  return (
    <div className="w-full">
      <div className="border-2 border-red-400 border-dotted">
        <div className="flex flex-row w-full justify-between items-center p-3">
          <HomeIcon
            style={{ height: "32px", width: "32px", cursor: "pointer" }}
            onClick={(): Promise<boolean> => router.push("/")}
          />
          <h1 className="text-xl">{title}</h1>
          <MenuIcon
            style={{ height: "32px", width: "32px", cursor: "pointer" }}
            onClick={() => router.push("list")}
          />
        </div>
      </div>
      {/* {isOpen && (
        <p>Hello</p>
      )} */}
    </div>
  );
};
