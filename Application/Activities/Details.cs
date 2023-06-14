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
    public class Details
    {
        public class Query:IRequest<Result<ActivityDto>>
        {
          public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
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
            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                  new{currentUserName = _accessUserName.GetName()})
                .FirstOrDefaultAsync(x=> x.Id == request.Id);

                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}