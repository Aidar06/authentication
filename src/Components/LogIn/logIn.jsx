import './logInStyle.scss';
import {GoPerson} from "react-icons/go";
import {TbLockPassword} from "react-icons/tb";
import {useState, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUsers} from "../../store/usersSlice.js";
import {Register} from "../../store/isAuth.js";
import CodeInput from "../CodeInput/inp.jsx";
import emailjs from '@emailjs/browser';
import { IoArrowBackOutline } from "react-icons/io5";
import {useNavigate} from "react-router-dom";

const LogIn = ({updateRegister}) => {
    const [authenticationAtap, setAuthenticationAtap] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [corEmail, setCorEmail] = useState(false);
    const [corPassword, setCorPassword] = useState(false);
    const [corCode, setCorCode] = useState(false);
    const [randomCode, setRandomCode] = useState('');
    const [code, setCode] = useState("");
    const [massage, setMassage] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const dispatch = useDispatch();
    const {items} = useSelector(state => state.users);
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    // --- функция для отправки письма с кодом ---
    const sendCode = async () => {
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();
        setRandomCode(codeValue);

        const templateParams = {
            message: `Your verification code is: ${codeValue}`,
            email: email
        };

        try {
            await emailjs.send(
                'service_k319wnf',
                'template_yrmq0cy',
                templateParams,
                'ImSbS8mN65ZQpUwNj'
            );
            console.log('Код отправлен на почту:', email);
        } catch (error) {
            console.log('Ошибка при отправке:', error);
        }
    };

    const register = async () => {
        const user = items.find(u => u.email === email);
        if (!user) {
            setCorEmail(false);
            setMassage(true);
            return;
        }

        setCorEmail(true);
        if (user.password === password) {
            setCorPassword(true)
            startTimer()
            setAuthenticationAtap(2);

            // отправляем код
            await sendCode();

        } else {
            setCorPassword(false);
            setMassage(true);
        }
    };

    const inputFull = () => {
        if (email === "" || password === "") {
            return {d: true, s: {background: "#d8d8d8", color: "#575757"}};
        }
        return {d: false, s: {}};
    };

    const codeFull = () => {
        if (code.length !== 6) {
            return {d: true, s: {background: "#d8d8d8", color: "#575757"}};
        }
        return {d: false, s: {}};
    };

    const finalRegister = () => {
        if (code === randomCode) {
            setCorCode(true);
            dispatch(Register(
                {
                    isRegister: true,
                    email: email,
                    password: password,
                }
            ));
            updateRegister()
            navigate('/');
        }else {
            setCorCode(false);
            setMassage(true);
        }
    }



    useEffect(() => {
        let interval;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

// Функция запуска таймера
    const startTimer = () => {
        setTimer(30);
        setIsTimerActive(true);
    };

    const [massageSent, setMassageSent] = useState(false);

    const showMassage = () => {
        setMassageSent(true);
        setTimeout(() => {
            setMassageSent(false);
        }, 5000); // через 6 секунд сбрасываем обратно в false
    };

    return (
        <section id='logIn'>
            {authenticationAtap === 1 ? (
                <div className="logIn">
                    <div className="logIn--logo">
                        <div className="logIn--logo__chercle">
                            <div></div>
                        </div>
                        <h3>Compony</h3>
                    </div>
                    <h2>Sign in to your account to <br/>continue</h2>
                    <div className="logIn--input">
                        <div><GoPerson/></div>
                        <input onChange={(e) => {setEmail(e.target.value); setMassage(false)}} type="text" placeholder="Email"/>
                    </div>
                    <div className="logIn--input">
                        <div><TbLockPassword/></div>
                        <input onChange={(e) => {setPassword(e.target.value), setMassage(false)}} type="password" placeholder="Password"/>
                    </div>
                    <button onClick={register} disabled={inputFull().d} style={inputFull().s}>Log In</button>
                    <h5 onClick={()=> navigate('/signUp')}>I have not an account Sign up</h5>
                </div>
            ) : (
                <div className="logInCode">
                    <div onClick={()=> setAuthenticationAtap(1)} className='logInCode--back'><IoArrowBackOutline /></div>
                    <div className="logInCode--logo">
                        <div className="logInCode--logo__chercle">
                            <div></div>
                        </div>
                        <h3>Compony</h3>
                    </div>
                    <h2>Two-Factor Authentication</h2>
                    <h3>Enter the 6-digit code sent to your email</h3>
                    <div className="logInCode--input">
                        <CodeInput length={6} onChange={setCode} setMassage={setMassage} />
                    </div>
                    <button onClick={finalRegister} disabled={codeFull().d} style={codeFull().s}>Continue</button>
                    {
                        isTimerActive?
                            <h5 style={{color: "gray"}}>The code can be sent in {timer}s</h5>:
                            <h5 onClick={()=> {startTimer(); showMassage(); sendCode()}}>Send the code again</h5>
                    }

                </div>
            )}

            <div style={{top: !massage? '-100px': ''}} className="massage">
                {
                    !corEmail?
                        <p>An account with this Gmail <br/>doesn't exist!</p>: !corPassword?
                            <p>The password is incorrect!</p>: <p>The code is incorrect!</p>
                }
            </div>
            <div style={{top: !massageSent? '-100px': ''}} className="massageSent">
                <p>New code has been sent!</p>
            </div>
        </section>
    );
};

export default LogIn;
