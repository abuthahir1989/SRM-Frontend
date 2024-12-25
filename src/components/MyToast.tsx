import React from "react";
import { ToastContainer, ToastPosition } from "react-toastify";

type Props = {
    position: ToastPosition;
};

const MyToast: React.FC<Props> = ({position}) => {
  return (
    <ToastContainer
      position={position}
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default MyToast;
