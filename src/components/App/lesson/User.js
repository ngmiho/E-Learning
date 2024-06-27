import React, { useState, useEffect } from "react";

export default function Lesson(props) {
  var [data, setData] = useState([]);

  //interceptor
  // useEffect(() => {
  //   verifyToken()
  // }, [])

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/lessons")
      .then((response) => {
        if (!response.ok) throw new (Error("Network response was not ok"))();
        return response.json();
      })
      .then((data) => {
        console.log("test" + data);
        setData(data);
        bodyLesson = data[0];
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  var getLesson = (id) => {
    fetch("http://localhost:3001/api/v1/lessons/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data[0]);
        setId(data[0].id);

        setLessonCategoryId(data[0].lessonCategoryId);
        setName(data[0].name);
        setDescription(data[0].description);
        setType(data[0].type);
        setContent(data[0].content);
        setOrder(data[0].order);
        setLocationPath(data[0].locationPath);
        setUploadedBy(data[0].uploadedBy);
        //setCreatedAt("2024-05-05")
        //setUpdatedAt("2024-05-06")
        //yyyy-MM-dd
        let createdAtTemporary = new Date(data[0].createdAt);
        let updatedAtTemporary = new Date(data[0].updatedAt);
        setCreatedAt(parseDate(createdAtTemporary));
        setUpdatedAt(parseDate(updatedAtTemporary));
      })
      .catch((error) => console.error("Fetch operation error"));
  };

  function parseDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // var [windowSize, setWindowSize] = useState({
  //     width: window.innerWidth,
  //     height: window.innerHeight
  // })
  // useEffect(() => {
  //     var handleResize = () => {
  //         setWindowSize({
  //             width: window.innerWidth,
  //             height: window.innerHeight
  //         })
  //     }

  //     window.addEventListener('resize', handleResize)

  //     return () => window.removeEventListener('resize', handleResize)
  // }, [])

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
  };

  var [isCollapse, setIsCollapse] = useState("");
  function handleCollapse(id) {
    if (isCollapse !== id) setIsCollapse(id);
    else setIsCollapse("");
  }

  var [countLesson, setCountLesson] = useState(0);
  var [countCourse, setCountCourse] = useState(0);

  async function countLessonCategoryId(id) {
    try {
      let response = await fetch(
        "http://localhost:3001/api/v1/lessons/countLessonCategoryId/" + id
      );
      let data = await response.json();
      return data[0]["total"];
    } catch (error) {
      console.error("ERROR:" + error);
    }
  }

  var [lids, setLids] = useState([]);
  async function handleCount(index, lcid, lid) {
    if (lids.indexOf(lid) === -1) {
      setLids([...lids, lid]);

      let currentCountLesson = countLesson + 1;
      setCountLesson(currentCountLesson);
      if (currentCountLesson === (await countLessonCategoryId(lcid))) {
        let currentCountCourse = countCourse + 1;
        setCountCourse(currentCountCourse);
        setCountLesson(0);
      }
    }
  }

  let handleData = data.reduce((accumulator, current) => {
    if (
      !accumulator.some(
        (item) => item.lessonCategoryId === current.lessonCategoryId
      )
    ) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  let handleLcids = handleData.map((e, i) => (
    <div className="card" key={i}>
      <div
        className={
          i <= countCourse
            ? "card-header btn btn-primary"
            : "card-header btn btn-primary disabled"
        }
        onClick={() => handleCollapse(i)}
      >
        {e.lessonCategoryId === 1 && (
          <span className="fw-bolder">Beginning</span>
        )}
        {e.lessonCategoryId === 2 && <span className="fw-bolder">Basic</span>}
        {e.lessonCategoryId === 3 && <span className="fw-bolder">Advance</span>}
      </div>
      <ul
        className={
          isCollapse === i
            ? "list-group list-group-flush collapse show "
            : "list-group list-group-flush collapse "
        }
      >
        {data
          .filter((e) => e.lessonCategoryId === i + 1)
          .sort((a, b) => a.order - b.order)
          .map((element, index) => (
            <li
              className={
                index <= countLesson || !(lids.indexOf(element.id) === -1)
                  ? "list-group-item btn btn-outline-primary"
                  : "list-group-item btn btn-outline-primary disabled"
              }
              key={element.id}
              onClick={() => {
                getLesson(element.id);
                handleCount(index, e.lessonCategoryId, element.id);
                setLocationPath(element.locationPath);
              }}
            >
              {element.name}
            </li>
          ))}
      </ul>
    </div>
  ));

  return (
    <div className="row justify-content-md-center py-4 px-5">
      <div className="col-md-8">
        <div className="card ps-4 pt-4">
          {/* <video className="card-img-top" width={windowSize.width - 1090} height={windowSize.height - 400} 
                        src={"./videos/" + bodyLesson.locationPath} controls allowFullScreen></video> */}
          <iframe
            className="object-fit-contain"
            title="iframeModal"
            src={
              bodyLesson.locationPath.length === 0
                ? "/assets/elearning.jpg"
                : "./assets/" + bodyLesson.locationPath
            }
            width="100%"
            height="600px"
            style={{ border: "none" }}
          ></iframe>
          <div className="card-body">
            <h5 className="card-title">{bodyLesson.name}</h5>
            <p className="card-text">{bodyLesson.description}</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <ul className="list-group">
          <li className="list-group-item">
            <h2>NodeJS</h2>
          </li>
          {handleLcids}
        </ul>
      </div>
    </div>
  );
}
