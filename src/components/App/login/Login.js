import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomizeCheckbox from "../components/form/CustomizeCheckbox";
import CustomizeButton from "../components/form/CustomizeButton";
import CustomizeInputField from "../components/form/CustomizeInputField";

function Login(props) {
  //#Variable
  var [username, setUsername] = useState(() =>
    localStorage.getItem("username")
  );
  var [password, setPassword] = useState("");
  var [isSuccess, setIsSuccess] = useState();
  //End Region

  //When open

  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    // let un = !!localStorage.getItem("username") ? localStorage.getItem("username") : "";
    // if (un.length > 0) setUsername(un);
  }, [username]);

  useEffect(() => {
    setUsername(username);
  }, [username]);

  useEffect(() => {
    setPassword(password);
  }, [password]);

  var [rememberMe, setRememberMe] = useState();
  useEffect(() => {
    setRememberMe(rememberMe);
    console.log(rememberMe);
  }, [rememberMe]);
  useEffect(() => {
    if (!!localStorage.getItem("username")) setRememberMe(true);
  }, []);

  const verifyToken = async () => {
    // let token = localStorage.getItem("token")
    // let isLogin = !!localStorage.getItem("token")
    let token = sessionStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin)
      axios
        .get("http://localhost:3001/api/v1/users/token/verify/" + token)
        .then(async (res) => {
          if (res.data.token.length === 0) {
            //localStorage.removeItem("token")
            sessionStorage.removeItem("token");
            navigate(`/login`);
          } else if (res.data.token === token) {
            //let res = await axios.get("http://localhost:3001/api/v1/users/" + res.data.id)
            //let data = await res.json()
            if (res.data.roleId === "1") {
              navigate(`/${res.data.id}/admin/lessons`);
            } else if (res.data.roleId === "2") {
              navigate(`/${res.data.id}/lessons`);
            }
          } else {
            //localStorage.removeItem("token")
            //localStorage.setItem("token", res.data.token)
            sessionStorage.removeItem("token");
            sessionStorage.setItem("token", res.data.token);
            if (res.data.roleId === "1") {
              navigate(`/${res.data.id}/admin/lessons`);
            } else if (res.data.roleId === "2") {
              navigate(`/${res.data.id}/lessons`);
            }
          }
        })
        .catch((er) => console.log(er));
  };

  const handleAuthentication = async () => {
    if (username.length > 0 && password.length > 0)
      axios
        .get("http://localhost:3001/api/v1/users/" + username + "/" + password)
        .then((res) => {
          var currentUser = res.data[0];
          console.log(currentUser);
          axios(
            "http://localhost:3001/api/v1/users/token/create/" +
              currentUser.id +
              "/" +
              currentUser.username +
              "/" +
              currentUser.roleId
          )
            .then((res) => {
              sessionStorage.setItem("token", res.data);
            })
            .catch((er) => console.log(er));
          if (currentUser.roleId === 1) {
            navigate(`/${currentUser.id}/admin/lessons`);
          } else if (currentUser.roleId === 2) {
            navigate(`/${currentUser.id}/lessons`);
          }

          if (rememberMe)
            localStorage.setItem("username", currentUser.username);
          else localStorage.removeItem("username");
        })
        .catch((er) => console.log(er));
  };

  const handleCancel = () => {
    navigate(`/`);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="row my-4 mx-5">
      <div className="col-md-6 my-6 offset-3">
        {/* Sign In Form */}
        <div className="card p-4">
          <form>
            <div className="mb-3">
              <h2 align="middle">LOG IN</h2>
            </div>
            <CustomizeInputField
              {...{
                label: "Username",
                type: "text",
                value: username,
                onChange: setUsername,
              }}
            />
            <CustomizeInputField
              {...{
                label: "Password",
                type: "password",
                value: password,
                onChange: setPassword,
              }}
            />
            <CustomizeCheckbox
              label="Remember me?"
              value={rememberMe}
              onChange={handleRememberMe}
            />
            <CustomizeButton
              type="button"
              className="btn btn-outline-primary me-1"
              text="Login"
              onClick={handleAuthentication}
            />
          </form>
        </div>
        {/* Sign In Form */}
      </div>
    </div>
  );
}

export default Login;
