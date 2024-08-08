import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";

export const NavBar = ({ title }: { title: string }): React.ReactElement => {
  const router = useRouter();
  return (
    <div className="z-10 bg-lightGray w-full fixed top-0 left-0">
      <div className="border-b-2 border-black">
        <div className="flex flex-row w-full justify-between items-center p-3">
          <HomeIcon
            style={{ height: "32px", width: "32px", cursor: "pointer" }}
            onClick={(): Promise<boolean> => router.push("/")}
          />
          <h1 className="text-xl">{title}</h1>
          <MenuIcon
            style={{ height: "32px", width: "32px", cursor: "pointer" }}
            onClick={() => router.push("my-datasets")}
          />
        </div>
      </div>
    </div>
  );
};
