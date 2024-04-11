import React, { useState, useEffect } from "react";


//include images into your bundle


//create your first component
const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [misTareas, setMisTareas] = useState([]);

    useEffect(() => {
        getMisTareas();
        console.log("ejecutar")
    }, [])

    const getMisTareas = () => {
        fetch("https://playground.4geeks.com/todo/users/josergm9")
            .then((response) => response.json())
            .then((result) => {
                console.log(result.todos)
                setMisTareas(result.todos)
            })
            .catch((error) => console.error(error));
    }

    
    return (
        <div className="containerPrincipal">
            <div className="container">
                <div className="titulo">
                    <h1>Mis Tareas</h1>
                </div>
                <ul>

                    <input className="agregarTarea" type="text"
                        onChange={(event) => setInputValue(event.target.value)}
                        value={inputValue}
                        onKeyUp={(event) => {
                            if (event.key === "Enter" && inputValue.length >= 3) {
                                const myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");

                                const raw = JSON.stringify({
                                    "label": inputValue, //este inputValue es mi codigo y quiero exportarlo
                                    "is_done": false
                                });

                                const requestOptions = {
                                    method: "POST",
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: "follow"
                                };

                                fetch("https://playground.4geeks.com/todo/todos/josergm9", requestOptions)
                                    .then((response) => response.json())
                                    .then((result) => {
                                        getMisTareas();
                                        setInputValue("");
                                    })
                                    .catch((error) => console.error(error));
                            }
                        }}
                        placeholder=" Agrega Nueva Tarea">

                    </input>

                    {misTareas.map((item, index) => (
                        <div className="tarea">
                            <li key={index}>
                                <span className="escritoTarea">{item.label}</span>

                                <i
                                    className="fas fa-trash-alt icono-borrar"
                                    onClick={() => {
                                        fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, {
                                            method: "DELETE"
                                        })
                                            .then(response => {
                                                if (!response.ok)
                                                    return response.json();
                                            })
                                            .then(() => {
                                                setMisTareas(
                                                    misTareas.filter(
                                                        (tarea, currentIndex) =>
                                                            index != currentIndex
                                                    )
                                                );
                                                getMisTareas();
                                            })
                                            .catch(error => console.error(error));
                                    }}
                                >
                                </i>
                            </li>
                        </div>
                    ))}
                </ul>
                <div className="contenedorTasks">
                    {misTareas.length} tasks
                </div>
                <div className="contenedorTasks2">
                </div>
                <div className="contenedorTasks1">
                </div>
            </div>
        </div>
    );
};

export default TodoList;