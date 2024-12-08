import React, { useState } from "react";

const App = () => {
  const [newtask, setNewTask] = useState("");
  const [title, setTitle] = useState("");
  const [dob, setDob] = useState("");
  const [checkedTasks, setCheckedTasks] = useState({});
  const [dataArray, setDataArray] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const saveToCokkie = (key, array) => {
    document.cookie = `${key}=${JSON.stringify(array)} path=/; max-age=86400`;
  };

  const getFromCookie = (key) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((item) => item.startsWith(`${key}=`));
    return cookie ? JSON.parse(cookie.split("=")[1]) : [];
  };

  const onChangeFunc = (func) => (e) => func(e.target.value);

  const submiHandler = (e) => {
    e.preventDefault();
    const tasks = { newtask, title, dob };

    if (editIndex !== null) {
      // If editIndex is set, we are updating a task
      const updatedArray = [...dataArray];
      updatedArray[editIndex] = tasks;
      setDataArray(updatedArray);
      setEditIndex(null); // Reset editIndex after update
    } else {
      // If no task is being edited, we add a new task
      const updatedArray = [...dataArray, tasks];
      setDataArray(updatedArray);
    }

    // saveToCokkie("tasks", updatedArray);
    setNewTask("");
    setTitle("");
    setDob("");
  };

  const handleCheckboxChange = (index) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const deleteTask = (index) => {
    const updatedArray = dataArray.filter((e, i) => i !== index);
    setDataArray(updatedArray);
    console.log("delete successfull");
  };

  const updateTask = (index) => {
    const task = dataArray[index];
    setTitle(task.title);
    setNewTask(task.newtask);
    setDob(task.dob);
    setEditIndex(index); // Set the index to be edited
  };

  return (
    <>
      <div className="w-full flex-col h-[20rem] m-10  order-2px border-black">
        <h1 className="text-center text-5xl uppercase bg-slate-700 text-yellow-500">
          New Task
        </h1>
        <form
          className="flex-col flex justify-center align items-center mt-10 m-2"
          onSubmit={submiHandler}
        >
          <label>Title</label>
          <input
            value={title}
            onChange={onChangeFunc(setTitle)}
            placeholder="Enter Title"
            type="text"
          />
          <label>Description</label>
          <input
            value={newtask}
            onChange={onChangeFunc(setNewTask)}
            placeholder="Enter Description"
            type="text"
          />
          <label>Dob</label>
          <input
            value={dob}
            onChange={onChangeFunc(setDob)}
            placeholder="Enter Date of Birth"
            type="date"
          />
          <button className="py-2 px-6 bg-red-600 hover:scale-50 text-2xl uppercase font-bold text-red hover:text-white hover:bg-red-200 rounded mt-10 transition ease-in-out duration-200">
            {editIndex !== null ? "Update" : "Add"} {/* Change button text */}
          </button>
        </form>
      </div>

      <div className="w-100% h-screen rounded-lg bg-gray-300 shadow-2xl m-20">
        {dataArray.map((e, i) => {
          const isChecked = checkedTasks[i];
          return (
            <div
              key={i}
              className={`flex flex-col m-10 ${
                isChecked ? "line-through" : ""
              }`}
            >
              <div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(i)}
                />
                <h1>
                  <span className="mr-10">Name :</span>
                  {e.title}
                </h1>
                <h1>
                  <span className="mr-10">Description :</span>
                  {e.newtask}
                </h1>
                <h1>
                  <span className="mr-10">Date of birth :</span>
                  {e.dob}
                </h1>
                <button
                  onClick={() => deleteTask(i)} // Fixing this from `onChange` to `onClick`
                  className="mr-10 shadow-2xl bg-red-600 rounded px-6 py-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => updateTask(i)}
                  className="bg-blue-600 shadow-2xl rounded px-6 py-2"
                >
                  Update
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
