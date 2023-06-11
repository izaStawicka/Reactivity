using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command: IRequest<Result<CommentDto>>
        {
            public Guid ActivityId { get; set; }
            public string Body { get; set; }
        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=> x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IAccessUserName _accessUserName;
            private readonly IMapper _mapper;
            public Handler(IMapper mapper, IAccessUserName accessUserName, DataContext context)
            {
                _mapper = mapper;
                _accessUserName = accessUserName;
                _context = context;
            }
            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FirstOrDefaultAsync(x=> x.Id == request.ActivityId);

                if(activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(x=> x.UserName == _accessUserName.GetName());

                var comment = new Comment
                {
                    Activity = activity,
                    Author = user,
                    Body = request.Body
                };

                activity.Comments.Add(comment);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<CommentDto>.Success(_mapper.Map<CommentDto>(comment)) : 
                Result<CommentDto>.Failure("Failed create comment");
            }
        }
    }
}