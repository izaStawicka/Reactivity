import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { CommentChat } from "../models/commentChat";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore
{
    comments: CommentChat[] | null = null;
    hubConnection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this)
    }

    createHubConnection = async(activityId: string) => {
        if(store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5000/chat?activityId=" + activityId, {
                accessTokenFactory: () => store.userStore.user?.token!
            })
            .withAutomaticReconnect().configureLogging(LogLevel.Information).build();
        }

        this.hubConnection?.start().catch(error=> console.log("Error establishing connection: " + error));

        this.hubConnection?.on("ReceiveComment", (comment: CommentChat)=> {
            runInAction(() => {
                comment.createdAt = new Date(comment.createdAt);
                this.comments?.unshift(comment);})
        })

        this.hubConnection?.on("LoadComments", (comments: CommentChat[]) => {
            runInAction(() =>{
                comments.forEach(comment=> {
                    comment.createdAt = new Date(comment.createdAt + 'Z')
                })
                this.comments = comments
            } )
        })
    }

    stopHubConnection = () =>{
        this.hubConnection?.stop().catch(error=> "Failed to stop connection: " + error)
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    adComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values);
        } catch (error) {
         console.log(error)   
        }
    }
}