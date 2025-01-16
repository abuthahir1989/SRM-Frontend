import React from "react";
import { ToastContainer, ToastPosition } from "react-toastify";

type Props = {
    position: ToastPosition;
    containerId: string;
};

const MyToast: React.FC<Props> = ({position, containerId}) => {
  return (
    <ToastContainer
      position={position}
      containerId={containerId}
      autoClose={1500}
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
