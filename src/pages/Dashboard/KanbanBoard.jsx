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
  padding: 2rem;
  background: linear-gradient(135deg, #1a1f35 0%, #283352 100%);
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
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
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
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

  &:hover {
    background: rgba(255, 255, 255, 0.1);
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
`;

const TaskTitle = styled.div`
  color: white;
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
        tasksByColumn[column._id] = tasksResponse.data;
      }
      setTasks(tasksByColumn);
    } catch (error) {
      console.error('Error fetching board data:', error);
    } finally {
      setLoading(false);
    }
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
    const taskId = tasks[sourceColumnId][source.index]._id;

    try {
      await axiosInstance.put(`/tasks/${taskId}`, { columnId: destColumnId });
      
      const newTasks = { ...tasks };
      const [movedTask] = newTasks[sourceColumnId].splice(source.index, 1);
      movedTask.columnId = destColumnId;
      newTasks[destColumnId].splice(destination.index, 0, movedTask);
      
      setTasks(newTasks);
    } catch (error) {
      console.error('Error updating task position:', error);
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
        <BoardTitle>Kanban Board</BoardTitle>
        <AddColumnButton onClick={() => setShowColumnModal(true)}>
          <Plus size={20} /> Add Column
        </AddColumnButton>
      </BoardHeader>

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
    >
      <MoreVertical size={20} />
    </ActionButton>
    <ActionButton
      onClick={() => handleDeleteColumn(column._id)}
    >
      <Trash2 size={20} />
    </ActionButton>
   
    <ActionButton
  onClick={() => {
    setCurrentColumnId(column._id);  
    setCurrentTaskId(null);
    setShowTaskModal(true);
  }}
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
                          >
                            <TaskTitle>{task.title}</TaskTitle>
                            <TaskFooter>
  <TaskAssigned>
    {task.assignedTo || 'Unassigned'}
  </TaskAssigned>
  <div style={{ display: 'flex', gap: '0.5rem' }}>
  <ActionButton
  onClick={() => {
    setEditingTask(task);
    setShowTaskModal(true);
  }}
>
      <MoreVertical size={16} /> 
    </ActionButton>
    <ActionButton
      onClick={() => handleDeleteTask(task._id)}
    >
      <Trash2 size={16} /> 
    </ActionButton>
    <ActionButton
      onClick={() => {
        setCurrentTaskId(task._id);
        setShowAssignModal(true);
      }}
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
      </DragDropContext>

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