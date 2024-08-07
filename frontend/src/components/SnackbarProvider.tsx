// SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface SnackbarContextProps {
    openSnackbar: (message: string, severity?: AlertProps['severity'], vertical?: 'top' | 'bottom', horizontal?: 'left' | 'center' | 'right') => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const useSnackbar = (): SnackbarContextProps => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: ReactNode;
}

const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'info' as AlertProps['severity'],
        vertical: 'top' as 'top' | 'bottom',
        horizontal: 'center' as 'left' | 'center' | 'right',
    });

    const openSnackbar = (
        message: string,
        severity: AlertProps['severity'] = 'info',
        vertical: 'top' | 'bottom' = 'top',
        horizontal: 'left' | 'center' | 'right' = 'center'
    ) => {
        setSnackbarState({ open: true, message, severity, vertical, horizontal });
    };

    const closeSnackbar = () => {
        setSnackbarState({ ...snackbarState, open: false });
    };

    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: snackbarState.vertical, horizontal: snackbarState.horizontal }}
                open={snackbarState.open}
                onClose={closeSnackbar}
                autoHideDuration={6000}
                key={snackbarState.vertical + snackbarState.horizontal}
            >
                <MuiAlert onClose={closeSnackbar} severity={snackbarState.severity} elevation={6} variant="filled">
                    {snackbarState.message}
                </MuiAlert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export default SnackbarProvider;
