import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1f35 0%, #283352 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2196f3;
  margin-bottom: 2rem;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #a4b1cd;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #a4b1cd;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2196f3;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: #a4b1cd;
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? '#2196f3' : 'transparent'};
  color: ${props => props.primary ? '#ffffff' : '#2196f3'};
  border: ${props => props.primary ? 'none' : '2px solid #2196f3'};
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.primary ? '#1976d2' : 'rgba(33, 150, 243, 0.1)'};
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  text-align: center;
  margin-bottom: 1rem;
  background: rgba(255, 77, 79, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 77, 79, 0.2);
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: #a4b1cd;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { user, token } = response.data;
      login(user, token);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Container>
      <Logo>KanbanBoard</Logo>
      <FormCard>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to continue to your board</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <Button type="submit" primary>
            Sign In
          </Button>
        </Form>

        <Divider>or</Divider>

        <Button onClick={() => navigate("/signup")}>
          Create New Account
        </Button>
      </FormCard>
    </Container>
  );
};

export default Login;