import { useState, useEffect } from 'react'
import Navbar from './components/navbar.jsx'
import { FaEdit, FaCalendarAlt, FaTag, FaSearch, FaDownload, FaUpload } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { MdPriorityHigh } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

function App() { 
  const [todo, setTodo] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("medium")
  const [category, setCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"
  })
  
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

  const categories = ["Personal", "Work", "Study", "Health", "Shopping", "Other"]
  const priorities = ["low", "medium", "high"]

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos))
    } catch (error) {
      console.error("Error saving todos:", error)
    }
  }, [todos])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'low': return 'bg-green-100 border-green-300 text-green-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
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
    if (todo.length <= 3) return
    
    const newTodo = {
      id: uuidv4(),
      todo,
      isCompleted: false,
      dueDate: dueDate || null,
      priority,
      category: category || "Other",
      createdAt: new Date().toISOString()
    }
    
    setTodos([...todos, newTodo])
    setTodo("")
    setDueDate("")
    setPriority("medium")
    setCategory("")
  }

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `focuslist-export-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTodos = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedTodos = JSON.parse(e.target.result)
        if (Array.isArray(importedTodos)) {
          setTodos([...todos, ...importedTodos])
        }
      } catch (error) {
        alert('Invalid file format')
      }
    }
    reader.readAsText(file)
  }

  // Filter todos based on search and filters
  const filteredTodos = todos.filter(item => {
    const matchesSearch = item.todo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const shouldShow = showFinished || !item.isCompleted
    
    return matchesSearch && matchesPriority && matchesCategory && shouldShow
  })

  // Statistics
  const totalTasks = todos.length
  const completedTasks = todos.filter(t => t.isCompleted).length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasks = todos.filter(t => !t.isCompleted && isOverdue(t.dueDate)).length

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
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:6rem_4rem]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#1f2937,transparent)]"></div>
        </div>
        
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm min-h-[85vh] md:w-[50%] shadow-xl">
          
          {/* Header */}
          <h1 className='font-bold text-center text-3xl text-gray-800 dark:text-white mb-6'>
            FocusList - Because Focus Deserves a List
          </h1>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <div className="text-blue-800 dark:text-blue-300 text-sm font-medium">Total</div>
              <div className="text-blue-900 dark:text-blue-100 text-2xl font-bold">{totalTasks}</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <div className="text-green-800 dark:text-green-300 text-sm font-medium">Completed</div>
              <div className="text-green-900 dark:text-green-100 text-2xl font-bold">{completedTasks}</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
              <div className="text-yellow-800 dark:text-yellow-300 text-sm font-medium">Pending</div>
              <div className="text-yellow-900 dark:text-yellow-100 text-2xl font-bold">{pendingTasks}</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <div className="text-red-800 dark:text-red-300 text-sm font-medium">Overdue</div>
              <div className="text-red-900 dark:text-red-100 text-2xl font-bold">{overdueTasks}</div>
            </div>
          </div>

          {/* Add Todo Section */}
          <div className="addTodo my-5 flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>Add a Todo</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <input
                onChange={handleChange}
                value={todo}
                type="text"
                className='w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder="What's on your mind?"
              />
              
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className='w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className='w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <button
                onClick={handleAdd}
                disabled={todo.length <= 3}
                className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 px-6 py-2 text-white rounded-lg font-medium transition-all'
              >
                Save Task
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 my-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className='rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between my-4 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={showFinished}
                  onChange={toggleFinished}
                  className='accent-blue-600'
                />
                Show Completed
              </label>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={exportTodos}
                className='flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg font-medium transition-all'
              >
                <FaDownload /> Export
              </button>
              
              <label className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg font-medium transition-all cursor-pointer'>
                <FaUpload /> Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importTodos}
                  className='hidden'
                />
              </label>
            </div>
          </div>

          <div className='h-[1px] bg-gray-300 dark:bg-gray-600 w-[90%] mx-auto my-4'></div>

          {/* Todos List */}
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>Your Tasks</h2>
          <div className="todos space-y-3">
            {filteredTodos.length === 0 && (
              <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                {searchTerm || filterPriority !== "all" || filterCategory !== "all" 
                  ? "No tasks match your filters" 
                  : "No tasks to display"
                }
              </div>
            )}

            {filteredTodos.map(item => (
              <div key={item.id} className={`todo p-4 rounded-lg border-l-4 bg-white dark:bg-gray-700 shadow-sm border-r border-t border-b border-gray-200 dark:border-gray-600 ${
                item.priority === 'high' ? 'border-l-red-500' :
                item.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              } ${isOverdue(item.dueDate) && !item.isCompleted ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
                
                <div className="flex items-start justify-between gap-4">
                  <div className='flex gap-3 items-start flex-1'>
                    <input
                      name={item.id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                      className='mt-1 accent-blue-600'
                    />
                    
                    <div className="flex-1">
                      <div className={`text-lg ${item.isCompleted ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-white"}`}>
                        {item.todo}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()} PRIORITY
                        </span>
                        
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-300">
                          <FaTag className="inline mr-1" />
                          {item.category}
                        </span>
                        
                        {item.dueDate && (
                          <span className={`px-2 py-1 rounded-full text-xs border ${
                            isOverdue(item.dueDate) && !item.isCompleted 
                              ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-300'
                          }`}>
                            <FaCalendarAlt className="inline mr-1" />
                            {new Date(item.dueDate).toLocaleDateString()}
                            {isOverdue(item.dueDate) && !item.isCompleted && ' (Overdue)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleEdit(e, item.id)}
                      className='bg-blue-600 hover:bg-blue-700 p-2 text-white rounded-lg transition-all'
                      title="Edit task"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className='bg-red-600 hover:bg-red-700 p-2 text-white rounded-lg transition-all'
                      title="Delete task"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App