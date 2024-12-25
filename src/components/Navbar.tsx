import React, { useEffect, useRef, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import axios from "axios";
import { url } from "../assets/constants";
import { handleError } from "../assets/helperFunctions";
import { useNavigate } from "react-router";

type Props = {};

const Navbar: React.FC<Props> = ({}) => {
  const [showSideNav, setShowSideNav] = useState(false);
  const sideBarRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLLIElement | null>(null);
  const { user, removeUser } = useUserContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post(
        `${url}logout`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      removeUser();
      setShowSideNav(false);
      navigate("/login", { replace: true });
    } catch (error: any) {
      handleError(error);
      console.log(error?.status);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sideBarRef.current &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !sideBarRef.current.contains(event.target as Node)
      ) {
        setShowSideNav(false); // Close scanner on outside click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, [setShowSideNav]);

  return (
    <>
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <a href="#" className="nav__link">
              <svg className="app-icon">
                <use xlinkHref="/icons/sprite.svg#icon-t-shirt"></use>
              </svg>
              <h1 className="app-name">Sales Pulse</h1>
            </a>
          </li>
          <li
            className="nav__item"
            onClick={() => setShowSideNav(!showSideNav)}
            ref={buttonRef}
          >
            <a
              href="#"
              className={`nav__link nav__btn ${showSideNav ? "open" : ""}`}
            >
              <span className="nav__icon"></span>
            </a>
          </li>
        </ul>
      </nav>
      <nav className={`side-nav ${showSideNav ? "open" : ""}`} ref={sideBarRef}>
        <ul className="side-nav__list">
          <li
            className="side-nav__item"
            onTouchStart={(e) => e.currentTarget.classList.add("hover")}
            onTouchEnd={(e) => e.currentTarget.classList.remove("hover")}
          >
            <a
              href="#"
              className="side-nav__link"
              onClick={() => {
                navigate("/user");
                setShowSideNav(false);
              }}
            >
              <svg className="side-nav__icon">
                <use xlinkHref="/icons/sprite.svg#icon-user"></use>
              </svg>
              User
            </a>
          </li>
          <li
            className="side-nav__item"
            onTouchStart={(e) => e.currentTarget.classList.add("hover")}
            onTouchEnd={(e) => e.currentTarget.classList.remove("hover")}
          >
            <a
              href="#"
              className="side-nav__link"
              onClick={() => {
                navigate("/purpose");
                setShowSideNav(false);
              }}
            >
              <svg className="side-nav__icon">
                <use xlinkHref="/icons/sprite.svg#icon-target"></use>
              </svg>
              Purpose
            </a>
          </li>
          <li
            className="side-nav__item"
            onTouchStart={(e) => e.currentTarget.classList.add("hover")}
            onTouchEnd={(e) => e.currentTarget.classList.remove("hover")}
          >
            <a
              href="#"
              className="side-nav__link"
              onClick={() => {
                navigate("/contact");
                setShowSideNav(false);
              }}
            >
              <svg className="side-nav__icon">
                <use xlinkHref="/icons/sprite.svg#icon-address-book"></use>
              </svg>
              Contact
            </a>
          </li>
          <li
            className="side-nav__item"
            onTouchStart={(e) => e.currentTarget.classList.add("hover")}
            onTouchEnd={(e) => e.currentTarget.classList.remove("hover")}
          >
            <a
              href="#"
              className="side-nav__link"
              onClick={() => {
                navigate("/visit");
                setShowSideNav(false);
              }}
            >
              <svg className="side-nav__icon">
                <use xlinkHref="/icons/sprite.svg#icon-eye"></use>
              </svg>
              Visit
            </a>
          </li>
          <li
            className="side-nav__item"
            onTouchStart={(e) => e.currentTarget.classList.add("hover")}
            onTouchEnd={(e) => e.currentTarget.classList.remove("hover")}
          >
            <a href="#" className="side-nav__link" onClick={logout}>
              <svg className="side-nav__icon">
                <use xlinkHref="/icons/sprite.svg#icon-log-out"></use>
              </svg>
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
