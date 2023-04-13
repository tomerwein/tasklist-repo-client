import "./components/registerStyles.css" 
import { useRef, useState, useEffect } from "react";
import {faTriangleExclamation, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css"
import Register from "./Register";
import TaskManager from "./TaskManager";
import Task from "./components/taskInfo";

// const SIGNIN_URL: string = 'http://localhost:8080/signin';
const SIGNIN_URL: string = `${process.env.REACT_APP_API_URL}/signin`;


const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    
    const [importantTasks, setImportantTasks] = useState<Task[]>([]);
    const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

    const [errorMessage, setErrorMessage] = useState('');
    const [userAllowToEnterTaskManager, setUserAllowToEnterTaskManager] = useState(false);
    const [notRegister, setNotRegister] = useState(false);

    const [user, setUser] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [validName, setValidName] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isValidPassword, setIsValidPwd] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [passwordFocus, setPasswordFocus] = useState(false);
    
    const userRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        userRef.current?.focus();
        setErrorMessage('');
    }, [])

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`${SIGNIN_URL}?user=${user}&password=${password}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            const data = await response.json();

            if (response.status === 200) {                
                const userDetails = data.find((item:any) => item.user === user)
                setImportantTasks (userDetails.important_tasks);
                setGeneralTasks (userDetails.general_tasks);
                setCompletedTasks(userDetails.completed_tasks);
                setUserAllowToEnterTaskManager(true);

                localStorage.setItem("loggedInUser", JSON.stringify({
                     username: user, importantTasks: importantTasks,
                      generalTasks: generalTasks, completedTasks: completedTasks }));


            } else if (response.status === 403){
                setErrorMessage('Username or password is missing');
            } else if (response.status === 404){
                setErrorMessage('Username is not exist');
            } else if (response.status === 401) {
                setErrorMessage('Wrong password');
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
        userAllowToEnterTaskManager ? <TaskManager
        username={user}
        importantTasks={importantTasks}
        setImportantTasks={setImportantTasks}
        generalTasks={generalTasks}
        setGeneralTasks={setGeneralTasks}
        completedTasks={completedTasks}
        setCompletedTasks={setCompletedTasks}/> :
        notRegister ? <Register/> :
        <div className="register_box">
            <div className="border_the_login">
        

            <form onSubmit={handleSignIn} className="submit_signin">

                <span className="sign_in_heading"> Login </span>    
                <span className="username_signin"> Username: </span>

                <div className="user_container"> 
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="user_instructions"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                    />        
                </div>

                <span className="password"> Password: </span>

                <div className="password_container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                        aria-invalid={isValidPassword && password ? "false" : "true"}
                        aria-describedby="password_instruction"
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

                </div>  

                <button className="sign_in_button" type="submit">
                    Login
                </button>
    
    

                <p className={errorMessage === "Username is not exist" ?
                    "error_message" : "clean_screen"}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ paddingRight: "8px" }}/>
                        User name is not exist, try again! <br />       
                </p> 

                <p className={errorMessage === "Wrong password" ?
                    "error_message" : "clean_screen"}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ paddingRight: "8px" }}/>
                        Oops password is wrong <br />       
                </p>

                <p className={errorMessage === "Username or password is missing" ?
                    "error_message" : "clean_screen"}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ paddingRight: "8px" }}/>
                        Username or password is missing <br />       
                </p>  
            </form> 

            <span className="register_password_container"> 
                <button className="register_password_button" 
                    onClick={() => setNotRegister(true)}>          
                    Don't have an account?
                </button>

                <button className="register_password_button">          
                    Forgot your password?
                </button>
            </span>
            
            </div>
            </div> 

                        
    )
}

export default SignIn