import React from 'react'

export const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className='search'>
            <div>
                <img src="search.svg" alt="search" />
                <input
                    type="text"
                    placeholder='Search Through 1000s of movies'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

            </div>
        </div>
        // <div className='text-white text-3xl'>{searchTerm}</div>
    )
}
