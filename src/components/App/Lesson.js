import "./Lesson.css";
import { useState } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import Login from "../form/Login";
import Admin from "./lesson/Admin";
import User from "./lesson/User";

function Lesson() {
  var [isLogin, setIsLogin] = useState(true);
  var [isAdmin, setIsAdmin] = useState(true);
  //for re-render
  var [formKey, setFormKey] = useState(false);

  return (
    <div className="container">
      <Header />
      {/* Login Component */}
      {!isLogin && (
        <Login
          isLogin={isLogin}
          isAdmin={isAdmin}
          setIsLogin={setIsLogin}
          setIsAdmin={setIsAdmin}
        />
      )}
      {/* User Component*/}
      {isLogin && !isAdmin && <User />}
      {/* Administrator Component */}
      {isLogin && isAdmin && (
        <Admin
          key={formKey}
          formKey={formKey}
          setFormKey={setFormKey}
          isAdmin={isAdmin}
        />
      )}
      <Footer />
    </div>
  );
}

export default Lesson;
