import React from 'react';
import Button from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../pages';
import SignUp from './SignUp';

interface Props {
    theme: Theme;
    onToggleTheme: Function;
}

const Home: React.FC<Props> = ({ theme, onToggleTheme }: Props) => {
    const classes = useStyles(theme);
    return (
        <div className={classes.root}>
            <Typography>{`${theme.palette.type} theme`}</Typography>
            <div>
                <Button onClick={() => onToggleTheme()}>Toggle</Button>
                <SignUp />
            </div>
        </div>
    );
};
export default Home;
