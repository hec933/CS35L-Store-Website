import { useEffect, useState } from 'react'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import Text from '@/components/common/Text'
import LoginPannel from '@/components/shared/LoginPannel'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvv8hpHMXE_aKHbXmCUGygFSEIiHZTvJM",
  authDomain: "handy35l.firebaseapp.com",
  projectId: "handy35l",
  storageBucket: "handy35l.firebasestorage.app",
  messagingSenderId: "690933385734",
  appId: "1:690933385734:web:3171e6615b22ba54bc9187",
  measurementId: "G-5P03H6DNQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export default function Login() {
    const [showModal, setShowModal] = useState(false)
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (showModal) {
            disablePageScroll()
        } else {
            enablePageScroll()
        }
    }, [showModal]);


    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log('Google Sign-In Successful:', user);
            setLoggedIn(true); //After successful login, set LoggedIn to true
            setShowModal(false); // Close the modal on successful login
            alert(`Welcome, ${user.displayName}!`);
        } catch (error) {
            //console.error('Login failed:', error.message);
            alert('Login failed. Please check your credentials and try again.');
        }

    };

    //Function to handle logout
    const handleLogout = () => {
        setLoggedIn(false); //Set loggedIn to false to "log out"
        setShowLogoutPrompt(false);
    };

    // Function to open the login confirmation prompt
    const openLogoutPrompt = () => {
        setShowLogoutPrompt(false); //Show the confirmation prompt when logging out
    };

    const closeLogoutPrompt = () =>{
        setShowLogoutPrompt(false); //Close the confirmation prompt if "NO" or clicked out the box
    };

    return (
        <>
            <Text
                size="sm"
                color="darkestBlue"
                onClick={() => {
                    if (loggedIn){
                        openLogoutPrompt(); //Show the logout prompt if logged in
                    }else{
                        setShowModal(true); //Show the login modal if not logged in
                    }
                }}
                >
                {loggedIn ? "Logged In" : "Sign in / register"}
            </Text>

            {showLogoutPrompt && (
                <div
                className="fixed top-0 left-0 w-screen h-screen bg-lightestBlue z-50 flex justify-center items-center"
                onClick= {closeLogoutPrompt} //Close the prompt if clicked outside
                >
                    <div
                    className="bg-white p-6 rounded shadow-md w-64"
                    
                    
                     onClick={(e) => e.stopPropagation()} //Prevent closing when clicking inside the prompt
                    >
                     <p>Are you sure you want to log out?</p>
                     <button
                     className="mr-4"
                     onClick={handleLogout}//Log out if "yes"
                     >
                        Yes
                     </button>
                     <button onClick={closeLogoutPrompt}>No</button>
                    </div>
                </div>
            )}



            {showModal && !loggedIn &&(
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-gray-400/50 z-50 flex justify-center items-center"
                    onClick={() => setShowModal(false)} // Close the modal if clicked outside
                >
                    <LoginPannel handleLogin={handleLogin} />
                </div>
            )}
        </>
    );
}
