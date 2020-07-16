using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatascopeTask.Models;
using DatascopeTask.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DatascopeTask.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GamesListController : ControllerBase
    {
        private GamesListService gamesListService;

        public GamesListController(GamesListService gamesList) => gamesListService = gamesList;

        [HttpGet("game")]
        public IActionResult GetGame([FromBody] GameDetails game)
        {
            var databaseGame = gamesListService.GetGame(game);

            if (databaseGame == null)
                databaseGame = gamesListService.GetGameByName(game.Name);

            if (databaseGame == null)
                return BadRequest("Game not found");

            return Ok(databaseGame);
        }

        [HttpGet]
        public IEnumerable<GameDetails> GetGamesList() => gamesListService.GetGamesList();

        [Authorize]
        [HttpPost]
        public IActionResult UpdateOrAddGame([FromBody] GameDetails game)
        {
            string response;
            if (!gamesListService.ValidateGame(game, out response))
                return BadRequest(response);

            gamesListService.UpdateOrAddGame(game);
            return Ok("Game Updated");
        }

        [Authorize]
        [HttpDelete]
        public IActionResult DeleteGame([FromBody] GameDetails game)
        {
            string response;
            if (!gamesListService.ValidateGame(game, out response))
                return BadRequest(response);

            gamesListService.RemoveGame(game);
            return Ok("Game Deleted");
        }
    }
}