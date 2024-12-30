import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance";

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
  background: #ffffff;
  padding: 25px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  margin-bottom: 15px;
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const AssignButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled.button`
  background-color: #f5f5f5;
  color: #333;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const AssignTaskModal = ({ taskId, onSubmit, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axiosInstance.get("/auth/users"); 
        setUsers(response.data); 
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAssign = async () => {
    if (!selectedUser) {
      alert("Please select a user to assign the task.");
      return;
    }

    try {
      await axiosInstance.patch(`/tasks/${taskId}/assign`, { assignedTo: selectedUser });
      onSubmit(selectedUser); 
      onClose(); 
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <ModalContainer>
      <ModalContent>
        <Title>Assign Task</Title>
        {isLoadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <Select
            onChange={(e) => setSelectedUser(e.target.value)}
            value={selectedUser}
          >
            <option value="">Select User by Email</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </Select>
        )}
        <ButtonGroup>
          <AssignButton onClick={handleAssign}>Assign</AssignButton>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </ButtonGroup>
      </ModalContent>
    </ModalContainer>
  );
};

export default AssignTaskModal;
