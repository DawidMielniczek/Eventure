import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';

import Header from '../Header.jsx';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {

  const [isDeleting, setIsDeleting] = useState(false);

  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const { data, isPending: isQueryPending, isError } = useQuery({
    queryKey: ['events',  id ],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  const {mutate, isPending: isMutatePending, isError: isMutateErorr, error } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () =>{
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      });
      navigate('/events');
    }
  });

  function handleStartDelete(){
    setIsDeleting(true);
  }
  function handleStopDelete(){
    setIsDeleting(false);
  }


  function handleDeleteEvent(){
    mutate({id});
  }
  return (
    <>
      {isDeleting && (<Modal onClose={handleStopDelete}>
        <h2> Are you sure? </h2>
        <p> Do you really want to delete this event? This action cannot be undone.</p>
        <div className='form-actions'>
          {isMutatePending && <p> Deleting, please wait...</p>}
          {!isMutatePending && ( <>
          <button onClick={handleStopDelete} className='button-text'> Cancel </button>
          <button onClick={handleDeleteEvent} className='button'> Delete </button>
          </>
          )}
        </div>
        {isMutateErorr && <ErrorBlock title="failed to delete event" message={error.info?.message} />}
      </Modal>)}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isQueryPending && <div id="event-details-content" className='center'> <p> Loading event details.</p> </div>}
      {!isQueryPending  && !isError && data && (
        <article id="event-details">
          <header>
            <h1> {data.title} </h1>
            <nav>
              <button onClick={handleStartDelete}>{isMutatePending ? 'Deletting...' : 'Delete'}</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
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
