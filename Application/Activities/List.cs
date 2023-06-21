using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query:IRequest<Result<PagedList<ActivityDto>>>{
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
       
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IAccessUserName _accessUserName;

            public Handler(DataContext context, IMapper mapper, IAccessUserName accessUserName)
            {
                _accessUserName = accessUserName;
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities.Where(x=> x.Date > request.Params.StartDate)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                    new{currentUserName = _accessUserName.GetName()}).OrderBy(x=> x.Date).AsQueryable();

                if(request.Params.IsHosting && !request.Params.IsGoing)
                {
                    query = query.Where(x=> x.HostName == _accessUserName.GetName());
                }

                if(request.Params.IsGoing && !request.Params.IsHosting)
                {
                    query = query.Where(x=> x.Attendees.Any(x=> x.UserName == _accessUserName.GetName()));
                }


                return Result<PagedList<ActivityDto>>.Success(await PagedList<ActivityDto>
                .CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}