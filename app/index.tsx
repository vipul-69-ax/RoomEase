import { useProfile } from "@/hooks/api/useProfile";
import { useAuthStore } from "@/utils/storage/useAuthStore";
import { useProfileStore } from "@/utils/storage/useProfileStore";
import { Redirect } from "expo-router";
import { initializeApp } from "firebase/app";

export default function Main() {
  const { userData } = useAuthStore();
  const firebaseConfig = {
    apiKey: "AIzaSyDe8I36yO44-xlF7TXXqG4rxUwNDkvF78o",
    authDomain: "roomease-storage.firebaseapp.com",
    projectId: "roomease-storage",
    storageBucket: "roomease-storage.appspot.com",
    messagingSenderId: "149947514394",
    appId: "1:149947514394:web:9a0b0b966064cd56169ba3",
    measurementId: "G-SQPZ4KWPDG",
  };

  initializeApp(firebaseConfig);
  if (userData.jwtToken) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(auth)" />;
}
