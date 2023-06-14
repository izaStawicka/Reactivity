using Application.Following;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController: BaseApiController
    {
        [HttpPost("{userName}")]
        public async Task<IActionResult> ToggleFollow(string userName)
        {
            return HandleResult(await Mediator.Send(new ToggleFollowing.Command{TargetName = userName}));
        }

        [HttpGet("{userName}")]
        public async Task<IActionResult> GetFollow(string userName, string predicate)
        {
            return HandleResult(await Mediator.Send(new List.Query{TargetName = userName, Predicate = predicate})); 
        }
    }
}