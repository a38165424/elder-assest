const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmailWithAttachment = functions.https.onCall(
    async (data, context) => {
      const {
        toEmail,
        subject,
        content,
        attachmentFileName,
        attachmentContentBase64,
      } = data;

      console.log("Received email data:", data);

      try {
        const msg = {
          to: toEmail,
          from: "ghostjiachen@gmail.com",
          subject: subject,
          text: content,
          attachments: attachmentFileName ?
                    [
                      {
                        content: attachmentContentBase64,
                        filename: attachmentFileName,
                        type: "application/pdf",
                        disposition: "attachment",
                      },
                    ] :
                    [],
        };

        console.log("Message object being sent:", msg);

        await sgMail.send(msg);
        console.log("Email sent successfully");

        return {success: true};
      } catch (error) {
        console.error("Error sending email:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to send email",
        );
      }
    },
);
