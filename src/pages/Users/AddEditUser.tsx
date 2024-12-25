import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ReactModal from "react-modal";
import { useUserContext } from "../../contexts/UserContext";
import Select from "../../components/Select";
import { toast } from "react-toastify";
import { handleError } from "../../assets/helperFunctions";
import axios, { AxiosResponse } from "axios";
import { colorSecondary, url } from "../../assets/constants";
import Loading from "react-loading";
import MyToast from "../../components/MyToast";
import Checkbox from "../../components/Checkbox";

type Props = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  editId: number;
  setEditId: Dispatch<SetStateAction<number>>;
  onSave: () => void;
};

type Option = {
  label: string;
  value: string;
};

const initialValue = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "",
  agent: "",
  manager_id: "",
  state_id: "",
  phone: "",
  active: true,
  user_id: 1,
};

const roleOptions: Option[] = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "User",
    value: "user",
  },
];

const AddEditUser: React.FC<Props> = ({
  show,
  setShow,
  editId,
  setEditId,
  onSave,
}) => {
  const { user } = useUserContext();
  const [data, setData] = useState({ ...initialValue, user_id: user?.id });
  const [selectedRole, setSelectedRole] = useState<Option | null>(null);
  const [selectedManager, setSelectedManager] = useState<Option | null>(null);
  const [selectedState, setSelectedState] = useState<Option | null>(null);
  const [managerOptions, setManagerOptions] = useState<Option[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const getManagers = async () => {
    try {
      const resp = await axios.get(`${url}managers`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const managers = resp.data.managers.map(
        (m: { id: number; name: string }) => ({ label: m.name, value: m.id })
      );
      setManagerOptions(managers);
    } catch (error) {
      handleError(error);
    }
  };

  const getStates = async () => {
    try {
      const resp = await axios.get(`${url}states`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const states = resp.data.states.map(
        (m: { id: number; name: string }) => ({ label: m.name, value: m.id })
      );
      setStateOptions(states);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.name == "") {
      toast.warn("Please fill the name");
      return;
    }
    if (data.email == "") {
      toast.warn("Please fill the email");
      return;
    }
    if (editId == 0) {
      if (data.password == "" || data.password_confirmation == "") {
        toast.warn("Please fill the password fields");
        return;
      }
    }
    if (data.role == "") {
      toast.warn("Please select role");
      return;
    }
    if (data.state_id == "") {
      toast.warn("Please select state");
      return;
    }

    try {
      setLoading(true);
      let resp: AxiosResponse;

      if (editId > 0) {
        resp = await axios.post(`${url}users/${editId}?_method=PUT`, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
      } else {
        resp = await axios.post(`${url}users`, data, {
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

  const getUser = async (id: number) => {
    try {
      setLoading(true);
      const resp = await axios.get(`${url}users/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const { data } = resp;

      if (data.role) {
        const selectedRole = roleOptions.find((r) => r.value == data.role);
        setSelectedRole(selectedRole ?? null);
      }

      if (data.manager_id) {
        const selectedManager = managerOptions.find(
          (m) => m.value == data.manager_id
        );
        setSelectedManager(selectedManager ?? null);
      }

      if (data.state_id) {
        const selectedState = stateOptions.find(
          (s) => s.value == data.state_id
        );
        setSelectedState(selectedState ?? null);
      }

      setData({
        name: data.name,
        email: data.email,
        password: "",
        password_confirmation: "",
        phone: data.phone ?? "",
        role: data.role,
        agent: data.agent ?? "",
        active: data.active == "1" ? true : false,
        manager_id: data.manager_id,
        state_id: data.state_id,
        user_id: user?.id,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setData(initialValue);
    setSelectedRole(null);
    setSelectedManager(null);
    setSelectedState(null);
    setEditId(0);
  };

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      ...(selectedRole && { role: selectedRole.value }),
      ...(selectedManager && { manager_id: selectedManager.value }),
      ...(selectedState && { state_id: selectedState.value }),
    }));
  }, [selectedRole, selectedManager, selectedState]);

  useEffect(() => {
    if (editId) getUser(editId);
  }, [editId]);

  useEffect(() => {
    getManagers();
    getStates();
  }, []);

  return (
    <ReactModal
      isOpen={show}
      className="modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal__header">
        <h2>{`${editId > 0 ? "Update User" : "Add User"}`}</h2>
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
            <div className="form__group">
              <input
                type="text"
                className="input"
                value={data.name}
                name="name"
                id="name"
                placeholder="Name"
                onChange={handleChange}
                autoFocus
              />
              <label htmlFor="name">Name</label>
            </div>
            <div className="form__group">
              <input
                type="email"
                className="input"
                value={data.email}
                name="email"
                id="email"
                placeholder="Email"
                onChange={handleChange}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form__group">
              <input
                type="text"
                className="input"
                value={data.phone}
                name="phone"
                id="phone"
                placeholder="Phone"
                onChange={handleChange}
              />
              <label htmlFor="phone">Phone</label>
            </div>
            <div className="form__group">
              <input
                type="password"
                className="input"
                value={data.password}
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="form__group">
              <input
                type="password"
                className="input"
                value={data.password_confirmation}
                name="password_confirmation"
                id="password_confirmation"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
              <label htmlFor="password_confirmation">Confirm Password</label>
            </div>
            <div className="form__group">
              <Select
                id="role"
                placeholder="Role"
                options={roleOptions}
                value={selectedRole}
                handleChange={setSelectedRole}
              />
            </div>
            <div className="form__group">
              <input
                type="text"
                className="input"
                value={data.agent}
                name="agent"
                id="agent"
                placeholder="Agent"
                onChange={handleChange}
              />
              <label htmlFor="agent">Agent</label>
            </div>
            <div className="form__group">
              <Select
                id="manager"
                placeholder="Manager"
                options={managerOptions}
                value={selectedManager}
                handleChange={setSelectedManager}
              />
            </div>
            <div className="form__group">
              <Select
                id="state"
                placeholder="State"
                options={stateOptions}
                value={selectedState}
                handleChange={setSelectedState}
              />
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

export default AddEditUser;
