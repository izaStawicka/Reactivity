using API.Extensions;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController:ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result){
            if(result==null) return NotFound();
            if(result.IsSuccess && result.Value!=null)
                return Ok(result.Value);
            
            if(result.IsSuccess && result.Value==null)
                return NotFound();
            
            return BadRequest(result.Error);
        }

         protected ActionResult HandlePagingResult<T>(Result<PagedList<T>> result){
            if(result==null) return NotFound();
            if(result.IsSuccess && result.Value!=null){
                Response.AddPaginationHeader(result.Value.PageNumber, result.Value.TotalPages, result.Value.TotalCount, result.Value.PageSize);
                return Ok(result.Value);
            }
                
            
            if(result.IsSuccess && result.Value==null)
                return NotFound();
            
            return BadRequest(result.Error);
        }
    }
}