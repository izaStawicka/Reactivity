using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Following
{
    public class List
    {
        public class Query: IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string TargetName { get; set; }
        }

        public class Handler: IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IAccessUserName _accessUserName;
            public Handler(DataContext context, IMapper mapper, IAccessUserName accessUserName)
            {
                _accessUserName = accessUserName;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch(request.Predicate)
                {
                    case "following":
                        profiles = await _context.AppFollowings.Where(x=> x.Observer.UserName == request.TargetName)
                            .Select(x=> x.Target).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, 
                            new {currentUserName = _accessUserName.GetName()}).ToListAsync();
                            break;
                    
                    case "followers":
                        profiles = await _context.AppFollowings.Where(x=> x.Target.UserName == request.TargetName)
                            .Select(x=> x.Observer).ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,
                            new {currentUserName = _accessUserName.GetName()}).ToListAsync();
                        break;

                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}