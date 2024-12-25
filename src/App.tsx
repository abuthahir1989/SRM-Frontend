import { RouterProvider } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import "./styles/main.scss";
import router from "./router";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;
