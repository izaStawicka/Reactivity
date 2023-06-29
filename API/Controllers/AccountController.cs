using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{   
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController: BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService, IConfiguration config)
        {
            _config = config;
            _httpClient = new HttpClient{
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
            _tokenService = tokenService;
            _userManager = userManager;
        }



        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login (LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(x=> x.Photos).FirstOrDefaultAsync(x=> x.Email==loginDto.Email);  

            if(user==null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if(result){
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await _userManager.Users.AnyAsync(x=> x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            if(await _userManager.Users.AnyAsync(x=> x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("userName", "Username taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                UserName = registerDto.UserName,
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetUser()
        {
            var user = await _userManager.Users.Include(x=> x.Photos).FirstOrDefaultAsync(x=> x.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

         private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                UserName = user.UserName,
                Image = user?.Photos?.FirstOrDefault(x=> x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}