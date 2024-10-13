import { doc, getDoc } from 'firebase/firestore';
import { db } from './index.js'; // Firebase ayarlarınızın olduğu dosya

// Kullanıcı verisini Firestore'dan almak için bir fonksiyon
export const fetchUserData = async (userId) => {
    try {
        // Firestore'daki kullanıcının dokümanına referans
        const userDocRef = doc(db, 'SignedUpUsersData', userId);

        // Firestore'dan dokümanı al
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // Belge varsa kullanıcı verisini döndür
            return userDocSnap.data();
        } else {
            console.log("Böyle bir belge bulunamadı!");
            return null; // Belge yoksa null döndür
        }
    } catch (error) {
        console.error("Kullanıcı verisi alınırken hata oluştu: ", error);
        return null; // Hata durumunda null döndür
    }
};
