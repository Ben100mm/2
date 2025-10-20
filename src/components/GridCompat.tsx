/**
 * Grid Compatibility Wrapper for MUI v7
 * Provides backward compatibility with the old Grid API (container/item props)
 */

import React from 'react';
import { Grid as MuiGrid } from '@mui/material';

// Type for the legacy Grid props
interface GridCompatProps {
  container?: boolean;
  item?: boolean;
  children?: React.ReactNode;
  spacing?: number;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
  lg?: number | boolean;
  xl?: number | boolean;
  size?: number | boolean | { xs?: number | boolean; sm?: number | boolean; md?: number | boolean; lg?: number | boolean; xl?: number | boolean };
  sx?: any;
  component?: React.ElementType;
  [key: string]: any; // Allow other props
}

/**
 * Grid component that wraps MUI Grid to support legacy `item` prop
 * Usage: Same as the old Grid component with `container` and `item` props
 */
export const Grid: React.FC<GridCompatProps> = ({ container, item, size, children, ...props }) => {
  // Handle size prop - convert to individual breakpoint props
  let gridProps = { ...props };
  
  if (size) {
    if (typeof size === 'object') {
      // size is an object with breakpoint values
      gridProps = { ...gridProps, ...size };
    } else {
      // size is a single value, apply to xs
      gridProps.xs = size;
    }
  }
  
  // Use type assertion to bypass TypeScript checks for the legacy API
  return <MuiGrid {...(gridProps as any)} container={container} item={item}>{children}</MuiGrid>;
};

export default Grid;

