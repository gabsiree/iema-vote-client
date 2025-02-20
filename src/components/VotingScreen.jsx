import React, { useState, useRef, useEffect } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/candidates/default.jpg"; // Default image

import "../styles/voting.css";

const VotingScreen = () => {
    const classes = [
        "101", "102", "103", "104",
        "201", "202", "203", "204",
        "301", "302", "303", "304"
    ];

    const [selectedClass, setSelectedClass] = useState("");
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentSearch, setStudentSearch] = useState("");
    const [showStudentList, setShowStudentList] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const studentListRef = useRef(null);

    // Fetch students by name
    const fetchStudents = async (name) => {
        try {
            const response = await apiClient.get(`/students/search?name=${name}`);
            setStudents(response.data);
        } catch (err) {
            console.error("Failed to search students");
        }
    };

    // Fetch candidates by class
    const fetchCandidates = async (className) => {
        try {
            const response = await apiClient.get(`/candidates?className=${className}`);
            setCandidates(response.data);
        } catch (err) {
            setError("Failed to fetch candidates.");
        }
    };

    // Function to get candidate image path
    const getCandidateImage = (name) => {
        try {
            return require(`../assets/candidates/${name}.jpg`);

        } catch {
            return defaultImage;
        }
    };

    // Handle student selection
    const handleStudentSelect = (student) => {
        setSelectedStudent(student);
        setStudentSearch(student.name);
        setShowStudentList(false); // Hide list after selection
    };

    const handleNameInputFocus = () => {
        setSelectedClass("");
        setCandidates([]);
    };

    // Hide student list when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (studentListRef.current && !studentListRef.current.contains(event.target)) {
                setShowStudentList(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Submit vote
    const handleVote = async () => {
        if (!selectedCandidate) {
            return alert("Selecione seu candidato...");
        }

        try {
            await apiClient.post("/vote", {
                studentId: 999,
                candidateId: selectedCandidate.student_id,
            });

            // Play confirmation sound
            const confirmationSound = new Audio(require("../assets/sounds/confirmacao.mp3"));
            confirmationSound.play();
            navigate("/");

        } catch (err) {
            alert("Error submitting vote.");
        }
    };

    return (
        <div className="voting-container">
            {/* Class Selection Dropdown */}
            <select
                className="class-select"
                value={selectedClass}
                onChange={(e) => {
                    setSelectedClass(e.target.value);
                    fetchCandidates(e.target.value);
                }}
            >
                <option value="">Selecione sua turma</option>
                {classes.map((cls) => (
                    <option key={cls} value={cls}>
                        {cls}
                    </option>
                ))}
            </select>

            {/* Candidates Section */}
            {selectedClass && candidates.length > 0 && (
                <>
                    <h2 className="section-title">Candidatos a líderes da turma: {selectedClass}</h2>
                    <div className="candidate-grid">
                        {candidates.map((candidate) => (
                            <div
                                key={candidate.student_id}
                                className={`candidate-card ${
                                    selectedCandidate?.student_id === candidate.student_id ? "selected" : ""
                                }`}
                                onClick={() => setSelectedCandidate(candidate)}
                            >
                                <img
                                    src={getCandidateImage(candidate.name)}
                                    alt={candidate.name}
                                    className="candidate-image"
                                />
                                <p className="candidate-name">{candidate.name}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleVote} className="vote-button">
                        CONFIRMA
                    </button>
                </>
            )}

            <footer className="voting-footer">
                Feito com ❤️ Prof. Gabriel
            </footer>
        </div>
    );
};

export default VotingScreen;