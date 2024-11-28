import React from "react";

import "./GrantAccess.css";

export const SearchResultsLists = ({ results }) => {
    return <div className="search-bar-results">
        {
            results.map((result, id) => {
                return (
                    <div className="search-bar-results-item">
                        <div>{result.name}</div>
                        <div>{result.id}</div>
                    </div>
                )
            })
        }
    </div>;
};
