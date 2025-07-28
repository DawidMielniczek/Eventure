import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();

    export async function fetchEvents({ signal , searchTerm }) {

      let url = 'http://localhost:3000/events';

      if( searchTerm ){
        url += '?search=' + searchTerm;
      }
      const response = await fetch(url, {signal: signal});

      if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
      }

      const { events } = await response.json();
      console.log(events);
      return events;
    }

    export async function createNewEvent(eventData){
      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        body: JSON.stringify({event: eventData}),
        headers:{
          'Content-Type' : 'application/json'
        }
      });

      if(!response.ok){
        const error = new Error('An error occurred while creating the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
    const { event } = await response.json();

    return event;

    }

    export async function fetchEvent({id, signal}){
      const response = fetch(`http://localhost:3000/events/${id}`, {signal});

      if(!response.ok){
        const error = new Error('An error occurred while creating the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const {event} = response.json();
    return event;
  }

    export async function  fetchSelectableImage({ signal }) {
      const response = await fetch('http://localhost:3000/events/images', {signal});

      if(!response.ok){
        const error = new Error('Ann error occurred while teching the images');
        error.code = response.status;
        error.message = await response.json();
        throw error;
      }
      
      const {images} = await response.json();
      return images;
      
    }

