import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useUserContext } from "../../contexts/UserContext";
import Checkbox from "../../components/Checkbox";
import Loading from "react-loading";
import { colorSecondary, url } from "../../assets/constants";
import MyToast from "../../components/MyToast";
import { handleError } from "../../assets/helperFunctions";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";

type Props = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  editId: number;
  setEditId: Dispatch<SetStateAction<number>>;
  onSave: () => void;
};

const initialValue = {
  name: "",
  active: true,
  user_id: 1,
};

const AddEditPurpose: React.FC<Props> = ({
  show,
  setShow,
  editId,
  setEditId,
  onSave,
}) => {
  const { user } = useUserContext();
  const [data, setData] = useState({ ...initialValue, user_id: user?.id });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setData(initialValue);
    setEditId(0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.name == "") {
      toast.warn("Please fill the name");
      return;
    }

    try {
      setLoading(true);
      let resp: AxiosResponse;

      if (editId > 0) {
        resp = await axios.post(`${url}purposes/${editId}?_method=PUT`, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
      } else {
        resp = await axios.post(`${url}purposes`, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
      }

      toast.success(resp.data.message);
      resetForm();
      onSave();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const getPurpose = async (id: number) => {
    try {
      setLoading(true);
      const resp = await axios.get(`${url}purposes/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const { data } = resp;

      setData({
        name: data.name,
        active: data.active == "1" ? true : false,
        user_id: user?.id,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editId) getPurpose(editId);
  }, [editId]);

  return (
    <ReactModal
      isOpen={show}
      className="modal modal--purpose"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal__header">
        <h2>{`${editId > 0 ? "Update Purpose" : "Add Purpose"}`}</h2>
        <svg
          onClick={() => {
            setShow(false);
            resetForm();
          }}
        >
          <use xlinkHref="/icons/sprite.svg#icon-cross"></use>
        </svg>
      </div>
      <div className="modal__body">
        <form action="#" method="post" className="form" onSubmit={handleSubmit}>
          <div className="modal__inputs">
            <div className="form__group full">
              <input
                type="text"
                className="input"
                value={data.name}
                name="name"
                id="name"
                placeholder="Name"
                onChange={(e) => setData({ ...data, name: e.target.value?.toUpperCase() })}
                autoFocus
              />
              <label htmlFor="name">Name</label>
            </div>
            {editId > 0 && (
              <div className="form__group">
                <Checkbox
                  name="active"
                  labelText="Active"
                  value={data.active}
                  handleChange={(e) =>
                    setData({ ...data, active: e.target.checked })
                  }
                />
              </div>
            )}
          </div>
          <div className="modal__actions">
            {loading ? (
              <div className="loading">
                <Loading color={colorSecondary} type="bars" />
              </div>
            ) : (
              <button type="submit" className="btn">
                {`${editId > 0 ? "Update" : "Save"}`}
              </button>
            )}
          </div>
        </form>
        <MyToast position="bottom-left" />
      </div>
    </ReactModal>
  );
};

export default AddEditPurpose;
