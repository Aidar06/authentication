import React from 'react';
import './noAuthStyle.scss'
import {useNavigate} from "react-router-dom";

const NoAuth = () => {
    const navigate = useNavigate();

    return (
        <section id="noAuth">
            <div className="noAuth">
                <h2>You haven't registered <br/>yet</h2>
                <button onClick={()=> navigate('/logIn')}>Log in</button>
                <button onClick={()=> navigate('/signUp')}>Sign up</button>
            </div>
        </section>
    );
};

export default NoAuth;