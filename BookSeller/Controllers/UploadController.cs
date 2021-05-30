using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BookSeller.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        public UploadController(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        [HttpPost("BookImage")]
        public async Task<IActionResult> Post(IFormFile file)
        {
            if (file == null)
            {
               BadRequest();
            }
            try
            {
                string orgFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                string fileName = (Path.GetFileNameWithoutExtension(orgFileName) + DateTime.Now.ToFileTime() + Path.GetExtension(orgFileName)).Trim('"');
                var fileRelativePath = "/images/books/" + fileName;
                var fileDestination = $"{_hostEnvironment.WebRootPath}{fileRelativePath}";

                Directory.CreateDirectory(Directory.GetParent(fileDestination).FullName);
                // Save the file to the server.
                await using FileStream output = System.IO.File.Create(fileDestination);
                await file.CopyToAsync(output);
                return new JsonResult(new
                {
                    Success = true,
                    Path = fileRelativePath
                });
            }
            catch (Exception e)
            {
                BadRequest();
            }
            return NoContent();
            
        }
    }
}
