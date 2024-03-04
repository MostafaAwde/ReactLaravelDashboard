import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setNotification } = useStateContext();

  const [users, setUsers] = useState([
    {
      id: null,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  ]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUsers([data]);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const addUser = () => {
    setUsers([
      ...users,
      {
        id: null,
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
    ]);
  };

  const removeLastUser = () => {
    if (users.length > 1) {
      setUsers(users.slice(0, users.length - 1));
    }
  };

  const isFormValid = (user) => {
    return (
      user.name !== "" &&
      user.email !== "" &&
      user.password !== "" &&
      user.password_confirmation !== ""
    );
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    const saveUsersPromises = users.map((user) => {
      if (!isFormValid(user)) {
        if (user.id) {
          return axiosClient.put(`/users/${user.id}`, user);
        } else {
          return axiosClient.post(`/users`, user);
        }
      }
    });

    Promise.all(saveUsersPromises)
      .then(() => {
        // show noti
        setNotification("Users were successfully saved");
        navigate("/users");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div>
      <h1>{id ? `Update User: ${users[0].name}` : "New User"}</h1>
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <button className="btn" style={{ marginBottom: "10px" }}>
              Save All
            </button>
            {users.map((user, index) => (
              <div key={index}>
                <input
                  value={user.name}
                  onChange={(ev) =>
                    setUsers((prevUsers) => {
                      const newUsers = [...prevUsers];
                      newUsers[index].name = ev.target.value;
                      return newUsers;
                    })
                  }
                  placeholder="Name"
                />
                <input
                  value={user.email}
                  onChange={(ev) =>
                    setUsers((prevUsers) => {
                      const newUsers = [...prevUsers];
                      newUsers[index].email = ev.target.value;
                      return newUsers;
                    })
                  }
                  placeholder="Email"
                  type="email"
                />
                <input
                  onChange={(ev) =>
                    setUsers((prevUsers) => {
                      const newUsers = [...prevUsers];
                      newUsers[index].password = ev.target.value;
                      return newUsers;
                    })
                  }
                  placeholder="Password"
                  type="password"
                />
                <input
                  onChange={(ev) =>
                    setUsers((prevUsers) => {
                      const newUsers = [...prevUsers];
                      newUsers[index].password_confirmation = ev.target.value;
                      return newUsers;
                    })
                  }
                  placeholder="Password Confirmation"
                  type="password"
                />
                {index === users.length - 1 && (
                  <button
                    className="btn"
                    onClick={addUser}
                    disabled={!isFormValid(user)}
                  >
                    Add New User
                  </button>
                )}
                {index === users.length - 1 && index > 0 && (
                  <button
                    className="btn"
                    onClick={removeLastUser}
                    style={{ marginLeft: "10px" }}
                  >
                    Back
                  </button>
                )}
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
};
