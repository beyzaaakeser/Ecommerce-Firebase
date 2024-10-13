import React from 'react';
import {Link, useNavigate} from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();


    return (
        <div className='container notFound d-flex flex-column gap-5 align-items-center justify-content-center '>

            <div>
                Not found page.
            </div>

            <div className='d-flex align-items-center justify-content-center  '>
                <Link to="/">Home Page</Link>
            </div>


        </div>
    );
};

export default NotFound;
