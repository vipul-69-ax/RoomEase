import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export default async function uploadFile(
  fileName: string,
  fileUri: string,
  location: string,
) {
  const file = await fetch(fileUri);
  const fileBlob = await file.blob();
  const storage = getStorage();
  const storageRef = ref(storage, `${location}/${fileName}`);
  const fileRef = await uploadBytes(storageRef, fileBlob);
  const downloadUrl = await getDownloadURL(fileRef.ref);
  return downloadUrl;
}
