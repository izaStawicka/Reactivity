using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Following
{
    public class ToggleFollowing
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string TargetName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IAccessUserName _accessUserName;
            public Handler(DataContext context, IAccessUserName accessUserName)
            {
                _accessUserName = accessUserName;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x=> x.UserName == _accessUserName.GetName());

                var target = await _context.Users.FirstOrDefaultAsync(x=> x.UserName == request.TargetName);

                if(target == null) return null;

                var following = await _context.AppFollowings.FindAsync(observer.Id, target.Id);

                if(following == null)
                {
                    following = new AppFollowings
                    {
                        Observer = observer,
                        Target = target
                    };

                    _context.AppFollowings.Add(following);
                }else{
                    _context.AppFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to toggle following"); 
            }
        }
    }
}