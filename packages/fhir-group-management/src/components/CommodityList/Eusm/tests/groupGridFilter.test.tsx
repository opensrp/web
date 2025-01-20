import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { GroupGridFilerRow, GroupGridFilerRowProps } from '../GroupGridFilterRow';

describe('GroupGridFilerRow Component', () => {
  const updateFilterParamsMock = jest.fn();
  const defaultProps: GroupGridFilerRowProps = {
    updateFilterParams: updateFilterParamsMock,
    currentFilters: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with all elements', () => {
    render(<GroupGridFilerRow {...defaultProps} />);

    // Check Asset filter
    expect(screen.getByText('Asset:')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(within(screen.getByTestId('asset-filter')).getByText('Show all')).toBeInTheDocument();

    // Check Status filter
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(within(screen.getByTestId('group-filter')).getByText('Inactive')).toBeInTheDocument();
  });

  test('applies filter for Asset: Yes', () => {
    render(<GroupGridFilerRow {...defaultProps} />);

    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);

    expect(updateFilterParamsMock).toHaveBeenCalledWith('isAnAsset', expect.any(Function), true);
  });

  test('applies filter for Asset: No', () => {
    render(<GroupGridFilerRow {...defaultProps} />);

    const noButton = screen.getByText('No');
    fireEvent.click(noButton);

    expect(updateFilterParamsMock).toHaveBeenCalledWith('isAnAsset', expect.any(Function), false);
  });

  test('resets filter for Asset: Show all', () => {
    const props = {
      ...defaultProps,
      currentFilters: {
        isAnAsset: {
          value: true,
        },
      },
    };
    render(<GroupGridFilerRow {...props} />);

    const showAllButton = within(screen.getByTestId('asset-filter')).getByText('Show all');
    fireEvent.click(showAllButton);

    expect(updateFilterParamsMock).toHaveBeenCalledWith('isAnAsset', undefined);
  });

  test('applies filter for group: Active', () => {
    render(<GroupGridFilerRow {...defaultProps} />);

    const activeButton = screen.getByText('Active');
    fireEvent.click(activeButton);

    expect(updateFilterParamsMock).toHaveBeenCalledWith('status', expect.any(Function), true);
  });

  test('applies filter for group: Inactive', () => {
    render(<GroupGridFilerRow {...defaultProps} />);

    const inactiveButton = screen.getByText('Inactive');
    fireEvent.click(inactiveButton);

    expect(updateFilterParamsMock).toHaveBeenCalledWith('status', expect.any(Function), false);
  });

  test('resets filter for group: Show all', () => {
    const props = {
      ...defaultProps,
      currentFilters: {
        status: {
          value: true,
        },
      },
    };
    render(<GroupGridFilerRow {...props} />);

    const showAllButton = within(screen.getByTestId('group-filter')).getByText('Show all');
    fireEvent.click(showAllButton);

    expect(updateFilterParamsMock).toHaveBeenCalledWith('status', undefined);
  });
});
