import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {lightTheme} from './index';
/** ********** Apollo **************** */
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import fetch from 'isomorphic-unfetch'

import { getAccessToken, setAccessToken } from '../lib/accessToken';
// import * as serviceWorker from './serviceWorker';
/** ******* Apollo ********** */

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable(observer => {
            let handle: any;
            Promise.resolve(operation)
                .then(operation => {
                    const accessToken = getAccessToken();
                    if (accessToken) {
                        operation.setContext({
                            headers: {
                                authorization: `bearer ${accessToken}`,
                            },
                        });
                    }
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    });
                })
                .catch(observer.error.bind(observer));

            return () => {
                if (handle) handle.unsubscribe();
            };
        })
);

const client = new ApolloClient({
    link: ApolloLink.from([
        new TokenRefreshLink({
            accessTokenField: 'accessToken',
            isTokenValidOrUndefined: () => {
                const token = getAccessToken();

                if (!token) return true;

                try {
                    const { exp } = jwtDecode(token); // get when the token will expire
                    if (Date.now() >= exp * 1000) {
                        // if the current time is past the expiration time
                        return false;
                    }
                    return true;
                } catch (err) {
                    return false; // token is invalid
                }
            },
            fetchAccessToken: () =>
                fetch('http://localhost:4000/refresh_token', {
                    method: 'POST',
                    credentials: 'include',
                }),
            handleFetch: accessToken => {
                setAccessToken(accessToken);
            },
            // handleResponse: (operation, accessTokenField) => response => {
            //   // here you can parse response, handle errors, prepare returned token to
            //   // further operations

            //   // returned object should be like this:
            //   // {
            //   //    access_token: 'token string here'
            //   // }
            // },
            handleError: err => {
                // full control over handling token fetch Error
                console.warn('Your refresh token is invalid. Try to relogin');
                console.error(err);

                // your custom action here
                // user.logout();
            },
        }),
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                console.log(graphQLErrors);
            }
            if (networkError) {
                console.log(networkError);
            }
        }),
        requestLink,
        new HttpLink({
            uri: 'http://localhost:4000/graphql',
            credentials: 'include',
            fetch
        }),
    ]),
    cache,
});


export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>My page</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
        </Head>
        <ApolloProvider client={client}>
          <ThemeProvider theme={lightTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </React.Fragment>
    );
  }
}
