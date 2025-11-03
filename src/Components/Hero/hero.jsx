import React, {useEffect} from 'react';
import './heroStyle.scss'
import {useDispatch, useSelector} from "react-redux";
import {GetRegister, RemoveRegister} from "../../store/isAuth.js";
import {useNavigate} from "react-router-dom";
import {deleteUser, getUsers} from "../../store/usersSlice.js";

const Hero = ({updateRegister}) => {
    const [logOut, setLogOut] = React.useState(false);
    const [deleteAcc, setDeleteAcc] = React.useState(false);
    const dispatch = useDispatch();
    const {items} = useSelector(state => state.users);
    const {item} = useSelector(state => state.isAuth);

    const navigate = useNavigate();


    useEffect(() => {
        dispatch(getUsers());
        dispatch(GetRegister())
    }, [dispatch]);



    const toLogOut = () => {
        dispatch(RemoveRegister());
    }

    const deleteAccount =  () => {
        const i = items.find(u => u.email === item.email).id;
        dispatch(deleteUser(i))
        toLogOut()
    }

    return (
        <section id="hero">
            <div className="container">
                <div className="hero">
                    <h1>You have successfully <br/>registered</h1>
                    <button onClick={()=> setLogOut(true)}>Log out</button>
                    <button onClick={()=> setDeleteAcc(true)}>Delete account</button>
                </div>

                <div className="content">
                    <h2>All registered accounts</h2>
                    <div className="content--group">
                        {
                            items.map((it, ind) => (
                                <div className="content--group__block" key={ind}>
                                    <p>Gmail: <span>{it.email}</span></p>
                                    <p>Password: <span>{it.password}</span></p>
                                    <p>Id: <span>{it.id}</span></p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='teh'>
                    <h2>Использованные технологии:</h2>
                    <div className="teh--info">
                        <p>- ⚡ Vite — быстрый сборщик проекта</p>
                        <p>- ⚛️ React — фронтенд-библиотека</p>
                        <p>- 🧠 Redux Toolkit — глобальное состояние</p>
                        <p>- 🧭 React Router — навигация по страницам</p>
                        <p>- 🎨 SCSS — модульные стили</p>
                        <p>- ✉️ EmailJS — отправка кода на gmail</p>
                        <p>- 🌐 Axios — API-запросы</p>
                        <p>🗄️ Xano — backend and database (no-code API)</p>
                    </div>
                </div>
            </div>


            <div style={{display: logOut? '': 'none'}} className='massage'>
                <div className="massage--block">
                    <h2>Are you sure you want to log out <br/>of your account?</h2>
                    <button onClick={()=> setLogOut(false)}>Cancel</button>
                    <button onClick={()=> {toLogOut(); updateRegister(); setLogOut(false)}}>Log out</button>
                </div>
            </div>
            <div style={{display: deleteAcc? '': 'none'}} className='massage'>
                <div className="massage--block">
                    <h2>Are you sure you want to delete <br/>your account?</h2>
                    <button onClick={()=> setDeleteAcc(false)}>Cancel</button>
                    <button onClick={()=> {deleteAccount(); updateRegister(); setDeleteAcc(false)}}>Delete</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;