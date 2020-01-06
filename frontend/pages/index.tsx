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

interface Props {
    theme: Theme;
    onToggleTheme: Function;
}

const Demo: React.FC<Props> = ({ theme, onToggleTheme }: Props) => {
    const classes = useStyles(theme);
    return (
        <div className={classes.root}>
            <Typography>{`${theme.palette.type} theme`}</Typography>
            <div>
                <Button onClick={() => onToggleTheme()}>Toggle</Button>
            </div>
        </div>
    );
};

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
                <Demo theme={muiTheme} onToggleTheme={toggleDarkTheme} />
            </ThemeProvider>
        </div>
    );
}
