import React from 'react';

const Loading = ({desingh}) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className={`spinner-border ${desingh} text-warning`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    );
};

export default Loading;
