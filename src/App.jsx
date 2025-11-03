
import './App.scss'
import LogIn from "./Components/LogIn/logIn.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./Components/SignUp/signUp.jsx";
import Hero from "./Components/Hero/hero.jsx";
import {useDispatch, useSelector} from "react-redux";
import {GetRegister} from "./store/isAuth.js";
import NoAuth from "./Components/NotAuth/noAuth.jsx";


function App() {
    const {item} = useSelector(state => state.isAuth);
    const dispatch = useDispatch();


    const updateRegister = ()=>{
        dispatch(GetRegister())
    }

  return (
    <>
        <Routes>
            <Route path="/" element={item.isRegister?<Hero updateRegister={updateRegister} />:<NoAuth />} />
            <Route path="/logIn" element={<LogIn updateRegister={updateRegister}/>} />
            <Route path="/signUp" element={<SignUp updateRegister={updateRegister}/>} />
        </Routes>
    </>
  )
}

export default App
