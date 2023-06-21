using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query: IRequest<Result<List<ActivityUserDto>>>
        {
            public string UserName { get; set; }
            public string Predicate { get; set; } = "future";
        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityUserDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;

            public Handler(DataContext context, IMapper mapper){
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<ActivityUserDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = _context.ActivityAttendees.Where(x=> x.AppUser.UserName == request.UserName)
                    .ProjectTo<ActivityUserDto>(_mapper.ConfigurationProvider).AsQueryable();

            
                if(request.Predicate == "past")
                {
                    activities = activities.Where(x=> x.Date < DateTime.Now);
                }

                if(request.Predicate == "hosting")
                {
                    activities = activities.Where(x=> x.HostUserName == request.UserName);
                }

                if(request.Predicate == "future")
                {
                    activities = activities.Where(x=> x.Date > DateTime.Now);
                }

                var activitiesToList = await activities.ToListAsync();

                return Result<List<ActivityUserDto>>.Success(activitiesToList);
            }
        }
    }
}