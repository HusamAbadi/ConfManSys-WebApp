import { getFirestore, doc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

const db = getFirestore();

let el, completed, total, closeButton
let i = 0

function defineElements() {
  el = document.getElementById('modal-progress-bar')
  completed = document.getElementById('completed-papers')
  total = document.getElementById('total-papers')
  closeButton = document.getElementById('modal-close-button')
}



const showProgress = (total) => {
  i += 1
  el.style.width = (i / total) * 100 + "%"
  completed.innerHTML = i
  if (i == total) closeButton.classList.remove('hidden')
}

const validateXmlContent = (xmlDoc, type) => {
  if (type === "papers" && xmlDoc.getElementsByTagName("Paper").length === 0) {
    return false; // No <Paper> tags found for "papers"
  }
  if (type === "authors" && xmlDoc.getElementsByTagName("Author").length === 0) {
    return false; // No <Author> tags found for "authors"
  }
  if (type === "keywords" && xmlDoc.getElementsByTagName("Keyword").length === 0) {
    return false; // No <Keyword> tags found for "keywords"
  }
  return true;
};

export const handleImportSubmit = async (content, type, setShowModal) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');


  // Validate the XML structure
  const isValid = validateXmlContent(xmlDoc, type);
  if (!isValid) {
    alert("Error: Uploaded file content does not match the expected.");
    setShowModal(false)
    return;
  }

  defineElements()
  if (type === 'papers') {
    await processPapers(xmlDoc);
  } else if (type === 'authors') {
    await processAuthors(xmlDoc);
  } else if (type === 'keywords') {
    await processKeywords(xmlDoc);
  }
};

const processPapers = async (xmlDoc) => {
  const papers = xmlDoc.getElementsByTagName('Paper');

  total.innerHTML = papers.length

  for (const paper of papers) {
    const paperData = extractPaperData(paper);

    // Process authors and get their IDs
    const authorIds = [];
    for (const author of paperData.Authors) {
      const authorId = await addAuthorToDatabase(author);
      authorIds.push(authorId);
    }

    // Process keywords and get their IDs
    const keywordIds = [];
    for (const keyword of paperData.Keywords) {
      const keywordId = await addKeywordToDatabase(keyword, null); // Paper ID will be added later
      keywordIds.push(keywordId);
    }

    // Add paper to the database
    const paperId = await addPaperToDatabase({ ...paperData, Authors: authorIds, Keywords: keywordIds });

    // Update keywords with the paper ID
    for (const keyword of paperData.Keywords) {
      await addKeywordToDatabase(keyword, paperId);
    }

    showProgress(papers.length)
  }
};

const addPaperToDatabase = async (paperData) => {
  const docRef = doc(collection(db, 'papers'));
  const timestamp = Timestamp.fromDate(new Date());


  const paperExists = await checkIfExists('papers', 'doi', paperData.DOI);
  if (!paperExists) {
    // Add paper to Firebase
    await addToCollection('papers', {
      title: paperData.Title,
      abstract: paperData.Abstract,
      authors: paperData.Authors, // Array of author document IDs
      keywords: paperData.Keywords, // Array of keyword document IDs
      doi: paperData.DOI,
      isFavorite: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    );
  }


  return docRef.id;
};


const processAuthors = async (xmlDoc) => {
  const authors = xmlDoc.getElementsByTagName('Author');
  total.innerHTML = authors.length

  for (const author of authors) {

    const affiliation = author.querySelector('Affiliation').textContent
    const authorData = {
      FirstName: author.querySelector('FirstName').textContent,
      LastName: author.querySelector('LastName').textContent,
      Email: author.querySelector('Email').textContent,
      Affiliation: affiliation
    };

    await addAuthorToDatabase(authorData);

    showProgress(authors.length)
  }
};

const addAuthorToDatabase = async (authorData) => {
  const { FirstName, LastName, Email, Affiliation } = authorData;
  const name = `${FirstName} ${LastName}`;
  const timestamp = Timestamp.fromDate(new Date());

  // Check if the author already exists
  const q = query(collection(db, 'persons'), where('email', '==', Email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    if (Affiliation) {
      await addOrganizationToDatabase(Affiliation, querySnapshot.docs[0].id);
    }
    return querySnapshot.docs[0].id; // Return existing author ID
  }

  // Add the author
  const docRef = doc(collection(db, 'persons'));
  await setDoc(docRef, {
    name,
    affiliation: Affiliation,
    email: Email,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  if (Affiliation) {
    await addOrganizationToDatabase(Affiliation, docRef.id);
  }
  return docRef.id;
};


const addOrganizationToDatabase = async (organizationName, affiliateId) => {
  const orgRef = collection(db, "organizations");

  const timestamp = Timestamp.fromDate(new Date())

  // Check if the organization already exists
  const orgQuery = query(orgRef, where("name", "==", organizationName));
  const orgSnapshot = await getDocs(orgQuery);

  if (!orgSnapshot.empty) {
    // Organization exists; update affiliates
    const orgDoc = orgSnapshot.docs[0];
    const orgData = orgDoc.data();

    const updatedAffiliates = orgData.affiliates
      ? Array.from(new Set([...orgData.affiliates, affiliateId])) // Avoid duplicates
      : [affiliateId];

    await updateDoc(doc(orgRef, orgDoc.id), {
      affiliates: updatedAffiliates,
      updatedAt: timestamp,
    });
    console.log(`Organization "${organizationName}" updated.`);
  } else {
    // Add a new organization
    await setDoc(doc(orgRef), {
      name: organizationName,
      affiliates: [affiliateId],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    console.log(`Organization "${organizationName}" added.`);
  }
};


const processKeywords = async (xmlDoc) => {
  const keywords = xmlDoc.getElementsByTagName('Keyword');
  total.innerHTML = keywords.length

  for (const keyword of keywords) {
    const keywordText = keyword.textContent;

    await addKeywordToDatabase(keywordText, null); // No paper ID for standalone keywords
    showProgress(keywords.length)
  }
};

const addKeywordToDatabase = async (keyword, paperId) => {
  const timestamp = Timestamp.fromDate(new Date());

  // Check if the keyword already exists
  const q = query(collection(db, 'keywords'), where('name', '==', keyword));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const keywordDoc = querySnapshot.docs[0];
    const keywordId = keywordDoc.id;

    // Add the paper ID to the keyword's papers array (if not already present)
    const papersArray = keywordDoc.data().papers || [];
    if (!papersArray.includes(paperId) && paperId) {
      await updateDoc(keywordDoc.ref, {
        papers: [...papersArray, paperId],
        updatedAt: timestamp,
      });
    }

    return keywordId; // Return existing keyword ID
  }

  // Add the keyword
  const docRef = doc(collection(db, 'keywords'));
  await setDoc(docRef, {
    name: keyword,
    papers: [paperId],
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return docRef.id;
};



const extractPaperData = (paper) => {
  const title = paper.querySelector('Title').textContent;
  const authors = Array.from(paper.querySelectorAll('Author')).map((author) => ({
    FirstName: author.querySelector('FirstName').textContent,
    LastName: author.querySelector('LastName').textContent,
    Affiliation: author.querySelector('Affiliation').textContent,
    Email: author.querySelector('Email').textContent,
  }));
  const abstract = paper.querySelector('Abstract').textContent;
  const keywords = Array.from(paper.querySelectorAll('Keyword')).map((keyword) => keyword.textContent);
  const publicationDate = paper.querySelector('PublicationDate').textContent;
  // const journal = {
  //   Name: paper.querySelector('Journal > Name').textContent,
  //   Volume: paper.querySelector('Journal > Volume').textContent,
  //   Issue: paper.querySelector('Journal > Issue').textContent,
  //   Pages: paper.querySelector('Journal > Pages').textContent,
  // };
  const doi = paper.querySelector('DOI').textContent;

  return {
    Title: title,
    Authors: authors,
    Abstract: abstract,
    Keywords: keywords,
    PublicationDate: publicationDate,
    // Journal: journal,
    DOI: doi,
  };
};

const checkIfExists = async (collectionName, field, value) => {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

const addToCollection = async (collectionName, data) => {
  const docRef = doc(collection(db, collectionName));
  await setDoc(docRef, data);
};
