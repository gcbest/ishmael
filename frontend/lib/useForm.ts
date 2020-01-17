import { useState } from 'react';

interface Target {
    target: { name: string; value: string };
}
interface Inputs {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

// const resetForm = () => {
//     setName('');
//     setEmail('');
//     setPassword('');
// };

export default function useForm(initial: Inputs = {}) {
    const [inputs, updateInputs] = useState(initial);

    function handleChange(e: Target) {
        updateInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        });
    }

    function resetForm() {
        updateInputs(initial);
    }

    return {
        inputs,
        handleChange,
        resetForm,
    };
}
