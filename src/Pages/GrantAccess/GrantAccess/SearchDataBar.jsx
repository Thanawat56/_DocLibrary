import React, { useState } from 'react'

import './GrantAccess.css'

function SearchDataBar({setResults}) {
    const [input, setInput] = useState('')

    const fetchData = (value ) => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => {
                const results = json.filter((user) => {
                    return (
                        value &&
                         user &&
                          user.name &&
                           user.id &&
                           user.id.toString().includes(value) ||
                           user.name.toLowerCase().includes(value)
                    );
                });
                console.log(results);
                setResults(results);
            });
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

    return (
        <div className='search-bar'>
            <span className='bi bi-search'></span>
            <input
                className='DataInput'
                placeholder='ID, Name, Search...'
                autoFocus
                value={input}
                onChange={(e) => handleChange(e.target.value)} />
        </div>
    )
}

export default SearchDataBar