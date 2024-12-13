import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDvv8hpHMXE_aKHbXmCUGygFSEIiHZTvJM',
    authDomain: 'handy35l.firebaseapp.com',
    projectId: 'handy35l',
    storageBucket: 'handy35l.firebasestorage.app',
    messagingSenderId: '690933385734',
    appId: '1:690933385734:web:3171e6615b22ba54bc9187',
    measurementId: 'G-5P03H6DNQ5',
}

const app = initializeApp(firebaseConfig)

let analytics
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app)
        }
    })
}

export const auth = getAuth(app)
export default app