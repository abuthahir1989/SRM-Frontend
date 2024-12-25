import React from "react";

type Props = {
  edit?: boolean;
  editFunction?: () => void;
};

const TableButtons: React.FC<Props> = ({ edit, editFunction }) => {
  return (
    <div className="table-buttons">
      {edit && (
        <svg className="edit" onClick={editFunction}>
          <use xlinkHref="/icons/sprite.svg#icon-new-message"></use>
        </svg>
      )}
    </div>
  );
};

export default TableButtons;
