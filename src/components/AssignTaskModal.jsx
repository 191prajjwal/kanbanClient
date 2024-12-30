import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
`;

const AssignButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AssignTaskModal = ({ taskId, onAssign, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    
    axios.get("/api/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const handleAssign = async () => {
    try {
      await axios.put(`/api/tasks/assign/${taskId}`, { assignedTo: selectedUser });
      onAssign(selectedUser); 
      onClose(); 
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <ModalContainer>
      <ModalContent>
        <h3>Assign Task</h3>
        <select onChange={(e) => setSelectedUser(e.target.value)} value={selectedUser}>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <AssignButton onClick={handleAssign}>Assign</AssignButton>
      </ModalContent>
    </ModalContainer>
  );
};

export default AssignTaskModal;
