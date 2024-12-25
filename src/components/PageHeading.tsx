import React from "react";
import Loading from "react-loading";
import { colorSecondary } from "../assets/constants";

type Props = {
  title: string;
  firstButtonText: string;
  firstButtonIcon: string;
  firstButtonFunction: () => void;
  loading?: boolean;
};

const PageHeading: React.FC<Props> = ({
  title,
  firstButtonText,
  firstButtonIcon,
  firstButtonFunction,
  loading,
}) => {
  return (
    <>
      <div className="heading">
        <div className="heading__title">
          <h2>{title}</h2>
        </div>
        <div className="loading">
          {loading && <Loading color={colorSecondary} type="bars" />}
        </div>
        <div className="buttons">
          <button className="btn" onClick={firstButtonFunction}>
            <svg>
              <use
                xlinkHref={`/icons/sprite.svg#icon-${firstButtonIcon}`}
              ></use>
            </svg>
            {firstButtonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default PageHeading;
