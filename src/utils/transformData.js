export const transformConferences = (conferences) => {
  return conferences.map((conference) => ({
    id: conference.id, // Use the index as the unique identifier
    title: conference.name || "Untitled Conference", // Use the name or a default value
    start: new Date(conference.startDate.seconds * 1000), // Convert Firestore timestamp to JS Date
    end: new Date(conference.endDate.seconds * 1000), // Convert Firestore timestamp to JS Date
  }));
}


export const transformSessions = (conferences) => {
  const output = [];

  for (const conferenceId in conferences) {
    const sessionsByDay = conferences[conferenceId];
    for (const dayId in sessionsByDay) {
      const sessions = sessionsByDay[dayId];
      for (const session of sessions) {
        // Ensure the session has valid start and end times
        if (session.startTime && session.endTime) {
          const startTime = new Date(session.startTime.seconds * 1000);
          const endTime = new Date(session.endTime.seconds * 1000);

          output.push({
            id: session.id, // Use session ID directly
            title: session.title || "Untitled Session",
            start: startTime,
            end: endTime,
          });
        }
      }
    }
  }

  return output;
};
