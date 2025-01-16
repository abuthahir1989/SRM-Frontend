import React from "react";

type Props = {
  edit?: boolean;
  editFunction?: () => void;
  pdf?: boolean;
  pdfURL?: string;
};

const TableButtons: React.FC<Props> = ({ edit, editFunction, pdf, pdfURL }) => {
  return (
    <div className="table-buttons">
      {edit && (
        <svg className="edit" onClick={editFunction}>
          <use xlinkHref="/icons/sprite.svg#icon-new-message"></use>
        </svg>
      )}
      {pdf && pdfURL && (
        <svg
          className="pdf"
          onClick={() => {
            window.open(pdfURL, "_blank");
          }}
        >
          <use xlinkHref="/icons/sprite.svg#icon-file-text"></use>
        </svg>
      )}
    </div>
  );
};

export default TableButtons;
