import React, { useState, useEffect } from 'react'
import useFetchData from "../../hooks/useFetchData";
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar'
import { getSessions } from '../../services/allSessionsService';
import { transformSessions, transformConferences } from '../../utils/transformData';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import PropTypes from 'prop-types'
import moment from 'moment'

const localizer = momentLocalizer(moment)

let allViews = Object.keys(Views).map((k) => Views[k])

export default function BackgroundEventsCalendar() {
  const { data: conferences, conferenceLoading, conferenceError } = useFetchData("conferences")
  const transformedConferences = transformConferences(conferences)

  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const data = await getSessions(conferences);

        // Prepare data for transformSessions
        const normalizedData = {};
        data.forEach(({ conferenceId, sessions }) => {
          normalizedData[conferenceId] = sessions; // Group by conference ID
        });
        const transformedSessions = transformSessions(normalizedData);
        setSessionsData(transformedSessions);

      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (conferences && conferences.length > 0) {
      fetchSessions();
    }
  }, [conferences]);

  if (conferenceLoading) return <div>Loading Conferences...</div>;
  if (conferenceError) return <div>Error: {conferenceError.message}</div>;

  if (loading) return <p>Loading sessions...</p>;
  if (error) return <p>Error: {error}</p>;
  if (sessionsData.length === 0) return <p>No sessions found.</p>;


  const handleSelectEvent = (e) => {
    alert(`selected ${e.id}`)
    console.log(e)
  }

  return (
    <div>
      <Calendar
        localizer={localizer}
        backgroundEvents={transformedConferences}
        events={sessionsData}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
      />
    </div>
  )
}
BackgroundEventsCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}