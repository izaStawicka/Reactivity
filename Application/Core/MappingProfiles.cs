using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles:Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
            .ForMember(x=> x.HostName, o=> o.MapFrom(x=> x.Attendees.FirstOrDefault(x=> x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(x=> x.UserName, o=> o.MapFrom(x=> x.AppUser.UserName))
            .ForMember(x=> x.DisplayName, o=> o.MapFrom(x=> x.AppUser.DisplayName))
            .ForMember(x=> x.Bio, o=> o.MapFrom(x=> x.AppUser.Bio))
            .ForMember(x=> x.Image, o=> o.MapFrom(s=> s.AppUser.Photos.FirstOrDefault(x=> x.IsMain).Url))
            .ForMember(x=> x.IsFollowing, o=> o.MapFrom(s=> s.AppUser.Followers.Any(x=> x.Observer.UserName == currentUserName)))
            .ForMember(x=> x.FollowersCount, o=> o.MapFrom(s=> s.AppUser.Followers.Count))
            .ForMember(x=> x.FollowingCount, o=> o.MapFrom(s=> s.AppUser.Followings.Count));
            
            CreateMap<ActivityAttendee, Profiles.ActivityUserDto>()
            .ForMember(x=> x.Id, o=> o.MapFrom(x=> x.ActivityId))
            .ForMember(x=> x.Title, o=> o.MapFrom(x=> x.Activity.Title))
            .ForMember(x=> x.Category, o=> o.MapFrom(x=> x.Activity.Category))
            .ForMember(x=> x.Date, o=> o.MapFrom(x=> x.Activity.Date))
            .ForMember(x=> x.HostUserName, o=> o.MapFrom(x=> x.Activity.Attendees.FirstOrDefault(x=> x.IsHost).AppUser.UserName));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(x=> x.Image, o=> o.MapFrom(s=> s.Photos.FirstOrDefault(x=> x.IsMain).Url))
            .ForMember(x=> x.FollowersCount, o=> o.MapFrom(s=> s.Followers.Count))
            .ForMember(x=> x.FollowingsCount, o => o.MapFrom(s=> s.Followings.Count))
            .ForMember(x=> x.IsFollowing, o=> o.MapFrom(s=> s.Followers.Any(x=> x.Observer.UserName == currentUserName)));

            CreateMap<Comment, CommentDto>()
            .ForMember(x=> x.UserName, o=> o.MapFrom(x=> x.Author.UserName))
            .ForMember(x=> x.DisplayName, o=> o.MapFrom(x=> x.Author.DisplayName))
            .ForMember(x=> x.Image, o=> o.MapFrom(x=> x.Author.Photos.FirstOrDefault(x=> x.IsMain).Url));
        }
    }
}