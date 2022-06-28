using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using Newtonsoft.Json;

namespace Backend
{
    public class FileManager
    {
        List<FilePath> folderStructure;

        public FileManager()
        {
            folderStructure = new List<FilePath>();
        }

        public List<FilePath> GetCurrentDirectory()
        {
            string currentDirectory = null;
            string relativePath = null;
            try
            {
                // Get the current directory.
                currentDirectory = Directory.GetCurrentDirectory();
                string target = @"..\Remote Access";
                string fullPath = Path.GetFullPath(target);
                relativePath = Path.GetRelativePath(currentDirectory, fullPath);

                if (!Directory.Exists(target))
                {
                    Directory.CreateDirectory(target);
                }
                

            }
            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
            }

            DirectoryInfo dir = new DirectoryInfo(".");
            string dirName = dir.Name;
            Console.WriteLine(dirName);

            folderStructure.Add(CreateFilePathObject(relativePath));

            return folderStructure;

        }

        public dynamic ChangeDirectory(dynamic data)
        {
            string path = data.filePath;
            string currentDirectory = Directory.GetCurrentDirectory();

            DirectoryInfo dir = new DirectoryInfo(path);
            string dirName = dir.FullName;
            Console.WriteLine(dirName);
            string newPath = Path.GetFullPath(Path.Combine(dirName, @"..\..\"));

            string relativePath = CreateRelativePath(newPath, currentDirectory);

            dynamic tempDynamic = new System.Dynamic.ExpandoObject();
            tempDynamic.filePath = relativePath;
            return OpenFolder(tempDynamic);

        }


        public dynamic createDynamicObject(string title, string message, string iconType, string currentDirectory) 
        {
            dynamic tempDynamic = new System.Dynamic.ExpandoObject();
            tempDynamic.popupTitle = title;
            tempDynamic.popupMessage = message;
            tempDynamic.icon = iconType;
            tempDynamic.currentDirectory = currentDirectory;

            return tempDynamic;
        }



        public string SaveFile(dynamic data)
        {
            string base64 = data.base64;
            string fileName = data.fileName;
            string path = data.currentDirectory;

            byte[] bytes = Convert.FromBase64String(base64);

            DirectoryInfo dir = new DirectoryInfo(path);
            string dirName = dir.FullName;
            Console.WriteLine(dirName);
            string newPath = Path.GetFullPath(Path.Combine(dirName, @"..\"));

            try
            {
                File.WriteAllBytes(newPath + @"\" + fileName, bytes);
                dynamic obj = createDynamicObject("File Uploaded", $"{fileName} has been uploaded", "success", Path.GetFullPath(Path.Combine(dirName, @"..\")));
                return JsonConvert.SerializeObject(obj);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                dynamic obj = createDynamicObject("Error has occured", ex.Message, "error", path);
                return JsonConvert.SerializeObject(obj);
            }
        }

        public List<FilePath> OpenFolder(dynamic data)
        {
            string currentDirectory = Directory.GetCurrentDirectory();
            string filePath = data.filePath;
            string[] filePaths = Directory.GetFiles(filePath);
            string[] subdirectoryEntries = Directory.GetDirectories(filePath);

            foreach (var folder in subdirectoryEntries)
            {
                string relativePath = CreateRelativePath(folder, currentDirectory);
                folderStructure.Add(CreateFilePathObject(relativePath));

            }

            foreach (var path in filePaths)
            {
                string relativePath = CreateRelativePath(path, currentDirectory);
                folderStructure.Add(CreateFilePathObject(relativePath));

            }


            return folderStructure;
        }

        public string CreateRelativePath(string folder, string currentDirectory) 
        {
            string fullPath = Path.GetFullPath(folder);
            string relativePath = Path.GetRelativePath(currentDirectory, fullPath);
            return relativePath;
        }

        public FilePath CreateFilePathObject(string relativePath)
        {
            Icon folderIcon = IconManager.GetDirectoryIcon(relativePath, true);
            byte[] bytes = IconManager.IconToBytes(folderIcon);

            // Convert byte[] to Base64 String
            string base64String = Convert.ToBase64String(bytes);

            FilePath fp = new FilePath
            {
                fileName = Path.GetFileName(relativePath),
                filePath = relativePath,
                fileIconBase64 = base64String,
                fileBase64 = null
            };

            if (relativePath.Contains("txt"))
            {
                fp.fileBase64 = GetFile(relativePath);
            }

            return fp;
        }


        public string GetFile(string relativePath) {
            string filePath = relativePath;
            DirectoryInfo drInfo = new DirectoryInfo(filePath);
            string fileName = drInfo.Name;

            using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                // Create a byte array of file stream length
                byte[] bytes = File.ReadAllBytes(filePath);

                string base64 = Convert.ToBase64String(bytes);

                return base64; 
            }
        }



    }
}
