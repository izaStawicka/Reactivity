import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Photo, Profile } from '../models/profile';
import { PaginatedResult } from '../models/pagination';
import { ActivityUserDto } from '../models/activityUserDto';

const sleep = (delay:number)=>{
    return new Promise(resolve=>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL= process.env.REACT_APP_API_URL;

axios.interceptors.response.use(async response=>{
        if(process.env.NODE_ENV === 'development')  await sleep(1000);
        const pagination = response.headers["pagination"];
        if(pagination){
            response.data = new PaginatedResult(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<any>>;
        }
        return response;
}, (error:AxiosError)=>{
    const{data, status, config} = error.response as AxiosResponse;
    switch(status){
        case 404:
            router.navigate('not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                router.navigate('/not-found');
            }
            if(data.errors){
                const modalStateErrors=[];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }else{
                toast.error(data)
            }           
            break;
        case 401:
            toast.error('unauthorised')
            break; 
        case 403:
            toast.error('forbidden')             
    }

    return Promise.reject(error);
}
)

axios.interceptors.request.use(config => {
     const token = store.commonStore.token;
     if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`
     } 
     return config;
})

const responsebody = <T> (response:AxiosResponse<T>) => response.data;


const requests = {
    get: <T> (url:string) => axios.get<T>(url).then(responsebody),
    post: <T> (url: string, body:{}) => axios.post<T>(url, body).then(responsebody),
    put: <T> (url:string, body: {}) => axios.put<T>(url, body).then(responsebody),
    del: <T> (url:string) => axios.delete<T>(url).then(responsebody)
}

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params}).then(responsebody),
    details: (id:string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity:ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity:ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id:string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {})
}

const Profiles = {
    get: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers : {'Content-Type' : 'multipart/form-data'}
        }) 
    },
    setMain: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id:string) => requests.del(`/photos/${id}`),

    editProfile: (profile: Partial<Profile>) => requests.put<void>('/profiles', profile),

    updateFollowing: (userName: string) => requests.post<void>(`/follow/${userName}`, {}),

    getFollowings: (userName: string, predicate: string) => requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`),

    getEvents: (userName: string, predicate: string) => requests.get<ActivityUserDto[]>
    (`/profiles/${userName}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;