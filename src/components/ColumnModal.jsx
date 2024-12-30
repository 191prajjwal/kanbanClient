import React, { useState } from 'react';
import styled from 'styled-components';

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
  font-size: 0.875rem;
  color: #cccccc;
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

const ColumnModal = ({ isOpen, onClose, onSubmit, editingColumn = null }) => {
  const [title, setTitle] = useState(editingColumn?.title || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title);
    setTitle('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <Title>{editingColumn ? 'Edit Column' : 'Add New Column'}</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Column Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
              required
            />
          </FormGroup>

          <ButtonGroup>
            <Button cancel type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingColumn ? 'Update' : 'Create'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ColumnModal;
