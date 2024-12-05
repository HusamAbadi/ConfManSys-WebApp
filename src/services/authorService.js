import { db } from '../firebase/config';

export const addAuthor = (author) => db.collection('persons').add(author);
export const updateAuthor = (id, author) => db.collection('persons').doc(id).update(author);
export const deleteAuthor = (id) => db.collection('persons').doc(id).delete();
