using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command: IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {

        private readonly IAccessUserName _accessUserName;
        private readonly IPhotoAccessor _photoAccessor;
        private readonly DataContext _context;

            public Handler(DataContext context, IAccessUserName accessUserName, IPhotoAccessor photoAccessor)
            {
            _context = context;
            _photoAccessor = photoAccessor;
            _accessUserName = accessUserName;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x=> x.Photos).FirstOrDefaultAsync(x=> x.UserName == _accessUserName.GetName());
                if(user ==null) return null;

                var uploadResult = await _photoAccessor.UploadPhoto(request.File);

                var photo = new Photo
                {
                    Id = uploadResult.PublicId,
                    Url = uploadResult.Url
                };

                if(!user.Photos.Any(x=> x.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Adding photo failed");
            }
        }
    }
}