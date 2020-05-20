using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.neoney.xyz.Controllers
{
    [ApiController]
    [Route("/upload")]
    public class FilesController : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> Post(IFormFile x)
        {
            using var srs = new StreamReader(x.OpenReadStream());
            Console.WriteLine(x.FileName);
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "images", x.FileName);

            await using var fs = new FileStream(filepath, FileMode.Create);
            srs.BaseStream.Seek(0, SeekOrigin.Begin);
            await srs.BaseStream.CopyToAsync(fs);
            fs.Close();

            return Ok((Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development"
                ? "http://localhost:5000/"
                : "https://drive.neoney.xyz/") + x.FileName);
        }
    }
}