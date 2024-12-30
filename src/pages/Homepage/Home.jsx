import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1f35 0%, #283352 100%);
  color:hsl(0, 0.00%, 100.00%);
  font-family: 'Inter', sans-serif;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(26, 31, 53, 0.95);

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2196f3;
  margin-right: auto; /* Ensures space between logo and button */

  @media (max-width: 768px) {
    margin-right: 1rem; /* Adds some margin on smaller screens */
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #2196f3;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #a4b1cd;
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;

  ${props => props.primary ? `
    background: #2196f3;
    color: white;
    border: none;
    
    &:hover {
      background: #1976d2;
      transform: translateY(-2px);
    }
  ` : `
    background: transparent;
    color: #2196f3;
    border: 2px solid #2196f3;
    
    &:hover {
      background: rgba(33, 150, 243, 0.1);
      transform: translateY(-2px);
    }
  `}

  @media (max-width: 768px) {
    padding: 0.7rem 5rem; 
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  color: #64b5f6;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #a4b1cd;
  line-height: 1.6;
`;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Column Management",
      description: "Add new columns, rename existing ones, and remove columns with confirmation."
    },
    {
      title: "Task Management",
      description: "Create, edit, and remove tasks easily. Update task details including title, description, and due dates."
    },
    {
      title: "Drag & Drop Tasks",
      description: "Move tasks between columns seamlessly to update their status."
    },
    {
      title: "User Assignment",
      description: "Assign tasks to team members and track responsibilities with user avatars on tasks."
    }
  ];

  return (
    <HomeContainer>
      <NavBar>
        <Logo>KanbanBoard</Logo>
        <Button onClick={() => navigate("/login")}>Sign In</Button>
      </NavBar>

      <MainContent>
        <HeroSection>
          <Title>Organize Your Work</Title>
          <Subtitle>
            A simple and efficient Kanban board to manage your tasks and team workflow.
          </Subtitle>
          <ButtonGroup>
            <Button primary onClick={() => navigate("/signup")}>
              Get Started
            </Button>
            <Button onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </ButtonGroup>
        </HeroSection>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </MainContent>
    </HomeContainer>
  );
};

export default Home;