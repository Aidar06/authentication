import './signUpStyle.scss';
import {GoPerson} from "react-icons/go";
import {TbLockPassword} from "react-icons/tb";
import {useState, useEffect,} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addUser, getUsers} from "../../store/usersSlice.js";
import {Register} from "../../store/isAuth.js";
import CodeInput from "../CodeInput/inp.jsx";
import emailjs from '@emailjs/browser';
import { IoArrowBackOutline } from "react-icons/io5";
import {useNavigate} from "react-router-dom";

const SignUp = ({updateRegister}) => {
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
        if (user) {
            setCorEmail(false);
            setMassage(true);
            return;
        }

        setCorEmail(true);
        const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
        if (emailPattern.test(email)) {
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
            dispatch(addUser({
                email: email,
                password: password,
            }));
            dispatch(Register(
                {
                    isRegister: true,
                    email: email,
                    password: password,
                }
            ));
            updateRegister()
            navigate('/')
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
        <section id='signUp'>
            {authenticationAtap === 1 ? (
                <div className="signUp">
                    <div className="signUp--logo">
                        <div className="signUp--logo__chercle">
                            <div></div>
                        </div>
                        <h3>Compony</h3>
                    </div>
                    <h2>Sign up to create an account and <br/>continue</h2>
                    <div className="signUp--input">
                        <div><GoPerson/></div>
                        <input onChange={(e) => {setEmail(e.target.value); setMassage(false)}} type="text" placeholder="Email"/>
                    </div>
                    <div className="signUp--input">
                        <div><TbLockPassword/></div>
                        <input onChange={(e) => {setPassword(e.target.value), setMassage(false)}} type="password" placeholder="Password"/>
                    </div>
                    <button onClick={register} disabled={inputFull().d} style={inputFull().s}>Sign up</button>
                    <h5 onClick={()=> navigate('/logIn')}>I have an account Log in</h5>
                </div>
            ) : (
                <div className="signUpCode">
                    <div onClick={()=> setAuthenticationAtap(1)} className='signUpCode--back'><IoArrowBackOutline /></div>
                    <div className="signUpCode--logo">
                        <div className="signUpCode--logo__chercle">
                            <div></div>
                        </div>
                        <h3>Compony</h3>
                    </div>
                    <h2>Two-Factor Authentication</h2>
                    <h3>Enter the 6-digit code sent to your email</h3>
                    <div className="signUpCode--input">
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
                        <p>An account with this Gmail <br/>already exists!</p>: !corPassword?
                            <p>You entered an invalid Gmail address. <br/>Example: example@gmail.com</p>: <p>The code is incorrect!</p>
                }
            </div>

            <div style={{top: !massageSent? '-100px': ''}} className="massageSent">
                <p>New code has been sent!</p>
            </div>
        </section>
    );
};

export default SignUp;
