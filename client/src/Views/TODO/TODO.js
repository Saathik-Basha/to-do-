import { useEffect, useState } from 'react';
import Styles from './TODO.module.css';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editingDescription, setEditingDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: 'GET',
            url: 'http://localhost:8000/api/todo',
            headers: {
                accept: 'application/json',
            },
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    };

    const addTodo = () => {
        const options = {
            method: 'POST',
            url: 'http://localhost:8000/api/todo',
            headers: {
                accept: 'application/json',
            },
            data: {
                title: newTodo,
                description: newDescription,
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) => [...prevData, response.data.newTodo]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: 'DELETE',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) => prevData.filter((todo) => todo._id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateTodo = (id, data) => {
        const options = {
            method: 'PATCH',
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: 'application/json',
            },
            data,
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData((prevData) => prevData.map((todo) => (todo._id === id ? response.data : todo)));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEdit = (id) => {
        const todoToEdit = todoData.find((todo) => todo._id === id);
        setEditingTodo(id);
        setEditingText(todoToEdit.title);
        setEditingDescription(todoToEdit.description);
    };

    const saveEdit = (id) => {
        updateTodo(id, { title: editingText, description: editingDescription });
        setEditingTodo(null);
        setEditingText('');
        setEditingDescription('');
    };

    return (
        <div className={Styles.ancestorContainer}>
            <div className={Styles.headerContainer}>
                <h1>Tasks</h1>
                <span>
                    <input
                        className={Styles.todoInput}
                        type="text"
                        name="New Todo"
                        value={newTodo}
                        placeholder="Enter todo title"
                        onChange={(event) => {
                            setNewTodo(event.target.value);
                        }}
                    />
                    <input
                        className={Styles.todoInput}
                        type="text"
                        name="New Description"
                        value={newDescription}
                        placeholder="Enter todo description"
                        onChange={(event) => {
                            setNewDescription(event.target.value);
                        }}
                    />
                    <button
                        id="addButton"
                        name="add"
                        className={Styles.addButton}
                        onClick={() => {
                            addTodo();
                            setNewTodo('');
                            setNewDescription('');
                        }}
                    >
                        + New Todo
                    </button>
                </span>
            </div>
            <div id="todoContainer" className={Styles.todoContainer}>
                {loading ? (
                    <p style={{ color: 'white' }}>Loading...</p>
                ) : todoData.length > 0 ? (
                    todoData.map((entry, index) => (
                        <div key={entry._id} className={Styles.todo}>
                            {editingTodo === entry._id ? (
                                <div>
                                    <input
                                        type="text"
                                        value={editingText}
                                        onChange={(event) => setEditingText(event.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={editingDescription}
                                        onChange={(event) => setEditingDescription(event.target.value)}
                                    />
                                    <button className={Styles.editButton} onClick={() => saveEdit(entry._id)}>Save</button>
                                </div>
                            ) : (
                                <div>
                                    <div className={Styles.todoHeader}>
                                        <div className={Styles.infoContainer}>
                                            <input
                                                type="checkbox"
                                                checked={entry.done}
                                                onChange={() => {
                                                    updateTodo(entry._id, { done: !entry.done });
                                                }}
                                            />
                                            <span className={`${Styles.todoTitle} ${entry.done ? Styles.strikeThrough : ''}`}>{entry.title}</span>
                                        </div>
                                        <div className={Styles.todoActions}>
                                            <button className={Styles.editButton} onClick={() => handleEdit(entry._id)}>Edit</button>
                                            <span
                                                className={Styles.deleteText}
                                                onClick={() => deleteTodo(entry._id)}
                                            >
                                                Delete
                                            </span>
                                        </div>
                                    </div>
                                    <p className={Styles.todoDescription}>{entry.description}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={Styles.noTodoMessage}>No tasks available. Please add a new task.</p>
                )}
            </div>
        </div>
    );
}
