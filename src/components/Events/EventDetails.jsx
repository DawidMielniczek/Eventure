import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';

import Header from '../Header.jsx';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';

export default function EventDetails() {

  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const { data, isPending: isQueryPending, isError } = useQuery({
    queryKey: ['eventsDetails', { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  const {mutate, isPending: isMutatePending, isError: isMutateErorr } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () =>{
      queryClient.invalidateQueries({
        queryKey: ['events']
      });
      navigate('/events');
    }
  });


  function handleDeleteEvent(){
    mutate({id});
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isQueryPending && <p> Loading event details.</p>}
      {!isQueryPending  && !isError && (
        <article id="event-details">
          <header>
            <h1> {data.title} </h1>
            <nav>
              <button onClick={handleDeleteEvent}>{isMutatePending ? 'Deletting...' : 'Delete'}</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt="" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{data.date}  {data.time}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      )}

    </>
  );
}
