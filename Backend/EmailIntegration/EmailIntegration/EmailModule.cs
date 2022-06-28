using System;
using MailKit.Net.Smtp;
using MimeKit;


namespace EmailIntegration
{
    class Program
    {
        static void Main(string[] args)
        {
            // create a new mime message object to fill message data
            MimeMessage message = new MimeMessage();

            // add sender info that will appear in email message
            message.From.Add(new MailboxAddress("Daniel", "moir.d2004@gmail.com"));

            // add the receiver email address
            message.To.Add(MailboxAddress.Parse("moir.d2004@gmail.com"));

            // add the message subject
            message.Subject = "Test";

            //add the mesage body as plain text
            // also use HTML
            message.Body = new TextPart("plain")
            {
                Text = "This is a test message"
            };

            Console.WriteLine("Email: ");
            string emailAddress = Console.ReadLine();

            Console.WriteLine("Password: ");

            ConsoleColor orginalBGColor = Console.BackgroundColor;
            ConsoleColor orginalFGColor = Console.ForegroundColor;

            Console.BackgroundColor = ConsoleColor.Green;
            Console.ForegroundColor = ConsoleColor.Green;

            string password = Console.ReadLine();

            Console.BackgroundColor = orginalBGColor;
            Console.ForegroundColor = orginalFGColor;


            SmtpClient client = new SmtpClient();

            try
            {
                client.Connect("smtp.gmail.com", 465, true);
                client.Authenticate(emailAddress, password);
                client.Send(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }

        }
    }
}
