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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  option {
    background: #1a1f35;
    color: white;
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

const AddTaskModal = ({ onClose, onSubmit, editingTask = null, columnId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: null,
    columnId: columnId,
  });

  const [userList, setUserList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : "",
        priority: editingTask.priority || "Medium",
        assignedTo: editingTask.assignedTo || null,
        columnId: editingTask.columnId || columnId,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        columnId: columnId,
      }));
    }
  }, [editingTask, columnId]);

 
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axiosInstance.get("/auth/users"); 
        setUserList(response.data); 
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSelect = (e) => {
    const selectedUserId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      assignedTo: selectedUserId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskData = {
        ...formData,
        columnId: formData.columnId || columnId,
      };

      console.log("Submitting task data:", taskData);
      let response;
      if (editingTask) {
        response = await axiosInstance.put(`/tasks/${editingTask._id}`, taskData);
      } else {
        response = await axiosInstance.post("/tasks", taskData);
      }

      if (response.data) {
        onSubmit?.(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error managing task:", error);
    }
  };

  if (!columnId && !editingTask?.columnId) {
    console.error("No column ID provided");
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        <Title>{editingTask ? "Edit Task" : "Add New Task"}</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Due Date</Label>
            <Input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Priority</Label>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Assigned To</Label>
            {isLoadingUsers ? (
              <div>Loading users...</div>
            ) : (
              <Select
                name="assignedTo"
                value={formData.assignedTo || ""}
                onChange={handleUserSelect}
              >
                <option value="" disabled>
                  Select a user
                </option>
                {userList.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email}
                  </option>
                ))}
              </Select>
            )}
          </FormGroup>

          <ButtonGroup>
            <Button cancel type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddTaskModal;