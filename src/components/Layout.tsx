import { useEffect } from "react";
import { useUserContext } from "../contexts/UserContext";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router";
import MyToast from "./MyToast";

type Props = {};

const Layout: React.FC<Props> = ({}) => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="work-space">
        <Outlet />
        <MyToast position="top-right" />
      </div>
    </>
  );
};

export default Layout;
