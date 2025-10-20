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
  
  // For MUI v7, we need to handle the legacy API differently
  if (container) {
    return <MuiGrid container spacing={props.spacing} {...gridProps}>{children}</MuiGrid>;
  }
  
  if (item) {
    // For item, we need to use the new Grid2 API
    const { xs, sm, md, lg, xl, ...restProps } = gridProps;
    const sizeObj = { xs, sm, md, lg, xl } as any;
    return <MuiGrid size={sizeObj} {...restProps}>{children}</MuiGrid>;
  }
  
  return <MuiGrid {...gridProps}>{children}</MuiGrid>;
};

export default Grid;

