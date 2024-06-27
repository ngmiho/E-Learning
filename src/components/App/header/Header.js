import { useNavigate, useParams } from "react-router-dom";

export default function Header(props) {
  const navigate = useNavigate();
  const userId = !!useParams().userId;
  return (
    <div className="row align-items-end mx-5 ps-2">
      <div
        className="row py-5 img-fluid"
        style={{ backgroundImage: 'url("./images/header.jpg")' }}
      >
        <div className="row">
          <div className="col-md-2">
            <a
              className="nav-link active text-secondary fw-bold my-2"
              aria-current="page"
              href="#"
            >
              <img src="./images/logo.png" alt="" className="d-block w-100" />
            </a>
          </div>
          <div className="col-md-10">
            <div className="row justify-content-md-end pt-5">
              <div className="col-md-2"></div>
              <div className="col-md-auto">
                {!userId ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary text-dark fw-bold border-0"
                    style={{ width: 140 }}
                    onClick={() => navigate(`/login`)}
                  >
                    LOG IN
                  </button>
                ) : (
                  <button
                    href="/login"
                    type="button"
                    className="btn btn-outline-primary text-dark fw-bold border-0"
                    //onClick={() => localStorage.removeItem("token")}
                    onClick={() => {
                      sessionStorage.removeItem("token");
                      navigate(`/login`);
                    }}
                    style={{ width: 140 }}
                  >
                    LOG OUT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="row pt-2">
          <div className="col-md-12">
            <div
              className="navbar-expand-lg bg-body-tertiary card border-5 ms-1"
              style={{ height: 80 }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
