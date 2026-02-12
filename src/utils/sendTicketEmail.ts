import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendTicketEmail = async (
    userEmail: string,
    userName: string,
    ticketPdfBuffer: Buffer
) => {
    try {
        const info = await transporter.sendMail({
            from: '"Northern Paribahan" <' + process.env.GMAIL_USER + '>',
            to: userEmail,
            subject: 'Your Booking Confirmation - Northern Paribahan',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1>Booking Confirmed!</h1>
          <p>Hi ${userName},</p>
          <p>Your seat has been successfully booked. Please find your e-ticket attached to this email.</p>
          <p>Have a safe journey!</p>
          <p><strong>Northern Paribahan Team</strong></p>
        </div>
      `,
            attachments: [
                {
                    filename: 'Ticket-NorthernParibahan.pdf',
                    content: ticketPdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });

        console.log('Ticket sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending ticket:', error);
        return false;
    }
};