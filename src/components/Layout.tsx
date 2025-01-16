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
    <div id="layout">
      <Navbar />
      <div className="work-space" id="work-space">
        <Outlet />
        <MyToast position="bottom-right" containerId="layout" />
      </div>
    </div>
  );
};

export default Layout;
