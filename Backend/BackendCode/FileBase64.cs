namespace Backend
{
    public class FileBase64
    {
        public FileBase64(string FileName, string FilePath, string Base64)
        {
            fileName = FileName;
            filePath = FilePath;
            base64 = Base64;
        }

        public string fileName { get; set; }
        public string filePath { get; set; }
        public string base64 { get; set; }
    }
}