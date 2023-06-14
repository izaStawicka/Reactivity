using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query:IRequest<Result<List<ActivityDto>>>{}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
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
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                    new{currentUserName = _accessUserName.GetName()}).ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}