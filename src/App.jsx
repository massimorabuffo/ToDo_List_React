import { useEffect, useState } from 'react'
import './App.css'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [todo, setToDo] = useState("");
  const [todos, setToDos] = useState([]);
  const [activeTodos, setActiveTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [renderedArray, setRenderedArray] = useState(activeTodos);
  const [searchBarHandler, setSearchBarHandler] = useState(false);
  const [searchBarValue, setSearchBarValue] = useState("");
  const notifyError = () => toast.error(`Todo not found!`);
  const [isSelected, setIsSelected] = useState({
    all: false,
    active: true,
    completed:false
  });

  const handleAddToDo = () => {
    if(todo){
      setActiveTodos(p => [...p, todo]);
      setRenderedArray(p => [...p, todo]);
      setToDos(p => [...p, todo]);
    }
    setToDo("");
  }

  useEffect(() => {
    const keyDownHandler = e => {
      if(e.key === 'Enter') {
        e.preventDefault();
        handleAddToDo();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  })

  const handleDeleteAll = () => {
    setRenderedArray([]);
    setToDos([]);
    setActiveTodos([]);
    setCompletedTodos([]);
  }

  const handleCompleteTodo = (event) => {
    const filteredTodos = activeTodos.filter(e => {
      if(e !== event.target.name){
        if(!todos.includes(e)){
          setToDos(p => [...p, e]);
        }
        return true;
      }
      return false;
    });
    setActiveTodos(filteredTodos);
    setRenderedArray(filteredTodos);
    setCompletedTodos(p => [...p, event.target.name]);
    console.log(`All:${todos} , Completed: ${completedTodos}, Active: ${activeTodos}`);
  }

  const handleRender = (e) => {
    if(e.target.name === 'all'){
      setRenderedArray(todos);
      setIsSelected({
        all: true,
        active: false,
        completed: false
      });
    }else if(e.target.name === 'active'){
      setRenderedArray(activeTodos);
      setIsSelected({
        all: false,
        active: true,
        completed: false
      });
    }else if(e.target.name === 'completed'){
      setRenderedArray(completedTodos);
      setIsSelected({
        all: false,
        active: false,
        completed: true
      });
    }
  }

  const handleSearchBar = () => {
    setSearchBarHandler(p => !p);
  }

  const handleSearch = (e) => {
    if(todos.includes(searchBarValue)){
      setRenderedArray(Array(searchBarValue));
    }else{
      notifyError();
    }
  }

  return (
    <>
      <ToastContainer 
        position="top-center"
        reverseOrder={false}
      />
      <div className='container'>
        <h1>THINGS TO DO</h1>
        <div className='input_container'>
          <input disabled={renderedArray === completedTodos || renderedArray === todos} type="text" placeholder={renderedArray === completedTodos || renderedArray === todos ? 'Switch to "Active" to add a todo!' : 'Add New'} value={todo} onChange={e => setToDo(e.target.value)}/>
          <button disabled={renderedArray === completedTodos || renderedArray === todos} onClick={() => handleAddToDo()}>Add to list</button>
          <button onClick={() => handleDeleteAll()}>Delete All</button>
        </div>
        <div className='todos_container'>
          {
          renderedArray.map(e => (
            <div key={Math.random()}>
              <div className='todos'>
                <input type='checkbox' defaultChecked={renderedArray === completedTodos || completedTodos.includes(e)} name={e} onChange= {renderedArray !== completedTodos && renderedArray !== todos ? (event) => handleCompleteTodo(event) : undefined}/>
                <div>{e}</div>
              </div>
              <hr />
            </div>
          ))
          }
        </div>
        <div className='buttons_container'>
          <button name='all' style={{backgroundColor: isSelected.all && 'rgba(0, 115, 255, 0.834)'}} onClick={e => handleRender(e)}>All</button>
          <button name='active' style={{backgroundColor: isSelected.active && 'rgba(0, 115, 255, 0.834)'}} onClick={e => handleRender(e)}>Active</button>
          <button name='completed' style={{backgroundColor: isSelected.completed && 'rgba(0, 115, 255, 0.834)'}} onClick={e => handleRender(e)}>Completed</button>
          <button name='search' onClick={() => handleSearchBar()}>Search</button>
        </div>
        {searchBarHandler && <div>
          <input type='text' placeholder='Search by name' value={searchBarValue} onChange={e => setSearchBarValue(e.target.value)} /> 
          <button style={{backgroundColor: todos.includes(searchBarValue) ? 'green' : 'red'}} onClick={() => handleSearch()}>Search in the list</button>
          </div>}
      </div>
    </>
  )
}

export default App
