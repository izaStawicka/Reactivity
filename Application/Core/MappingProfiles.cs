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
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
            .ForMember(x=> x.HostName, o=> o.MapFrom(x=> x.Attendees.FirstOrDefault(x=> x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(x=> x.UserName, o=> o.MapFrom(x=> x.AppUser.UserName))
            .ForMember(x=> x.DisplayName, o=> o.MapFrom(x=> x.AppUser.DisplayName))
            .ForMember(x=> x.Bio, o=> o.MapFrom(x=> x.AppUser.Bio))
            .ForMember(x=> x.Image, o=> o.MapFrom(s=> s.AppUser.Photos.FirstOrDefault(x=> x.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(x=> x.Image, o=> o.MapFrom(s=> s.Photos.FirstOrDefault(x=> x.IsMain).Url));

            CreateMap<Comment, CommentDto>()
            .ForMember(x=> x.UserName, o=> o.MapFrom(x=> x.Author.UserName))
            .ForMember(x=> x.DisplayName, o=> o.MapFrom(x=> x.Author.DisplayName))
            .ForMember(x=> x.Image, o=> o.MapFrom(x=> x.Author.Photos.FirstOrDefault(x=> x.IsMain).Url));
        }
    }
}