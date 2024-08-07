import { Box } from '@mui/material';
import React from 'react';

const PageHeader: React.FC<{pageName: string}> = ({pageName}) => {
  
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
    >
      <h1>ComplainTracker | {pageName} Page</h1>
    </Box>
  );
};

export default PageHeader;
