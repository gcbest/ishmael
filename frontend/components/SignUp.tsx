import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import useForm from '../lib/useForm';
import { AUTHTYPE } from '../lib/const';
// import { CURRENT_USER_QUERY } from './User';

interface Props {}

const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION(
        $email: String!
        $name: String!
        $password: String!
        $authType: String!
    ) {
        signup(email: $email, name: $name, password: $password, authType: $authType) {
            id
            email
            name
        }
    }
`;

const SignUp: React.FC<Props> = (props: Props) => {
    const { inputs, handleChange, resetForm } = useForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const authType = AUTHTYPE.LOCAL;
    const { name, email, password, confirmPassword } = inputs;
    const [signUp, { error, loading }] = useMutation(SIGNUP_MUTATION, {
        variables: { name, email, password, authType },
    });

    return (
        <form
            method="post"
            onSubmit={async e => {
                e.preventDefault();
                await signUp();
                resetForm();
            }}
        >
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for An Account</h2>
                {/* <Error error={error} /> */}
                <label htmlFor="email">
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        data-update=""
                        value={email}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        name="name"
                        placeholder="name"
                        value={name}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="password">
                    Password
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={password}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="confirmPassword">
                    Confirm Password
                    <input
                        type="confirmPassword"
                        name="confirmPassword"
                        placeholder="password"
                        value={confirmPassword}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">Sign Up!</button>
            </fieldset>
        </form>
    );
};

export default SignUp;
