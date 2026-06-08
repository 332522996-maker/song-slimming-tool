import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 这里已经完全替换成了你截图里的真实配置！
const firebaseConfig = {
  apiKey: "AIzaSyAmE6CCF_9KAVTP4xfAYcwKB_5vvK0tlc8",
  authDomain: "song-slimming-tool.firebaseapp.com",
  projectId: "song-slimming-tool",
  storageBucket: "song-slimming-tool.firebasestorage.app",
  messagingSenderId: "1001172503763",
  appId: "1:1001172503763:web:4507c918adbc4010ae5826"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google 登录异常:", error);
    throw error;
  }
};
