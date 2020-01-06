import React, { useState } from 'react';
import {
    createStyles,
    makeStyles,
    ThemeProvider,
    createMuiTheme,
    Theme,
} from '@material-ui/core/styles';
import Home from '../components/Home';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
            textAlign: 'center',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
        },
    })
);

// This is the default
export const lightTheme = createMuiTheme({ palette: { type: 'light' } });

// Switching the dark mode on is a single property value change.
export const darkTheme = createMuiTheme({ palette: { type: 'dark' } });

export default function HomePage() {
    const [theme, setTheme] = useState(lightTheme);

    // we change the palette type of the theme in state
    const toggleDarkTheme = () => {
        const newTheme = theme.palette.type === 'light' ? darkTheme : lightTheme;
        setTheme(newTheme);
    };

    const muiTheme = theme;
    return (
        <div style={{ width: '100%' }}>
            <ThemeProvider theme={muiTheme}>
                <Home theme={muiTheme} onToggleTheme={toggleDarkTheme} />
            </ThemeProvider>
        </div>
    );
}
