namespace server.Models.Dtos;

public class UserDto
{
    public UserDto()
    {
    }

    public UserDto(User user)
    {
        UserId = user.UserId;
        Username = user.Username;
        UserPicUrl = user.UserPicUrl;
        Email = user.Email;
    }

    public int UserId { get; set; }

    public string? Username { get; set; }

    public string? UserPicUrl { get; set; }
    
    public string? Email { get; set; }


    public User ToUser()
    {
        return new User
        {
            UserId = UserId,
            Username = Username,
            UserPicUrl = UserPicUrl
        };
    }
}
