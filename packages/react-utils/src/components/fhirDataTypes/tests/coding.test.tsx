import React from 'react';
import { render, screen } from '@testing-library/react';
import { Coding } from '../Coding';
import { Coding as TCoding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

describe('Coding Component', () => {
  test('renders with display, system, and code', () => {
    const coding: TCoding = {
      display: 'Test Display',
      system: 'http://test-system',
      code: '12345',
    };
    render(<Coding coding={coding} />);
    expect(screen.getByText('Test Display(http://test-system|12345)')).toBeInTheDocument();
  });

  test('renders with only display', () => {
    const coding: TCoding = { display: 'Test Display' };
    render(<Coding coding={coding} />);
    expect(screen.getByText('Test Display')).toBeInTheDocument();
  });

  test('renders with only system and code', () => {
    const coding: TCoding = { system: 'http://test-system', code: '12345' };
    render(<Coding coding={coding} />);
    expect(screen.getByText('(http://test-system|12345)')).toBeInTheDocument();
  });

  test('renders with system and no code', () => {
    const coding: TCoding = { system: 'http://test-system' };
    render(<Coding coding={coding} />);
    expect(screen.getByText('(http://test-system|)')).toBeInTheDocument();
  });

  test('renders with display and system but no code', () => {
    const coding: TCoding = { display: 'Test Display', system: 'http://test-system' };
    render(<Coding coding={coding} />);
    expect(screen.getByText('Test Display(http://test-system|)')).toBeInTheDocument();
  });

  test('renders with no display, system, or code', () => {
    const coding: TCoding = {};
    render(<Coding coding={coding} />);
    expect(screen.getByTestId('coding-string')).toBeInTheDocument();
  });
});
