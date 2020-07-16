using DatascopeTask.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DatascopeTask.Services
{
    public class UserService
    {
        private DatabaseContext database;
        private string JwtSecret;
        private string JwtIssuer;

        public UserService(DatabaseContext database, IConfiguration configuration)
        {
            this.database = database;
            JwtSecret = configuration["Jwt:Secret"];
            JwtIssuer = configuration["Jwt:Issuer"];
        }

        /// <summary>
        /// Generates a JWT for user
        /// </summary>
        /// <param name="user">User model to generate the JWT for</param>
        /// <returns></returns>
        public string GenerateJWT(UserDetails user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>();

            claims.Add(new Claim("name", user.Username));

            var token = new JwtSecurityToken(JwtIssuer,
                      JwtIssuer,
                      claims,
                      expires: DateTime.Now.AddDays(1),
                      signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Validates login
        /// </summary>
        /// <param name="user">User to validate</param>
        /// <returns>True if login was successfull</returns>
        public bool ValidateLogin(LoginDetails user)
        {
            //Get our database user
            var dbUser = GetUser(user.Username);

            //invalidate login if username cant be found.
            if (dbUser == null) return false;

            //returns true if the password is validated
            return ValidatePassword(user.Password, dbUser);
        }

        /// <summary>
        /// Creates a new user
        /// </summary>
        /// <param name="user">User to creat</param>
        /// <returns>Will return false if the user already exists</returns>
        public bool CreateNewUser(LoginDetails user)
        {
            //if the user exists return false
            if (GetUser(user.Username) != null) return false;

            var newUser = new UserDetails() { Username = user.Username };

            //Generate salt and password hash for the user based on input passsword and save to database
            newUser.PasswordSalt = GenerateSalt();
            newUser.PasswordHash = Hash(user.Password, newUser.PasswordSalt);
            database.UsersList.Add(newUser);
            database.SaveChanges();
            return true;
        }

        /// <summary>
        /// Gets a user based on username
        /// </summary>
        /// <param name="Username">Username to search for</param>
        /// <returns></returns>
        public UserDetails GetUser(string Username) => database.UsersList.FirstOrDefault(u => u.Username == Username);

        /// <summary>
        /// Validates a password by comparing it with the password the user entered and their hash&salt
        /// </summary>
        /// <param name="password">Password entered by the user</param>
        /// <param name="user">User details from the database</param>
        /// <returns></returns>
        private bool ValidatePassword(string password, UserDetails user)
        {
            byte[] newPasswordHash = Hash(password, user.PasswordSalt);
            return user.PasswordHash.SequenceEqual(newPasswordHash);
        }

        /// <summary>
        /// Creates a hash from an entered password
        /// </summary>
        /// <param name="password">Password to hash</param>
        /// <param name="salt">salt to use to hash</param>
        /// <returns></returns>
        private byte[] Hash(string password, byte[] salt)
            => Hash(Encoding.UTF8.GetBytes(password), salt);

        /// <summary>
        /// Creates a hash from an entered password
        /// </summary>
        /// <param name="password">Password to hash</param>
        /// <param name="salt">salt to use to hash</param>
        /// <returns></returns>
        private byte[] Hash(byte[] password, byte[] salt)
            => new SHA256Managed().ComputeHash(password.Concat(salt).ToArray());

        /// <summary>
        /// Generates a random salt
        /// </summary>
        /// <param name="maximumSaltLength">max length of the salt, default is 32</param>
        /// <returns></returns>
        private byte[] GenerateSalt(int maximumSaltLength = 32)
        {
            var salt = new byte[maximumSaltLength];
            using (var random = new RNGCryptoServiceProvider())
            {
                random.GetNonZeroBytes(salt);
            }

            return salt;
        }
    }
}