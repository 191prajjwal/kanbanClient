import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axiosInstance from "../api/axiosInstance";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #1a1f35;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  margin-bottom:10px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  option {
    color: black;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  ${(props) =>
    props.cancel
      ? `
          background: none;
          border: 2px solid #007bff;
          color: #007bff;

          &:hover {
            background: rgba(0, 123, 255, 0.1);
          }
        `
      : `
          background: #007bff;
          border: none;
          color: white;

          &:hover {
            background: #0056b3;
          }
        `}
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
      await axiosInstance.patch(`/tasks/${taskId}/assign`, {
        assignedTo: selectedUser,
      });
      onSubmit(selectedUser);
      onClose();
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Title>Assign Task</Title>
        {isLoadingUsers ? (
          <p style={{ color: "#cccccc", textAlign: "center" }}>
            Loading users...
          </p>
        ) : (
          <FormGroup>
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
          </FormGroup>
        )}
        <ButtonGroup>
          <Button cancel type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAssign}>
            Assign
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AssignTaskModal;
