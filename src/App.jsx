import { useState, useEffect } from 'react'
import Navbar from './components/navbar.jsx'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';

function App() { 
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem("todos")
      if (savedTodos) {
        const parsed = JSON.parse(savedTodos)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (error) {
      console.error("Error loading initial todos:", error)
    }
    return []
  })
  const [showFinished, setshowFinished] = useState(true)

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos))
    } catch (error) {
      console.error("Error saving todos:", error)
    }
  }, [todos])

  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }

  const handleEdit = (e, id) => { 
    let t = todos.find(i => i.id === id)
    setTodo(t.todo)
    setTodos(todos.filter(item => item.id !== id))
  }

  const handleDelete = (e, id) => {  
    setTodos(todos.filter(item => item.id !== id))
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
  }

  const handleChange = (e) => { 
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => { 
    const id = e.target.name
    const index = todos.findIndex(item => item.id === id)
    const newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-white/80 backdrop-blur-sm min-h-[85vh] md:w-[40%] shadow-xl">
        <h1 className='font-bold text-center text-3xl text-[#0D1B2A]'>FocusList - Because Focus Deserves a List</h1>

        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-2xl font-bold text-[#0D1B2A]'>Add a Todo</h2>
          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className='w-full rounded-full px-5 py-2 border border-[#D1D9E6] focus:outline-none focus:ring-2 focus:ring-[#2979FF]'
              placeholder="What's on your mind?"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className='bg-[#2979FF] mx-2 rounded-full hover:bg-[#0052CC] disabled:bg-[#A6C8FF] px-6 py-2 text-sm font-bold text-white transition-all'
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex items-center my-4">
          <input
            id='show'
            onChange={toggleFinished}
            type="checkbox"
            checked={showFinished}
            className='accent-[#2979FF]'
          />
          <label className='mx-2 text-[#0D1B2A]' htmlFor="show">Show Finished</label>
        </div>

        <div className='h-[1px] bg-[#D1D9E6] w-[90%] mx-auto my-2'></div>

        <h2 className='text-2xl font-bold text-[#0D1B2A]'>Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5 text-[#7A869A]'>No Todos to display</div>}

          {todos.map(item => (
            (showFinished || !item.isCompleted) &&
            <div key={item.id} className="todo flex my-3 justify-between items-center bg-white px-4 py-2 rounded-md shadow-sm border border-[#E0E0E0]">
              <div className='flex gap-4 items-center'>
                <input
                  name={item.id}
                  onChange={handleCheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                  className='accent-[#2979FF]'
                />
                <div className={`text-md ${item.isCompleted ? "line-through text-[#7A869A]" : "text-[#0D1B2A]"}`}>
                  {item.todo}
                </div>
              </div>

              <div className="buttons flex h-full">
                <button
                  onClick={(e) => handleEdit(e, item.id)}
                  className='bg-[#2979FF] hover:bg-[#0052CC] p-2 py-1 text-sm font-bold text-white rounded-md mx-1 transition-all'
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className='bg-[#2979FF] hover:bg-[#0052CC] p-2 py-1 text-sm font-bold text-white rounded-md mx-1 transition-all'
                >
                  <AiFillDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App