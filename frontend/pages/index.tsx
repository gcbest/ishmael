import * as injectTapEventPlugin from 'react-tap-event-plugin';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, lightBaseTheme, darkBaseTheme } from 'material-ui/styles';
import Home from '../components/Home';

const lightMuiTheme = getMuiTheme(lightBaseTheme);
const darkMuiTheme = getMuiTheme(darkBaseTheme);
// injectTapEventPlugin();

const HomePage = () => (
    <MuiThemeProvider muiTheme={darkMuiTheme}>
        <Home />
    </MuiThemeProvider>
);

export default HomePage;
