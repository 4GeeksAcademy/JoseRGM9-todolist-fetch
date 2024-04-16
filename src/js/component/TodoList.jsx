import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [misTareas, setMisTareas] = useState([]);
    const [tareaEditada, setTareaEditada] = useState(null);

    useEffect(() => {
        getMisTareas();
    }, [])

    // te pongo las funciones en la misma pagina en este proyecto que no queria liarme mas a ponerme a exportar e importar, para el siguiente lo hago asi.
    const getMisTareas = () => {
        fetch("https://playground.4geeks.com/todo/users/josergm9")
            .then((response) => response.json())
            .then((result) => {
                console.log(result.todos)
                setMisTareas(result.todos)
            })
            .catch((error) => console.error(error));
    }

    const agregarTarea = () => {
        if (inputValue.trim() !== "") { //.trim elimina espacios en blanco que el usuario haya podido dejar

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                label: inputValue,
                is_done: false
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("https://playground.4geeks.com/todo/todos/josergm9", requestOptions)
                .then((response) => response.json())
                .then(() => {
                    getMisTareas();
                    setInputValue("");
                })
                .catch((error) => console.error(error));
        }
    };

    const editarTarea = (tarea) => {
        setTareaEditada(tarea);
        setInputValue(tarea.label); // Establecer el valor de entrada como la tarea actual
    };

    const guardarEdicion = () => {
        if (inputValue.trim() !== "") {
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: inputValue,
                    is_done: tareaEditada.is_done
                })
            };
            fetch(`https://playground.4geeks.com/todo/todos/${tareaEditada.id}`, requestOptions)
                .then(response => response.json())
                .then(() => {
                    getMisTareas();
                    setInputValue(""); // Limpio el valor de entrada
                    setTareaEditada(null); // para salir del modo edicion
                })
                .catch(error => console.error(error));
        }
    };

    const borrarTarea = (tareaId) => {
        fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) return response.json();
            })
            .then(() => {
                setMisTareas(misTareas.filter(tarea => tarea.id !== tareaId));
            })
            .catch(error => console.error(error));
    };

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
                            if (event.key === "Enter" && inputValue.trim() !== "") {
                                if (tareaEditada) {
                                    guardarEdicion();
                                } else {
                                    agregarTarea(); // funcion para hacer post
                                }
                            }
                        }}
                        placeholder=" Agrega Nueva Tarea">
                    </input>

                    {misTareas.map((tarea, index) => ( // el key index se ponia dentro del div no en el li, ya no me da el error que salia que era por eso
                        <div className="tarea" key={index}>
                            <li>
                                <span className="escritoTarea">{tarea.label}</span>
                                <i
                                    className="fas fa-edit icono-editar"
                                    onClick={() => editarTarea(tarea)}  // llamo funcion de editar la tarea en el icono al dar click
                                ></i>

                                <i
                                    className="fas fa-trash-alt icono-borrar"
                                    onClick={() => borrarTarea(tarea.id)}  // llamo funcion de borrar la tarea en el icono al dar click
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