import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import axiosInstance from '../../api/axiosInstance';
import AddTaskModal from '../../components/AddTaskModal';
import AssignTaskModal from '../../components/AssignTaskModal';
import ColumnModal from '../../components/ColumnModal';
import { Plus, MoreVertical, Users, Trash2 } from 'lucide-react';

const BoardContainer = styled.div`
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #1a1f35 0%, #283352 100%);
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const BoardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
`;


const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;


const EmptyState = styled.div`
  text-align: center;
  color: #a4b1cd;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 600px;

  h3 {
    color: white;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }
`;

const BoardTitle = styled.h1`
  font-size: 2rem;
  color: white;
  font-weight: bold;
`;

const AddColumnButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1976d2;
  }
`;

const ColumnsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  min-height: 0; // Important for proper scrolling
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const ColumnContainer = styled.div`
  flex: 0 0 320px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const ColumnHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColumnTitle = styled.h3`
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: #a4b1cd;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
  }
`;

const TaskList = styled.div`
  padding: 1rem;
  min-height: 200px;
`;

const TaskCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: move;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => {
      switch(props.priority?.toLowerCase()) {
        case 'high':
          return '#ff4444';
        case 'medium':
          return '#ffa000';
        case 'low':
          return '#4caf50';
        default:
          return '#4caf50';
      }
    }};
  }
`;

const TaskTitle = styled.div`
  color: white;
  margin-bottom: 0.5rem;
  padding-right: 1.5rem;
`;

const TaskDescription = styled.div`
  color: #a4b1cd;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  position: relative;

  .full-description {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #1a1f35;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 8px;
    z-index: 10;
    width: 250px;
  }

  &:hover .full-description {
    display: block;
  }
`;

const TaskDueDate = styled.div`
  color: #a4b1cd;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskAssigned = styled.div`
  color: #a4b1cd;
  font-size: 0.875rem;
`;

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #1a1f35 0%, #283352 100%);
`;

const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);
  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    try {
      const response = await axiosInstance.get('/columns');
      setColumns(response.data);
      const tasksByColumn = {};
      for (const column of response.data) {
        const tasksResponse = await axiosInstance.get(`/tasks/${column._id}`);
        tasksByColumn[column._id] = tasksResponse.data || [];
      }
      setTasks(tasksByColumn);
    } catch (error) {
      console.error('Error fetching board data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
 
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  

    delete axiosInstance.defaults.headers.common['Authorization'];
  
  
    window.location.href = '/';
  };

  const handleColumnSubmit = async (title) => {
    try {
      if (editingColumn) {
        await axiosInstance.put(`/columns/${editingColumn._id}`, { title });
      } else {
        await axiosInstance.post('/columns', { title });
      }
      fetchColumns();
      setEditingColumn(null);
      setShowColumnModal(false);
    } catch (error) {
      console.error('Error managing column:', error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      try {
        await axiosInstance.delete(`/columns/${columnId}`);
        fetchColumns();
      } catch (error) {
        console.error('Error deleting column:', error);
      }
    }
  };

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
  
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;
    
    const newTasks = { ...tasks };
    const sourceColumn = [...newTasks[sourceColumnId]];
    const destColumn = sourceColumnId === destColumnId ? 
      sourceColumn : [...newTasks[destColumnId]];
    
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);
  
    setTasks({
      ...newTasks,
      [sourceColumnId]: sourceColumn,
      [destColumnId]: destColumn
    });
  
    try {
      await axiosInstance.put(`/tasks/${removed._id}`, {
        ...removed,
        columnId: destColumnId
      });
    } catch (error) {
      console.error('Error updating task position:', error);
     
      setTasks(newTasks);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        fetchColumns();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };                                             

  if (loading) {
    return <LoadingScreen>Loading...</LoadingScreen>;
  }

  return (
    <BoardContainer>
    <BoardHeader>
  <Logo>
    📋 Kanban Board
  </Logo>

  <AddColumnButton onClick={() => setShowColumnModal(true)} title="Create a new column">
    <Plus size={20} /> Add Column
  </AddColumnButton>
  <UserInfo>
    <UserName>{localStorage.getItem("user") || "Ghost"}</UserName>
    <LogoutButton 
      onClick={handleLogout} 
      title="Sign out of your account"
    >
      Logout
    </LogoutButton>
  </UserInfo>

</BoardHeader>

{columns.length === 0 ? (
  <EmptyState>
    <h3>Welcome to your Kanban Board!</h3>
    <p>Get started by creating your first column using the "Add Column" button above.</p>
    <p>Then you can add tasks to your columns and organize your work.</p>
  </EmptyState>
) : (
  <DragDropContext onDragEnd={onDragEnd}>
        <ColumnsWrapper>
          {columns.map((column) => (
            <ColumnContainer key={column._id}>
              <ColumnHeader>
  <ColumnTitle>{column.title}</ColumnTitle>
  <ColumnActions>
  <ActionButton
    onClick={() => {
      setEditingColumn(column);
      setShowColumnModal(true);
    }}
    title="Edit column"
  >
    <MoreVertical size={20} />
  </ActionButton>
  <ActionButton
    onClick={() => handleDeleteColumn(column._id)}
    title="Delete column"
  >
    <Trash2 size={20} />
  </ActionButton>
  <ActionButton
    onClick={() => {
      setCurrentColumnId(column._id);  
      setCurrentTaskId(null);
      setShowTaskModal(true);
    }}
    title="Add new task"
  >
    <Plus size={20} />
  </ActionButton>
</ColumnActions>
</ColumnHeader>


              <Droppable droppableId={column._id}>
                {(provided) => (
                  <TaskList
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tasks[column._id]?.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <TaskCard
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          priority={task.priority}
                        >
                          <TaskTitle>{task.title}</TaskTitle>
                          {task.description && (
                            <TaskDescription>
                              {task.description.length > 100 
                                ? `${task.description.slice(0, 100)}...` 
                                : task.description}
                              {task.description.length > 100 && (
                                <div className="full-description">{task.description}</div>
                              )}
                            </TaskDescription>
                          )}
                          <TaskDueDate>Due: {new Date(task.dueDate).toLocaleDateString()}</TaskDueDate>
                          <TaskFooter>
                            <TaskAssigned>
                              {task.assignedTo || ""}
                            </TaskAssigned>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <ActionButton
                                onClick={() => {
                                  setEditingTask(task);
                                  setShowTaskModal(true);
                                }}
                                title="Edit task"
                              >
                                <MoreVertical size={16} />
                              </ActionButton>
                              <ActionButton
                                onClick={() => handleDeleteTask(task._id)}
                                title="Delete task"
                              >
                                <Trash2 size={16} />
                              </ActionButton>
                              <ActionButton
                                onClick={() => {
                                  setCurrentTaskId(task._id);
                                  setShowAssignModal(true);
                                }}
                                title="Assign user"
                              >
                                <Users size={16} />
                              </ActionButton>
                            </div>
                          </TaskFooter>
                        </TaskCard>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TaskList>
                )}
              </Droppable>
            </ColumnContainer>
          ))}
        </ColumnsWrapper>
      </DragDropContext>)}

      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => {
          setShowColumnModal(false);
          setEditingColumn(null);
        }}
        onSubmit={handleColumnSubmit}
        editingColumn={editingColumn}
      />

{showTaskModal && (
  <AddTaskModal
    onClose={() => {
      setShowTaskModal(false);
      setEditingTask(null);
    }}
    onSubmit={fetchColumns}
    editingTask={editingTask}
    columnId={editingTask?.columnId || currentColumnId}
  />
)}

      {showAssignModal && (
        <AssignTaskModal
          taskId={currentTaskId}
          onClose={() => setShowAssignModal(false)}
          onSubmit={fetchColumns}
        />
      )}
    </BoardContainer>
  );
};

export default KanbanBoard;