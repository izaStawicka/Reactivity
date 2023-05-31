using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly IPhotoAccessor _photoAccessor;
        private readonly DataContext _context;
        private readonly IAccessUserName _accessUserName;
            public Handler(DataContext context, IAccessUserName accessUserName, IPhotoAccessor photoAccessor)
            {
            _accessUserName = accessUserName;
            _context = context;
            _photoAccessor = photoAccessor;
                
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x=> x.Photos).FirstOrDefaultAsync(x=> x.UserName == _accessUserName.GetName());

                if(user == null) return null;

                var photo = user.Photos.FirstOrDefault(x=> x.Id == request.Id);

                if(photo==null) return null;

                if(photo.IsMain) return Result<Unit>.Failure("You cannot remove the Main Photo");

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if(result == null) return Result<Unit>.Failure("Failure delete photo from Cloudinary");

                
                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failure delete photo from database");
            }
        }
    }
}