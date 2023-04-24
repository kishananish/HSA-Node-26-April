import htmlToText from 'html-to-text';
import pug from 'pug';
import juice from 'juice';
import AWS from 'aws-sdk';
import config from '../../config/config';

AWS.config.update({
    accessKeyId: config.AWS.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS.AWS_SECRET_KEY,
    region: 'ap-south-1'
});

const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
};

export const send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);
    const tempalteName = `HSA-mailing_${new Date().getTime()}`;
    var params = {
        Template: { 
          TemplateName: tempalteName, 
          HtmlPart: html,
          SubjectPart: options.subject,
          TextPart: text    
        }
      };
    
    new AWS.SES({}).createTemplate(params, (err, data) => {
          console.log({err, data}); 
          if(err) {
              console.log(err);
                return err;
          } 
          const config = {
            Source:'HSA Team <hsa1.hameedservice@gmail.com>',
            Destination: {
                ToAddresses: [
                    options.user.email
                ]
            },
            Template: tempalteName,
            TemplateData:JSON.stringify(html),
            };

        var sendPromise = new AWS.SES({}).sendTemplatedEmail(config).promise();
        sendPromise.then(
            function (data) {
                console.log('Success----------->',data.MessageId);
            }).catch(
                function (err) {
                    console.error('Error--------------->',err, err.stack);
                });  
      });
};
