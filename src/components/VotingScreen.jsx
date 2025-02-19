import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { useNavigate } from "react-router-dom";

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
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

    // Submit vote
    const handleVote = async () => {
        if (!selectedStudent || !selectedCandidate) {
            return alert("Please select your name and a candidate.");
        }
        try {
            await apiClient.post("/vote", {
                studentId: selectedStudent.student_id,
                candidateId: selectedCandidate.student_id,
            });
            alert("Vote submitted successfully.");
            navigate("/");
        } catch (err) {
            alert("Error submitting vote.");
        }
    };

    return (
        <div className="voting-container">
            {/* Student Name Search */}
            <input
                type="text"
                className="student-search"
                placeholder="Search your name"
                value={studentSearch}
                onChange={(e) => {
                    setStudentSearch(e.target.value);
                    fetchStudents(e.target.value);
                }}
            />
            <ul className="student-list">
                {students.map((student) => (
                    <li
                        key={student.student_id}
                        className={`student-item ${
                            selectedStudent?.student_id === student.student_id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedStudent(student)}
                    >
                        {student.name}
                    </li>
                ))}
            </ul>

            {/* Class Selection Dropdown */}
            <select
                className="class-select"
                value={selectedClass}
                onChange={(e) => {
                    setSelectedClass(e.target.value);
                    fetchCandidates(e.target.value);
                }}
            >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                    <option key={cls} value={cls}>
                        {cls}
                    </option>
                ))}
            </select>

            {/* Candidates Section */}
            {selectedStudent && candidates.length > 0 && (
                <>
                    <h2 className="section-title">Candidates for Class {selectedClass}</h2>
                    <ul className="candidate-list">
                        {candidates.map((candidate) => (
                            <li
                                key={candidate.student_id}
                                className={`candidate-item ${
                                    selectedCandidate?.student_id === candidate.student_id ? "selected" : ""
                                }`}
                                onClick={() => setSelectedCandidate(candidate)}
                            >
                                {candidate.name}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleVote} className="vote-button">
                        Submit Vote
                    </button>
                </>
            )}
        </div>
    );
};

export default VotingScreen;