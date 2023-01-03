/* eslint-disable */
import React, { useState } from 'react';
import {debounce} from 'lodash';
import AsyncSelect from 'react-select/async-creatable';

import axios from "axios";
axios.defaults.withCredentials = true;

const _loadSuggestions = async (query, callback) => {
    const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/api/tags`,
        {
            params: { search: query }
        },
    );
    let tags = response.data.data.map(tag => ({ value: tag.id, label: tag.label }));
    callback(tags)
};

const loadSuggestions = debounce(_loadSuggestions, 300);

export default ({onChange, value}) => {
    return (
        <AsyncSelect
            value={value}
            loadOptions={_loadSuggestions}
            isMulti
            placeholder="Search or create new tag"
            onChange={onChange}
        />
    )
} 