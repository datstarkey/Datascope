using DatascopeTask.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;

namespace DatascopeTask.Services
{
    /// <summary>
    /// Service to handle Database interactions for the GamesList
    /// </summary>
    public class GamesListService
    {
        private DatabaseContext database;

        public GamesListService(DatabaseContext database) => this.database = database;

        /// <summary>
        /// Returns a list of all games in the database
        /// </summary>
        /// <returns></returns>
        public IEnumerable<GameDetails> GetGamesList()
            => database.GamesList.ToList();

        /// <summary>
        /// Returns a game by its Name
        /// </summary>
        /// <param name="game">Game name to search for</param>
        /// <returns></returns>
        public GameDetails GetGameByName(string name)
            => database.GamesList.Where(x => x.Name == name).FirstOrDefault();

        /// <summary>
        /// Returns a game by its Id
        /// </summary>
        /// <param name="id">Game Id to search for</param>
        /// <returns></returns>
        public GameDetails GetGameById(int id)
            => database.GamesList.Find(id);

        /// <summary>
        /// Returns a game by searching for it in the dabase.
        /// </summary>
        /// <param name="game">Game model provided</param>
        public GameDetails GetGame(GameDetails game)
            => database.GamesList.Find(game.Id);

        /// <summary>
        /// Updates a game by the given model
        /// If the game cant be found in the database it adds it.
        /// </summary>
        /// <param name="game">Game model provided</param>
        public void UpdateOrAddGame(GameDetails game)
        {
            //Check for duplicate game
            if (game.Id <= 0)
            {
                var duplicateGame = GetGameByName(game.Name);

                //if the game is found, set the updated details to found games ID and detach so it can be updated in the database
                if (duplicateGame != null)
                {
                    game.Id = duplicateGame.Id;
                    database.Entry(duplicateGame).State = EntityState.Detached;
                };
            }

            database.GamesList.Update(game);
            database.SaveChanges();
        }

        /// <summary>
        /// Removes a game from the database if found
        /// </summary>
        /// <param name="game"></param>
        public void RemoveGame(GameDetails game)
        {
            database.GamesList.Remove(game);
            database.SaveChanges();
        }

        /// <summary>
        /// Validates a game
        /// </summary>
        /// <param name="game">Game to validate</param>
        /// <param name="response">output string result of validation </param>
        /// <returns>True if game is valid, false if not</returns>
        public bool ValidateGame(GameDetails game, out string response)
        {
            if (game.Id < 0)
            {
                response = "Game id is not valid";
                return false;
            }

            if (String.IsNullOrEmpty(game.Name))
            {
                response = "Game name is not valid";
                return false;
            }

            if (String.IsNullOrEmpty(game.Description))
            {
                response = "Game description is not valid";
                return false;
            }

            if (game.Rating < 0 || game.Rating > 11)
            {
                response = "Game rating can only be between 1-10";
                return false;
            }

            response = "Valid";
            return true;
        }
    }
}