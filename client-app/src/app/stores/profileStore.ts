import { makeAutoObservable, runInAction, reaction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { toast } from "react-toastify";
import { ActivityUserDto } from "../models/activityUserDto";

export default class ProfileStore
{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading =  false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    userActivities: ActivityUserDto[] = [];
    loadingActivities = false;

    constructor(){
        makeAutoObservable(this)

        reaction(
            () => this.activeTab,
            activeTab => {
                if(activeTab === 3 || activeTab === 4){
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.getFollowings(predicate);
                }else{
                    this.followings = [];
                }           
            }
        )
    }

    getEvents = async (userName: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            var activities =  await agent.Profiles.getEvents(userName, predicate!);
            runInAction(() => {
                this.loadingActivities = false;
                this.userActivities = activities;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingActivities = false)
        }
    }

   setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
   }

    get isCurrentUser() {
        if(this.profile && store.userStore.user){
            return this.profile.userName === store.userStore.user.userName
        }
        return false;
    }

    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(userName);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;               
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false)
        }
    }

    uploadPhoto = async(file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if(this.profile){
                    this.profile.photos?.push(photo);

                    if(photo.isMain && store.userStore.user){                  
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url
                }
                }  
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false)
        }
    }

    setMain = async(photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMain(photo.id);
            store.userStore.setImage(photo.url);
            store.activityStore.loadActivities();
            runInAction(() => {
                if(this.profile && this.profile.photos){
                    this.profile.photos.find(x=> x.isMain)!.isMain = false;
                    this.profile.photos.find(x=> x.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url
                }
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false)
        }
    }

    deletePhoto = async(photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if(this.profile && this.profile.photos){
                   this.profile.photos = this.profile.photos.filter(x=> x.id !== photo.id);
                }              
                this.loading = false;
            })
        } catch (error) {
            toast.error('Problem deleting photo');
            runInAction(() => this.loading = false)
        }
    }

    updateProfile = async (profile: Partial<Profile> ) => {
        this.loading = true;
        try {
            await agent.Profiles.editProfile(profile);
            store.activityStore.loadActivities();
            runInAction(() => {
                if(this.profile?.displayName && profile.displayName !== store.userStore.user?.displayName){
                    store.userStore.setDisplayName(profile.displayName!);
                }
                this.profile = {...this.profile, ...profile as Profile}
                this.loading = false;
            })
        } catch (error) {
           console.log(error);
           runInAction(() => this.loading = false)
        } 
    }

    updateFollowing = async(userName: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(userName);
            store.activityStore.updateFollowingAttendees(userName);
            runInAction(() => {
                if(this.profile && this.profile.userName === userName && this.profile.userName !== store.userStore.user?.userName){
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.isFollowing = !this.profile.isFollowing;
                }
                if(this.profile && this.profile.userName === store.userStore.user?.userName){
                    following ? this.profile.followingsCount++ : this.profile.followingsCount--;
                }
                this.followings.forEach(profile => {
                    if(profile.userName === userName){
                        profile.isFollowing ? profile.followersCount-- : profile.followersCount++;
                        profile.isFollowing = !profile.isFollowing;
                    }
                })
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    getFollowings = async(predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.getFollowings(this.profile!.userName, predicate);
            runInAction(()=> {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false)
        }
    }
}