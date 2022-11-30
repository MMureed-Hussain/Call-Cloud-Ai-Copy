/* eslint-disable */
import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import AsyncSelect from 'react-select/async-creatable';

const _loadSuggestions = async (query, callback) => {
    console.log(query)
};

const loadSuggestions = debounce(_loadSuggestions, 300);

export default () => {
    const [inputValue, setInputValue] = useState("");

    const onChange = value => {
        setInputValue(value);
    };

    return (
        <AsyncSelect
            value={inputValue}
            loadOptions={loadSuggestions}
            isMulti
            placeholder="Search or create new tag"
            onChange={onChange}
        />
    )
} 