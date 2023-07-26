import { parseISO, format } from 'date-fns';

export  default  function DDate({ dateString }) {
  console.log(dateString)
  try {
    if (dateString != undefined) {
      const date = parseISO(dateString);
      return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy - HH:mm a')}</time>;
    }
    else 
    {
      console.log("TRIGGER")
      const dateString2 = new Date()
      const date = parseISO(dateString2 );
      return <time dateTime={dateString2}>{format(date, 'LLLL d, yyyy - HH:mm a')}</time>;
    }
  }
  catch (error) {
    console.log(error.message)
  } 
}