import React, { useState, useEffect } from "react";

const App = () => {
  const [newtask, setNewTask] = useState("");
  const [title, setTitle] = useState("");
  const [dob, setDob] = useState("");
  const [checkedTasks, setCheckedTasks] = useState({});
  const [dataArray, setDataArray] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Save tasks to cookie
  const saveToCookie = (key, array) => {
    document.cookie = `${key}=${JSON.stringify(array)}; path=/; max-age=86400`;
  };

  // Get tasks from cookie
  const getFromCookie = (key) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((item) => item.startsWith(`${key}=`));
    return cookie ? JSON.parse(cookie.split("=")[1]) : [];
  };

  // Function to handle input changes
  const onChangeFunc = (func) => (e) => func(e.target.value);

  // Submit form to add or update task
  const submiHandler = (e) => {
    e.preventDefault();
    const tasks = { newtask, title, dob };
    let updatedArray;
    if (editIndex !== null) {
      updatedArray = [...dataArray];
      updatedArray[editIndex] = tasks; // Update existing task
    } else {
      updatedArray = [...dataArray, tasks]; // Add new task
    }
    setDataArray(updatedArray);
    saveToCookie("tasks", updatedArray); // Save updated tasks to cookie
    setNewTask("");
    setTitle("");
    setDob("");
    setEditIndex(null); // Reset edit index after submission
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (index) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Load tasks from cookie on component mount
  useEffect(() => {
    const savedTasks = getFromCookie("tasks");
    setDataArray(savedTasks);
  }, []);

  // Delete task
  const deleteTask = (index) => {
    const updatedArray = dataArray.filter((e, i) => i !== index);
    setDataArray(updatedArray);
    console.log("delete successfull");
    saveToCookie("tasks", updatedArray); // Save updated tasks to cookie
  };

  // Edit task
  const updateTask = (index) => {
    const task = dataArray[index];
    setTitle(task.title);
    setNewTask(task.newtask);
    setDob(task.dob);
    setEditIndex(index); // Set the index to be edited
  };

  return (
    <div className="max-w-3xl mx-auto p-5 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-center text-3xl font-semibold text-gray-700 mb-5">
        {editIndex !== null ? "Update Task" : "New Task"}
      </h1>
      <form className="space-y-4" onSubmit={submiHandler}>
        <div>
          <label className="block text-lg font-medium text-gray-600">Title</label>
          <input
            type="text"
            value={title}
            onChange={onChangeFunc(setTitle)}
            placeholder="Enter Task Title"
            className="w-full p-3 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Description</label>
          <input
            type="text"
            value={newtask}
            onChange={onChangeFunc(setNewTask)}
            placeholder="Enter Task Description"
            className="w-full p-3 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-600">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={onChangeFunc(setDob)}
            className="w-full p-3 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Task List */}
      <div className="mt-8 space-y-4">
        {dataArray.map((e, i) => {
          const isChecked = checkedTasks[i];
          return (
            <div key={i} className={`flex flex-col m-10 ${isChecked ? "line-through" : ""}`}>
              <div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange(i)}
                  className="mr-4"
                />
                <h2 className="text-lg font-medium">{e.title}</h2>
                <p className="text-gray-600">{e.newtask}</p>
                <p className="text-gray-500">Date of Birth: {e.dob}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => updateTask(i)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(i)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
