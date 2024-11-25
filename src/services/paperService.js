import { db } from '../firebase/config';

export const addPaper = (paper) => db.collection('papers').add(paper);
export const updatePaper = (id, paper) => db.collection('papers').doc(id).update(paper);
export const deletePaper = (id) => db.collection('papers').doc(id).delete();
