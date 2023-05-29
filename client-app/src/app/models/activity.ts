import { Profile } from "./profile";


export interface Activity {
    id: string,
    title: string,
    date: Date | null,
    description: string,
    category: string,
    city: string,
    venue: string,
    isCancelled?: boolean,
    hostName: string,
    attendees: Profile[],
    isHost: boolean,
    isGoing: boolean,
    host?: Profile
  }

  export class ActivityFormValues
  {
    id?: string = undefined;
    title: string = '';
    date: Date | null = null;
    description: string = '';
    category: string = '';
    city: string = '';
    venue: string = '';

    constructor(init?: ActivityFormValues)
    {
      if(init){
        this.id = init.id;
        this.title = init.title;
        this.date = init.date;
        this.description = init.description;
        this.category = init.category;
        this.city = init.city;
        this.venue = init.venue;
      }
     
    }
  }

  export class Activity implements Activity
  {
    constructor(init: ActivityFormValues){
      Object.assign(this, init);
    }
  }