using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler: IRequestHandler<Command, Result<Unit>>
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
                var user = await _context.Users.Include(x=> x.Photos).FirstOrDefaultAsync(x=> x.UserName == _accessUserName.GetName());
                if(user==null) return null;

                var photo = user.Photos.FirstOrDefault(x=> x.Id == request.Id);
                if(photo==null) return null;

                var currentMain = user.Photos.FirstOrDefault(x=> x.IsMain);
                if(currentMain != null) currentMain.IsMain = false;

                photo.IsMain = true;

                var result = await _context.SaveChangesAsync() > 0;
                if(result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failure to change main photo");
            }
        }
    }
}