using FlashVoteBackend.Models;
using FlashVoteBackend.Models.Dtos;
using FlashVoteBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlashVoteBackend.Controllers
{
    [ApiController] // Habilita comportamiento de API (validación automática, etc.)
    [Route("api/poll")] // La ruta será: api/poll
    public class PollController : ControllerBase // Usamos ControllerBase para APIs
    {
        private readonly PollService _pollService;

        public PollController(PollService pollService)
        {
            _pollService = pollService;
        }

        // POST: api/poll
        [HttpPost]
        public async Task<ActionResult<Poll>> CreatePoll([FromBody] CreatePollDto request)
        {
            try
            {
                var poll = await _pollService.CreateAsync(request);
                return CreatedAtAction(nameof(GetPoll), new { id = poll.Id }, poll);
            }
            catch (Exception ex)
            {
                // Aquí podrías manejar errores específicos
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/poll
        [HttpGet]
        public async Task<ActionResult<List<ResponsePollDto>>> GetAllPolls()
        {
            List<ResponsePollDto> polls = await _pollService.GetAllAsync();
            return Ok(polls);
        }

        // GET: api/poll/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Poll>> GetPoll(Guid id)
        {
            var poll = await _pollService.GetByIdAsync(id);

            if (poll == null)
            {
                return NotFound();
            }

            return Ok(poll);
        }

        // POST: api/poll/vote/{optionId}
        [HttpPost("{pollId}/vote/{optionId}")]
        public async Task<ActionResult<bool>> Vote(Guid pollId, Guid optionId)
        {
            var success = await _pollService.VoteAsync(pollId, optionId);
            if (!success)
            {
                return NotFound();
            }
            return Ok(success);
        }

        // DELETE: api/poll/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeletePoll(Guid id)
        {
            var success = await _pollService.DeletePollAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return Ok(success);
        }
    }
}