namespace server.Models.Dtos;

public class RoleUpdateDto
{
    public int RoleId { get; set; }

    public string RoleType { get; set; }

    public Role ToRole()
    {
        return new Role
        {
            RoleId = RoleId,
            RoleType = RoleType
        };
    }
}
