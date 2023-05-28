using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IAccessUserName _accesUserName;

            public Handler(DataContext context, IAccessUserName accesUserName)
            {
                _accesUserName = accesUserName;
                _context = context;              
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.Include(a=> a.Attendees).ThenInclude(a=> a.AppUser)
                .SingleOrDefaultAsync(a=> a.Id == request.Id);

                if(activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(u=> u.UserName == _accesUserName.GetName());

                if(user==null) return null;

                var hostName = activity.Attendees.FirstOrDefault(a=> a.IsHost).AppUser.UserName;

                var attendee = activity.Attendees.FirstOrDefault(a=> a.AppUser.UserName == user.UserName);

                if(attendee != null && hostName == user.UserName){
                    activity.IsCancelled = !activity.IsCancelled;
                }
                if(attendee != null && hostName != user.UserName){
                    activity.Attendees.Remove(attendee);
                }
                if(attendee == null){
                    attendee = new Domain.ActivityAttendee{
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendee);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Updating failed");
            }
        }
    }
}