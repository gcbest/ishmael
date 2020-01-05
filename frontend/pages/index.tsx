// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import { MuiThemeProvider, lightBaseTheme, darkBaseTheme } from 'material-ui/styles';
// import Home from '../components/Home';

// const lightMuiTheme = getMuiTheme(lightBaseTheme);
// const darkMuiTheme = getMuiTheme(darkBaseTheme);

// const HomePage = () => (
//     // <MuiThemeProvider muiTheme={darkMuiTheme}>
//     //     <Home />
//     // </MuiThemeProvider>
//     <MuiThemeProvider muiTheme={lightMuiTheme}>
//         <Home />
//     </MuiThemeProvider>
// );

// export default HomePage;

import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
    createStyles,
    makeStyles,
    ThemeProvider,
    useTheme,
    createMuiTheme,
    Theme,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
            textAlign: 'center',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
        },
    })
);

const lightTheme = createMuiTheme({
    palette: {
        // This is the default, so only included for comparison.
        type: 'light',
    },
});

const darkTheme = createMuiTheme({
    palette: {
        // Switching the dark mode on is a single property value change.
        type: 'dark',
    },
});

function Demo() {
    const defaultClasses = useStyles(darkTheme);
    const theme = useTheme();
    const [classes, setClasses] = useState({ darkMode: false });

    return (
        <div className={classes.root}>
            <Typography>{`${theme.palette.type} theme`}</Typography>
            <div>
                <Button onClick={() => setClasses({ darkMode: classes })}>Toggle</Button>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div style={{ width: '100%' }}>
            <ThemeProvider theme={darkTheme}>
                <Demo />
            </ThemeProvider>
        </div>
    );
}
