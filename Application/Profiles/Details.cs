using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query: IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler: IRequestHandler<Query, Result<Profile> >
        {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAccessUserName _accessUserName;

            public Handler(DataContext context, IMapper mapper, IAccessUserName accessUserName)
            {
            _accessUserName = accessUserName;
            _mapper = mapper;
            _context = context;
            }


            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.ProjectTo<Profile>(_mapper.ConfigurationProvider,
                    new{currentUserName = _accessUserName.GetName()})
                .FirstOrDefaultAsync(x=> x.UserName == request.UserName);

                if(user == null) return null;

                return Result<Profile>.Success(user);
            }
        }
    }
}