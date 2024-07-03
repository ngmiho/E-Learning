import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Admin.css";

export default function Admin() {
  //handle authentication
  var params = useParams();
  var userId = params.userId;
  //handle initialData
  var [data, setData] = useState([]);
  //handle binding value
  var [id, setId] = useState("");
  var [lessonCategoryId, setLessonCategoryId] = useState("");
  var [name, setName] = useState("");
  var [description, setDescription] = useState("");
  var [type, setType] = useState("");
  var [content, setContent] = useState("");
  var [order, setOrder] = useState("");
  var [locationPath, setLocationPath] = useState("");
  var [uploadedBy, setUploadedBy] = useState("");
  var [createdAt, setCreatedAt] = useState("");
  var [updatedAt, setUpdatedAt] = useState("");
  var [file, setFile] = useState();
  var bodyLesson = {
    id: id,
    lessonCategoryId: lessonCategoryId,
    name: name,
    description: description,
    type: type,
    content: content,
    order: order,
    locationPath: locationPath,
    uploadedBy: uploadedBy,
    createdAt: createdAt,
    updatedAt: updatedAt,
    file: file,
  };
  //handle render order input
  var arrNumber = data
    .filter((e) => e.lessonCategoryId === bodyLesson.lessonCategoryId)
    .map((e) => e.order);
  //handle render modal
  var [modalType, setModalType] = useState("");
  var [modalName, setModalName] = useState("");
  var [modalLocationPath, setModalLocationPath] = useState("");
  //handle locationPath when choose Edit button
  var [isEdit, setIsEdit] = useState(false);
  var [currentLocationPath, setCurrentLocationPath] = useState("");
  //handle pagination
  var limit = 5;
  var [currentPage, setCurrentPage] = useState(1);
  var [rowsPerPage] = useState(5);
  var indexOfLastRecord = currentPage * rowsPerPage;
  var indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  var currentRows = data.slice(indexOfFirstRecord, indexOfLastRecord);
  var nPages = Math.ceil(data.length / rowsPerPage);
  //handle checkbox
  var [toggleId, setToggleId] = useState(false);
  var [ids, setIds] = useState([]);
  var [locationPaths, setLocationPaths] = useState([]);
  //handle validation
  var [inputNameError, setInputNameError] = useState(false);
  var [inputOrderError, setInputOrderError] = useState(false);
  var [inputLocationPathError, setInputLocationPathError] = useState(false);

  var [changeData, setChangeData] = useState(false);

  //handle reset form
  const resetForm = () => {
    setLessonCategoryId(1);
    setName("");
    setDescription("");
    setType("VIDEO");
    setContent("");
    setOrder(0);
    setLocationPath("");
    setUploadedBy("1");
    setCreatedAt(parseDate(new Date(), "dd-MM-yyyy"));
    setUpdatedAt(parseDate(new Date(), "dd-MM-yyyy"));
    setFile(null);
    setIsEdit(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/v1/lessons")
      .then((res) => {
        setData(res.data);
        setLessonCategoryId(1);
        setType("VIDEO");
        setUploadedBy(1);
        setOrder(0);
        setCreatedAt(parseDate(new Date()));
        setUpdatedAt(parseDate(new Date()));
      })
      .catch((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
      });
  }, [changeData]);

  //interceptor
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = () => {
    //let token = localStorage.getItem("token");
    //let isLogin = !!localStorage.getItem("token");
    let token = sessionStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin)
      axios
        .get("http://localhost:3001/api/v1/users/token/verify/" + token)
        .then((res) => {
          if (res.data.token.length === 0) {
            //localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            setUser();
            navigate(`/login`);
            return false;
          } else if (res.data.token === token) {
            //setRoleId(res.data.roleId)
            getUser(res.data.id);
            return true;
          } else {
            //localStorage.setItem("token", res.data.token);
            sessionStorage.setItem("token", res.data.token);
            //setRoleId(res.data.roleId)
            getUser(res.data.id);
            return true;
          }
        })
        .catch((er) => console.log(er));
    else {
      //alert("Please login first") //can view admin page layout before redirect login page
      setUser();
      navigate(`/login`);
      return false;
    }
  };

  const getUser = async (id) => {
    let res = await axios
      .get("http://localhost:3001/api/v1/users/" + id)
      .catch((er) => console.log(er));
    let user = res.data[0];
    setUser(user);
  };

  const navigate = useNavigate();

  //var [roleId, setRoleId] = useState()

  var [user, setUser] = useState();

  useEffect(() => {
    //setRoleId(roleId)
    setUser(user);
  }, [user]);

  var getLesson = (id) => {
    axios
      .get("http://localhost:3001/api/v1/lessons/" + id)
      .then((res) => {
        setId(res.data[0].id);
        setLessonCategoryId(res.data[0].lessonCategoryId);
        setName(res.data[0].name);
        setDescription(res.data[0].description);
        setType(res.data[0].type);
        setContent(res.data[0].content);
        setOrder(res.data[0].order);
        setLocationPath(res.data[0].locationPath);
        setUploadedBy(res.data[0].uploadedBy);
        let createdAtTemporary = new Date(res.data[0].createdAt);
        let updatedAtTemporary = new Date(res.data[0].updatedAt);
        setCreatedAt(parseDate(createdAtTemporary));
        setUpdatedAt(parseDate(updatedAtTemporary));
      })
      .catch((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
      });
  };

  const parseDate = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //#api
  const postLesson = () => {
    var formData = new FormData();
    handleFormData(formData, bodyLesson);
    formData.append("createdAt", format(new Date(), "yyyy-MM-dd"));
    axios
      .post("http://localhost:3001/api/v1/lessons", formData)
      .then((res) => {
        if (res) {
          setChangeData(!changeData);
        } else {
          console.log(res);
        }
      })
      .catch((er) => console.log(er));
  };

  const putLesson = () => {
    var formData = new FormData();
    handleFormData(formData, bodyLesson);
    formData.append("currentLocationPath", currentLocationPath);
    formData.append("createdAt", bodyLesson.createdAt);
    axios
      .put("http://localhost:3001/api/v1/lessons/" + id, formData)
      .then((res) => {
        setChangeData(!changeData);
      })
      .catch((er) => console.log(er));
  };

  var handleFormData = (formData, bodyLesson) => {
    formData.append("id", bodyLesson.id);
    formData.append("lessonCategoryId", bodyLesson.lessonCategoryId);
    formData.append("name", bodyLesson.name);
    formData.append("description", bodyLesson.description);
    formData.append("type", bodyLesson.type);
    formData.append("content", bodyLesson.content);
    formData.append("order", bodyLesson.order);
    formData.append("locationPath", bodyLesson.locationPath);
    formData.append("uploadedBy", bodyLesson.uploadedBy);
    formData.append("updatedAt", format(new Date(), "yyyy-MM-dd"));
    formData.append("file", bodyLesson.file);
  };

  const deleteLesson = (id, locationPath) => {
    var formData = new FormData();
    formData.append("locationPath", locationPath);

    axios
      .delete("http://localhost:3001/api/v1/lessons/" + id, {
        params: { locationPath: locationPath },
      })
      .then((res) => {
        setChangeData(!changeData);
      })
      .catch((error) => console.error("Erorr:", error));
  };

  const edit = (lessonId, locationPath) => {
    verifyToken();

    //let isLogin = !!localStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin) {
      if (user.roleId === 1) {
        setCurrentLocationPath(locationPath);
        if (!isEdit) setIsEdit(true);
        let id = lessonId;
        getLesson(id);
        //handle for update()
        const fetchFiles = async () => {
          try {
            const response = await axios.get(
              "http://localhost:3001/api/v1/lessons/files/" + locationPath,
              {
                responseType: "blob",
              }
            );

            const fetchedFile = new File([response.data], locationPath, {
              type: response.data.type,
            });

            setFile(fetchedFile);
          } catch (error) {
            console.error("Error fetching files:", error);
          }
        };
        fetchFiles();

        document.getElementById("cursor").focus();
      } else {
        notify("User role doesn't have permission", "error");
      }
    }
  };
  //#api

  //#CRUD
  var [dataChange, setDataChange] = useState(false);
  const create = () => {
    verifyToken();

    //let isLogin = !!localStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin) {
      if (user.roleId === 1) {
        if (validation()) {
          let isExists = data.filter((e) => e.name === bodyLesson.name);
          if (isExists.length === 0) {
            postLesson();
            notify("Created successfully!!!", "success");
            setDataChange(!dataChange);
          } else {
            notify("Duplicates name's lesson!!!", "danger");
          }
        } else {
          notify("Create failed!", "error");
        }
      } else {
        notify("User role doesn't have permission to modify", "error");
        notify("Create failed!", "error");
      }
    }
  };

  const update = () => {
    verifyToken();

    //let isLogin = !!localStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin) {
      if (user.roleId === 1) {
        if (validation()) {
          putLesson();
          notify("Update successfully!!!", "success");
          setDataChange(!dataChange);
        } else {
          notify("Update failed!", "error");
        }
      } else {
        notify("User role doesn't have permission to modify", "error");
        notify("Update failed!", "error");
      }
    }
  };

  const destroy = (id, locationPath) => {
    verifyToken();

    //let isLogin = !!localStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin) {
      if (user.roleId === 1) {
        deleteLesson(id, locationPath);
        notify("Delete successfully!!!", "success");
        setDataChange(!dataChange);
        if (data.length - 1 === indexOfFirstRecord) prevPage();
      } else {
        notify("User role doesn't have permission to modify", "error");
        notify("Delete failed!", "error");
      }
    }
  };

  var handleIds = (lessonId) => {
    if (ids.indexOf(lessonId) === -1) setIds([...ids, lessonId]);
    else setIds(ids.filter((e) => e !== lessonId));
  };
  var handleLocationPaths = (locationPath) => {
    if (locationPaths.indexOf(locationPath) === -1)
      setLocationPaths([...locationPaths, locationPath]);
    else setLocationPaths(locationPaths.filter((e) => e !== locationPath));
  };

  var handleAllId = () => {
    let arrId = [];
    let arrLocationPath = [];
    let idsBefore = ids.length;
    if (ids.length > 0) {
      setIds(arrId);
      setIds(arrLocationPath);
      if (idsBefore === data.length) return;
    }
    data.forEach((e) => {
      arrId.push(e.id);
      arrLocationPath.push(e.locationPath);
    });
    setIds(arrId);
    setLocationPaths(arrLocationPath);
  };

  const deleteLessons = () => {
    verifyToken();

    //let isLogin = !!localStorage.getItem("token");
    let isLogin = !!sessionStorage.getItem("token");
    if (isLogin) {
      if (user.roleId === 1) {
        if (window.confirm("Confirm to delete?")) {
          for (let i = 0; i < ids.length && i < locationPaths.length; ++i) {
            deleteLesson(ids[i], locationPaths[i]);
            notify("Deleted lesson id " + ids[i] + " successfully!", "success");
          }
          setIds([]);
          setLocationPaths([]);
        }
      } else {
        notify("User role doesn't have permission to modify", "error");
        notify("Update failed!", "error");
      }
    }
  };
  //#CRUD

  //#Validation
  const isStringNull = (str) => {
    if (bodyLesson.name.length == 0) return true;
    return false;
  };

  const isFile = () => {
    let path = bodyLesson.locationPath;
    if (
      path.includes(".mp4") ||
      path.includes(".png") ||
      path.includes(".jpg") ||
      path.includes(".pdf") ||
      path.includes(".docx")
    )
      return true;
    return false;
  };

  const validation = () => {
    let isError = false;
    let name = bodyLesson.name;
    let path = bodyLesson.locationPath;
    if (isStringNull(name)) {
      // error += "Name can't be null.\n"
      notify("Name can't be null", "danger");
      isError = true;
      setInputNameError(true);
    }
    if (!isFile(path) || file === null) {
      //error += "Incorrect type of file\n"
      notify("Incorrect type of file", "danger");
      isError = true;
      setInputLocationPathError(true);
    }
    if (bodyLesson.order === 0) {
      //error += "Please choose order\n"
      notify("Please choose order", "danger");
      isError = true;
      setInputOrderError(true);
    }

    if (isError) {
      return false;
    }
    return true;
  };

  const notify = (message, type) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      className: "toastify-" + type,
    });
  };
  //#Validation

  var handleType = (locationPath) => {
    let tailLocationPath = locationPath.split(".").pop().toLowerCase();
    switch (tailLocationPath) {
      case "pdf":
        return "application/pdf";
      case "png":
        return "image/png";
      case "jpeg":
        return "image/jpeg";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
  };

  //#handle modal test
  const handleModal = (name, locationPath) => {
    setModalName(name);
    setModalLocationPath(locationPath);

    let tailLocationPath = locationPath.split(".").pop().toLowerCase();
    switch (tailLocationPath) {
      case "pdf":
        setModalType("application/pdf");
        break;
      case "png":
        setModalType("image/png");
        break;
      case "jpeg":
        setModalType("image/jpeg");
        break;
      case "docx":
        setModalType(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        break;
    }
  };

  var checkLessonCategoryId = (id) => {
    if (id === 1) return "Beginning";
    else if (id === 2) return "Basic";
    else if (id === 3) return "Advance";
  };
  //#handle modal

  //#Pagination
  var rows = (data) => {
    return (
      <tbody>
        {data.map((e, i) => (
          <tr key={e.id}>
            <td>
              <input
                className="ms-3"
                id={"rowCheckbox" + e.id}
                type="checkbox"
                checked={ids.indexOf(e.id) !== -1 ? true : false}
                onChange={() => {
                  handleLocationPaths(e.locationPath);
                  handleIds(e.id);
                }}
              />
            </td>
            <th scope="row">{i + 1 + (currentPage - 1) * limit}</th>
            <td
              style={{
                maxWidth: 150,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {e.name}
            </td>
            <td>{e.type}</td>
            <td
              style={{
                maxWidth: 150,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {e.description}
            </td>
            <td
              style={{
                maxWidth: 150,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {e.content}
            </td>
            <td>{checkLessonCategoryId(e.lessonCategoryId)}</td>
            <td>{e.order}</td>
            <td style={{ maxWidth: 150 }}>
              <a
                href="#"
                className="text-primary"
                onClick={() => {
                  handleModal(e.name, e.locationPath);
                  setIsEdit(false);
                  handleType(e.locationPath);
                }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                {e.locationPath.substring(0, 11) +
                  "..." +
                  e.locationPath.substring(e.locationPath.length - 4)}
              </a>
            </td>
            <td>{e.uploadedBy === 1 ? "Admin1" : "Null"}</td>
            <td>{format(new Date(e.createdAt), "MM/dd/yyyy")}</td>
            <td>{format(new Date(e.updatedAt), "MM/dd/yyyy")}</td>
            <td>
              <button
                type="button"
                className="btn btn-outline-info"
                onClick={() => edit(e.id, e.locationPath)}
                style={{ width: 70 }}
              >
                Edit
              </button>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-outline-danger me-2"
                onClick={() => destroy(e.id, e.locationPath)}
                style={{ width: 70 }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  var pageNumbers = [...Array(nPages + 1).keys()].slice(1);
  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };

  var pagination = (nPages, currentPage, setCurrentPage) => {
    return (
      <div className="row">
        <div className="col-md-12">
          <nav>
            <ul className="pagination justify-content-center">
              {nPages > 1 && (
                <li key="paginationPreviousButton" className="page-item">
                  <button
                    className="btn btn-outline-primary page-link"
                    onClick={prevPage}
                    href="#"
                  >
                    Previous
                  </button>
                </li>
              )}

              {pageNumbers
                .filter(
                  (pgNumber) =>
                    pgNumber >= currentPage - 4 && pgNumber <= currentPage + 4
                )
                .map((pgNumber) => {
                  if (
                    pgNumber > currentPage - 3 &&
                    pgNumber < currentPage + 3
                  ) {
                    return (
                      <li
                        key={pgNumber}
                        className={`page-item ${
                          currentPage === pgNumber ? "active" : ""
                        } `}
                      >
                        <button
                          className="btn btn-outline-primary page-link"
                          onClick={() => setCurrentPage(pgNumber)}
                        >
                          {pgNumber}
                        </button>
                      </li>
                    );
                  } else if (pgNumber === currentPage - 3) {
                    return (
                      <>
                        <li key="paginationFirst" className="page-item">
                          <button
                            className="btn btn-outline-primary page-link"
                            onClick={() => setCurrentPage(1)}
                            href="#"
                          >
                            1
                          </button>
                        </li>
                        <li key="paginationPrevious" className="page-item">
                          <button
                            className="btn btn-outline-primary page-link"
                            onClick={prevPage}
                            href="#"
                          >
                            ...
                          </button>
                        </li>
                      </>
                    );
                  } else if (pgNumber === currentPage + 3) {
                    return (
                      <>
                        <li key="paginationNext" className="page-item">
                          <button
                            className="btn btn-outline-primary page-link"
                            onClick={nextPage}
                            href="#"
                          >
                            ...
                          </button>
                        </li>
                        <li key="paginationLast" className="page-item">
                          <button
                            className="btn btn-outline-primary page-link"
                            onClick={() => setCurrentPage(nPages)}
                            href="#"
                          >
                            {nPages}
                          </button>
                        </li>
                      </>
                    );
                  }
                })}

              {nPages > 1 && (
                <li key="paginationNextButton" className="page-item">
                  <button
                    className="btn btn-outline-primary page-link"
                    onClick={nextPage}
                    href="#"
                  >
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    );
  };
  //#Pagination

  function Details() {
    return (
      <form className="row gy-3" htmlFor="details">
        <div className="col-md-12">
          <label className="form-label fw-semibold" htmlFor="detailsUploadedBy">
            Uploaded By
          </label>
          <input
            id="detailsUploadedBy"
            type="text"
            className="form-control"
            value={userId === "1" ? "Admin1" : "Null"}
            disabled
          />
        </div>
        <div className="col-md-6">
          <label
            className="form-label fw-semibold"
            htmlFor="detailsLessonCategoryId"
          >
            Level
          </label>
          <select
            id="detailsLessonCategoryId"
            className="form-select"
            value={lessonCategoryId}
            onChange={(e) => {
              setLessonCategoryId(parseInt(e.target.value));
            }}
          >
            <option value="1">Beginning</option>
            <option value="2">Basic</option>
            <option value="3">Advance</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="detailsType">
            Type
          </label>
          <select
            id="detailsType"
            className="form-select"
            value={bodyLesson.type}
            onChange={(e) => {
              setType(e.target.value);
              setFile(null);
            }}
          >
            <option value="VIDEO">VIDEO</option>
            <option value="PDF">PDF</option>
            <option value="DOCUMENT">DOCUMENT</option>
            <option value="EXAM">EXAM</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" htmlFor="cursor">
            *Name
          </label>
          <input
            type="text"
            id="cursor"
            className={
              inputNameError ? "form-control border-danger" : "form-control"
            }
            value={bodyLesson.name}
            maxLength="100"
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.length == 100)
                notify(
                  "Maximum length of lesson name is 100 characters",
                  "danger"
                );
              if (isEdit) {
                setIsEdit(false);
                setFile(null);
              }
            }}
            onFocus={() => setInputNameError(false)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" htmlFor="detailsOrder">
            *Order
          </label>
          <select
            id="detailsOrder"
            className={
              inputOrderError ? "form-select border-danger" : "form-select"
            }
            value={bodyLesson.order}
            onChange={(e) => setOrder(e.target.value)}
            onFocus={() => setInputOrderError(false)}
          >
            <option>Choose...</option>
            {[...Array(100).keys()].slice(1).map((e) => (
              <option
                key={e}
                value={e}
                className={
                  arrNumber.includes(e) ? "text-light bg-secondary" : ""
                }
                disabled={arrNumber.includes(e)}
              >
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="detailsCreatedAt">
            Created At
          </label>
          <input
            id="detailsCreatedAt"
            type="date"
            className="form-control"
            value={bodyLesson.createdAt}
            disabled
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="detailsUpdatedAt">
            Updated At
          </label>
          <input
            id="detailsUpdatedAt"
            type="date"
            className="form-control"
            value={bodyLesson.updatedAt}
            disabled
          />
        </div>
        <div className="col-md-6">
          <label
            className="form-label fw-semibold"
            htmlFor="detailsDescription"
          >
            Description
          </label>
          <textarea
            type="text"
            id="detailsDescription"
            className="form-control"
            value={bodyLesson.description}
            maxLength="256"
            rows="5"
            cols="40"
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.length == 256)
                notify(
                  "Maximum length of lesson name is 256 characters",
                  "danger"
                );
            }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" htmlFor="detailsContent">
            Content
          </label>
          <textarea
            id="detailsContent"
            type="text"
            className="form-control"
            value={bodyLesson.content}
            rows="5"
            cols="40"
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value.length == 256)
                notify(
                  "Maximum length of lesson name is 256 characters",
                  "danger"
                );
            }}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" htmlFor="locationPath">
            *File Name
          </label>
          {type === "VIDEO" && (
            <input
              type="file"
              accept=".mp4"
              className={
                inputLocationPathError
                  ? "form-control border-danger"
                  : "form-control"
              }
              id="locationPath"
              onChange={(e) => {
                setLocationPath(e.target.files[0].name);
                setFile(
                  e.target.files[0].name.includes(".mp4")
                    ? e.target.files[0]
                    : null
                );
              }}
              onFocus={() => setInputLocationPathError(false)}
            />
          )}
          {type === "PDF" && (
            <input
              type="file"
              accept=".pdf"
              className={
                inputLocationPathError
                  ? "form-control border-danger"
                  : "form-control"
              }
              id="locationPath"
              onChange={(e) => {
                setLocationPath(e.target.files[0].name);
                setFile(
                  e.target.files[0].name.includes(".pdf")
                    ? e.target.files[0]
                    : null
                );
              }}
            />
          )}
          {type === "DOCUMENT" && (
            <input
              type="file"
              accept=".png, .jpg, .docx"
              className={
                inputLocationPathError
                  ? "form-control border-danger"
                  : "form-control"
              }
              id="locationPath"
              onChange={(e) => {
                setLocationPath(e.target.files[0].name);
                setFile(
                  e.target.files[0].name.includes(".png", ".jpg", ".docx")
                    ? e.target.files[0]
                    : null
                );
              }}
            />
          )}
          {type === "EXAM" && (
            <input
              type="file"
              accept=".docx"
              className={
                inputLocationPathError
                  ? "form-control border-danger"
                  : "form-control"
              }
              id="locationPath"
              onChange={(e) => {
                setLocationPath(e.target.files[0].name);
                setFile(
                  e.target.files[0].name.includes(".docx")
                    ? e.target.files[0]
                    : null
                );
              }}
            />
          )}
        </div>
        {isEdit && (
          <div className="col-md-6">
            <label
              className="form-label fw-semibold pt-4"
              htmlFor="detailsCheckboxes"
            >
              <a
                href="#"
                className="text-primary"
                onClick={() => {
                  handleModal(bodyLesson.name, bodyLesson.locationPath);
                }}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                {bodyLesson.locationPath}
              </a>
            </label>
          </div>
        )}
        <div className="row">
          <div className="col-md-12 mt-4">
            <button
              type="button"
              className={
                !isEdit
                  ? "btn btn-outline-primary"
                  : "btn btn-outline-secondary disabled"
              }
              onClick={() => create()}
              style={{ width: 140 }}
            >
              Create
            </button>
            <button
              type="button"
              className={
                isEdit
                  ? "btn btn-outline-success ms-2"
                  : "btn btn-outline-secondary disabled ms-2"
              }
              onClick={() => update()}
              style={{ width: 140 }}
            >
              Update
            </button>
            <button
              type="button"
              className={
                isEdit
                  ? "btn btn-outline-danger ms-2"
                  : "btn btn-outline-secondary disabled ms-2"
              }
              onClick={() => destroy(bodyLesson.id, bodyLesson.locationPath)}
              style={{ width: 140 }}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={() => resetForm()}
              style={{ width: 140 }}
            >
              Clear
            </button>
          </div>
        </div>
        {/* //#handle validation */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </form>
    );
  }

  return (
    <div className="row">
      <div className="row justify-content-md-end">
        <div className="col-md-1">
          <a
            href="/login"
            type="button"
            className="btn btn-outline-secondary"
            //onClick={() => localStorage.removeItem("token")}
            onClick={() => sessionStorage.removeItem("token")}
            style={{ width: 90 }}
          >
            Log out
          </a>
        </div>
      </div>
      <div className="col-md-12 my-4">
        <h1
          className="card-header border-bottom border-primary-subtle border-5 mb-3"
          style={{ width: 500 }}
        >
          LESSON MANAGEMENT
        </h1>
      </div>
      <div className="row">
        <div className="col-md-12 my-4">
          <div className="card border-info p-3">
            <h2
              className="card-header border-bottom border-primary-subtle border-5 mb-3"
              style={{ width: 300 }}
            >
              Lesson Detail
            </h2>
            {Details()}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 my-4">
            <div className="table mt-5">
              <h2 align="middle">Lesson List Table</h2>
              <table className="table border border-info table-striped table-hover">
                <thead className="align-middle active">
                  <tr className="table-info table-active">
                    <th scope="col">
                      {ids.length > 0 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-outline-danger fa-solid fa-trash bordered"
                            onClick={() => deleteLessons()}
                            style={{ width: 52 }}
                          ></button>
                          <br />
                        </>
                      )}
                      {data.length > 1 && (
                        <input
                          className="ms-3"
                          id="tableCheckboxes"
                          type="checkbox"
                          checked={ids.length === data.length ? true : false}
                          onChange={() => handleAllId()}
                        />
                      )}
                    </th>
                    <th scope="col">Index</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Description</th>
                    <th scope="col">Content</th>
                    <th scope="col">Level</th>
                    <th scope="col">Order</th>
                    <th scope="col">File Name</th>
                    <th scope="col">Uploaded By</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Updated At</th>
                    <th scope="col"></th>
                    <th scope="col" className="me-2"></th>
                  </tr>
                </thead>
                {rows(currentRows)}
              </table>
              <div className="row gy-3 justify-content-md-end">
                <div className="col-md-auto">
                  <span>
                    {data.length < 1 && "No data"}
                    {data.length === 1 && `Total ${data.length} lesson`}
                    {data.length > 1 && `Total ${data.length} lessons`}
                  </span>
                </div>
              </div>
              {data.length > 0 &&
                pagination(nPages, currentPage, setCurrentPage)}
            </div>
          </div>
        </div>
        <div>
          {/* //#Modal */}
          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel">
                    {modalName}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="row">
                      {modalLocationPath.includes(".mp4") && (
                        <video
                          width="100%"
                          height="600px"
                          src={"/assets/" + modalLocationPath}
                          style={{ border: "none" }}
                          frameborder="0"
                          controls
                          pause
                        />
                      )}
                      {!modalLocationPath.includes(".mp4") && (
                        <object
                          width="100%"
                          height="600px"
                          data={"/assets/" + modalLocationPath}
                          type={modalType}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* //#Modal */}
        </div>
      </div>
    </div>
  );
}
