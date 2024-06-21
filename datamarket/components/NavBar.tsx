import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";

export const NavBar = ({ title }: { title: string }): React.ReactElement => {
  const router = useRouter();
  return (
    <div className="flex flex-row w-full justify-between items-center p-3">
      <HomeIcon
        style={{ height: "32px", width: "32px", cursor: "pointer" }}
        onClick={(): Promise<boolean> => router.push("/")}
      />
      <h3>{title}</h3>
      <MenuIcon
        style={{ height: "32px", width: "32px", cursor: "pointer" }}
        onClick={(): Promise<boolean> => router.push("/list")}
      />
    </div>
  );
};
