import "./components/registerStyles.css" 
import { useRef, useState, useEffect } from "react";
import {faCircleCheck, faCircleXmark, faCircleQuestion, faTriangleExclamation, faEye, faEyeSlash, faExclamationTriangle} 
from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css"
import SignIn from "./SignIn";
import RegisterSucceed from "./RegisterSucceed";

const USER_REGEX: RegExp = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?^*!@#$%]).{8,24}$/;
// const REGISTER_URL: string = 'http://localhost:8080/register';
const REGISTER_URL: string =`${process.env.REACT_APP_API_URL}/register`;

const Register = () => {
    const [checkIn, setCheckIn] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showMatchedPassword, setShowMatchedPassword] = useState(false);

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPwd] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [isMatchPasswords, setIsMatchPasswords] = useState(false);
    const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    
    const userRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        userRef.current?.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
        setIsValidPwd(PASSWORD_REGEX.test(password));
        setIsMatchPasswords(password === matchPassword)
        setErrorMessage('');
    }, [user, password, matchPassword]) 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: user, password: password,
                    important_tasks: [], general_tasks: [], completed_tasks: [] })
            });
     
            if (response.status !== 409) {
                setSuccess(true);
            } else{
                setErrorMessage('Username Taken');
            }
                
        } catch (err: any) {
            console.log(`err: ${err.message}`);
            if (!err?.response) {
                setErrorMessage("No server response");
            } else if (err.response?.status === 409) {
                setErrorMessage('Username Taken');
            } else {
                setErrorMessage('Registration Failed')
            }
        }  
    }

    return (
        checkIn ? <SignIn/> :
        success ? <RegisterSucceed 
        user={user}
        password={password}
        /> :
        <div className="register_box">
            <div className="border_the_register">
        <span className="register_heading"> Register </span>    
            <span className="username_register"> Username: </span>     
            
            <form onSubmit={handleSubmit} className='submit_register'>
            <div className="user_container"> 
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                /> 

                <span className="icon_user">
                <FontAwesomeIcon icon={faCircleCheck} 
                    className={validName ? "show_v" : "hide_v"} />
                <FontAwesomeIcon icon={faCircleXmark}
                    className={user && !validName ? "show_x" : "hide_x"} />
                </span>              

                <p id="user_instructions"
                    className={user && !validName ? "info_if_not_valid" : "clean_screen"}>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    You must enter 4 to 24 characters.<br />
                    English letters. Must begin with a letter.<br />
                    Letters, numbers, underscores and hyphens allowed
                </p>  
            
            </div>


            <span className="password"> Password: </span>
            
            <div className="password_container">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(false)}
                />

                <FontAwesomeIcon icon={faEye}
                    type="button"
                    className={showPassword ? "hide_password_eye" : "show_password_eye"}
                    onClick={() => setShowPassword(!showPassword)}
                    />

                <FontAwesomeIcon icon={faEyeSlash}
                    type="button"
                    className={showPassword ? "show_password_eye" : "hide_password_eye"}
                    onClick={() => setShowPassword(!showPassword)}
                    />

                
                <span className="icon_password">
                <FontAwesomeIcon icon={faExclamationTriangle}
                    className={password && !isValidPassword ? "show_exclamation" : "hide_exclamation"} />                        
                </span>   

                <p id="password_instruction" className={validName && !isValidPassword && password ?
                    "info_if_not_valid" : "clean_screen"}>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                     8 to 24 characters.<br />
                    Must include uppercase letter, lowercase letter,<br />
                    number and special character<br />
                </p> 

            </div>

            <span className="matchPasswords"> Confirm password: </span>
            
            <div className="match_container">
                <input
                    type={showMatchedPassword ? "text" : "password"}
                    id="matchPasswords"
                    onChange={(e) => setMatchPassword(e.target.value)}
                    value={matchPassword}
                    required
                    onFocus={() => setMatchPasswordFocus(true)}
                    onBlur={() => setMatchPasswordFocus(false)}
                />

                <FontAwesomeIcon icon={faEye}
                    type="button"
                    className={showMatchedPassword ? "hide_password_eye" : "show_password_eye"}
                    onClick={() => setShowMatchedPassword(!showMatchedPassword)}
                    />

                <FontAwesomeIcon icon={faEyeSlash}
                    type="button"
                    className={showMatchedPassword ? "show_password_eye" : "hide_password_eye"}
                    onClick={() => setShowMatchedPassword(!showMatchedPassword)}
                    />
                
                <span className="icon_match_passwords">
                    <FontAwesomeIcon icon={faExclamationTriangle}
                        className={!matchPasswordFocus && matchPassword && !isMatchPasswords ?
                         "show_exclamation" : "hide_exclamation"} />
                </span>

                <p id="match_password_instruction" 
                    className={validName && isValidPassword && !isMatchPasswords && matchPassword ?
                    "info_if_not_valid" : "clean_screen"}>
                    <FontAwesomeIcon icon={faCircleQuestion} />
                    The passwords don't match<br />       
                </p> 

            </div> 

            <div className="terms_and_conditions_container">
                <span className="terms_and_conditions">
                    <input
                        type="checkbox"
                        id="agreeTerms"
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        checked={agreeTerms}
                    />
                    I agree to the terms and conditions
                </span>
            </div>          
            
            <button className="sign_up_button" type="submit"
                disabled={!validName || !isValidPassword ||
                !isMatchPasswords  || !agreeTerms ? true : false}>
                Create account
            </button>

            </form>

            <p className={errorMessage === "Username Taken" ?
                "error_message" : "clean_screen"}>
                <FontAwesomeIcon icon={faTriangleExclamation} style={{ paddingRight: "10px" }}/>
                    User name is taken, choose another user name<br />       
            </p> 
        
            
            <span className="have_an_account"> Already have an account?
                <button className="check_in_button" 
                    onClick={() => setCheckIn(true)}>          
                    Check-In!
                </button>
            </span>
            </div>
            </div> 
            
    )
}

export default Register

