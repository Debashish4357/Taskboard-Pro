import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Tasks from '../Tasks';

// Mock the components used in Tasks.jsx
jest.mock('../../components/TaskTitle', () => {
  return function MockTaskTitle({ label, className, onAddClick }) {
    return (
      <div data-testid={`task-title-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <span>{label}</span>
        <button onClick={onAddClick} data-testid={`add-button-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          Add
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Loader', () => () => <div>Loading...</div>);
jest.mock('../../components/Title', () => ({ title }) => <h1>{title}</h1>);
jest.mock('../../components/Button', () => ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
));
jest.mock('../../components/Tabs', () => ({ children }) => <div>{children}</div>);
jest.mock('../../components/BoardView', () => ({ tasks }) => <div>Board View</div>);
jest.mock('../../components/task/Table', () => ({ tasks }) => <div>Table View</div>);
jest.mock('../../components/task/AddTask', () => ({ open, setOpen, initialStage }) => (
  <div data-testid="add-task-modal" data-open={open} data-stage={initialStage}>
    Add Task Modal
  </div>
));

// Mock the Redux hooks
jest.mock('../../redux/slices/taskApiSlice', () => ({
  useGetTasksQuery: () => ({
    data: { tasks: [] },
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

const mockStore = configureStore([]);

describe('Tasks Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('renders task titles with add buttons', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('task-title-to-do')).toBeInTheDocument();
    expect(screen.getByTestId('task-title-in-progress')).toBeInTheDocument();
    expect(screen.getByTestId('task-title-completed')).toBeInTheDocument();
  });

  test('clicking add button in To Do section opens modal with TODO stage', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    const addButton = screen.getByTestId('add-button-to-do');
    fireEvent.click(addButton);

    const modal = screen.getByTestId('add-task-modal');
    expect(modal).toHaveAttribute('data-open', 'true');
    expect(modal).toHaveAttribute('data-stage', 'TODO');
  });

  test('clicking add button in In Progress section opens modal with IN PROGRESS stage', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    const addButton = screen.getByTestId('add-button-in-progress');
    fireEvent.click(addButton);

    const modal = screen.getByTestId('add-task-modal');
    expect(modal).toHaveAttribute('data-open', 'true');
    expect(modal).toHaveAttribute('data-stage', 'IN PROGRESS');
  });

  test('clicking add button in Completed section opens modal with COMPLETED stage', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Tasks />
        </BrowserRouter>
      </Provider>
    );

    const addButton = screen.getByTestId('add-button-completed');
    fireEvent.click(addButton);

    const modal = screen.getByTestId('add-task-modal');
    expect(modal).toHaveAttribute('data-open', 'true');
    expect(modal).toHaveAttribute('data-stage', 'COMPLETED');
  });
});