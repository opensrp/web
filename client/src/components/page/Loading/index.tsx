import React from 'react';
import { Ripple } from '@onaio/loaders';
import './style.css';

/** interface for Ripple props */
export interface LoaderProps {
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  height?: string;
  minHeight?: string;
  width?: string;
}

export const defaultProps: Partial<LoaderProps> = {
  borderColor: '#ff5d00',
  borderStyle: 'solid',
  borderWidth: '4px',
  height: '64px',
  minHeight: '80vh',
  width: '64px',
};

/** Loading component that displays a nice ripple */
const Loader: React.FC<LoaderProps> = (props: LoaderProps) => {
  return <Ripple {...props} />;
};

Loader.defaultProps = defaultProps;

export default Loader;
