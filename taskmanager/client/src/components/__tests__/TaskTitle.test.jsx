import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskTitle from '../TaskTitle';

describe('TaskTitle Component', () => {
  test('renders with label and className', () => {
    render(<TaskTitle label="Test Label" className="bg-blue-600" />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(document.querySelector('.bg-blue-600')).toBeInTheDocument();
  });

  test('calls onAddClick when add button is clicked', () => {
    const mockOnAddClick = jest.fn();
    render(<TaskTitle label="Test Label" className="bg-blue-600" onAddClick={mockOnAddClick} />);
    
    const addButton = screen.getByRole('button');
    fireEvent.click(addButton);
    
    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });

  test('add button has correct title attribute', () => {
    render(<TaskTitle label="Test Label" className="bg-blue-600" onAddClick={() => {}} />);
    
    const addButton = screen.getByRole('button');
    expect(addButton).toHaveAttribute('title', 'Add Test Label Task');
  });
});