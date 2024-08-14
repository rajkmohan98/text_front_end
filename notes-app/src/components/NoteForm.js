// src/components/NoteForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NoteForm.css'; // Import the CSS file

const NoteForm = () => {
    const [userName, setUserName] = useState('');
    const [textContent, setTextContent] = useState('');
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState([]);

    // Function to fetch notes
    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/notes/'); // Adjust the endpoint if necessary
            setNotes(response.data);
        } catch (error) {
            setMessage('Error fetching notes');
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []); // Fetch notes on component mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/note/', {
                user_name: userName,
                text_content: textContent,
            });

            if (response.status === 201) {
                setMessage('Notes created successfully');
                setUserName('');
                setTextContent('');
                fetchNotes(); // Fetch notes again after successful creation
            }
        } catch (error) {
            if (error.response) {
                setMessage('Error: ' + JSON.stringify(error.response.data));
            } else {
                setMessage('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="note-form-container">
            <h2>Create Note</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>User Name:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Note Content:</label>
                    <textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}

            <div className="notes-list">
                <h2>Existing Notes</h2>
                {notes.length > 0 ? (
                    <ul>
                        {notes.map((note, index) => (
                            <li key={index}>
                                <strong>{note.user_name}</strong>: {note.text_content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notes available.</p>
                )}
            </div>
        </div>
    );
};

export default NoteForm;
