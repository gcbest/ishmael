import React from 'react';
import { mount } from 'enzyme';
// import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import HomeComponent from '../components/Home';
import { darkTheme } from '../pages';

describe('<Home />', () => {
    it('renders the home component', async () => {
        // const Mocked = (
        //     <MockedProvider>
        //         <HomeComponent theme={darkTheme} onToggleTheme={() => {}} />
        //     </MockedProvider>
        // );
        const wrapper = mount(<HomeComponent theme={darkTheme} onToggleTheme={() => {}} />);
        await wait();
        wrapper.update();
        console.log(wrapper);
        expect(wrapper.text()).toContain('dark');
        const Home = wrapper.find('Home');

        expect(Home.exists()).toBe(true);
    });
});
