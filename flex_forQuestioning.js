const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const line = require('@line/bot-sdk')
const axios = require('axios').default
const dotenv = require('dotenv')
const express = require('express')
const env = dotenv.config().parsed
const app = express()

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



const lineConfig = {
    channelAccessToken:env.ACCESSTOKEN_RUNA,
    channelSecret:env.SECRETTOKEN_RUNA
}
const header = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${env.ACCESSTOKEN_RUNA}`
};
const client = new line.Client(lineConfig);
let testFlexMsg = {
  "type": "flex",
  "altText": "Flex Message",
  "contents": {
    "type": "bubble",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "image",
              "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip4.jpg",
              "size": "full",
              "aspectMode": "cover",
              "aspectRatio": "150:196",
              "gravity": "center",
              "flex": 1
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "image",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip5.jpg",
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "150:98",
                  "gravity": "center"
                },
                {
                  "type": "image",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip6.jpg",
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "150:98",
                  "gravity": "center"
                }
              ],
              "flex": 1
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "NEW",
                  "size": "xs",
                  "color": "#ffffff",
                  "align": "center",
                  "gravity": "center"
                }
              ],
              "backgroundColor": "#EC3D44",
              "paddingAll": "2px",
              "paddingStart": "4px",
              "paddingEnd": "4px",
              "flex": 0,
              "position": "absolute",
              "offsetStart": "18px",
              "offsetTop": "18px",
              "cornerRadius": "100px",
              "width": "48px",
              "height": "25px"
            }
          ]
        }
      ],
      "paddingAll": "0px"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "contents": [],
                  "size": "xl",
                  "wrap": true,
                  "text": "Cony Residence",
                  "color": "#ffffff",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": "3 Bedrooms, ¥35,000",
                  "color": "#ffffffcc",
                  "size": "sm"
                }
              ],
              "spacing": "sm"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "contents": [],
                      "size": "sm",
                      "wrap": true,
                      "margin": "lg",
                      "color": "#ffffffde",
                      "text": "Private Pool, Delivery box, Floor heating, Private Cinema"
                    }
                  ]
                }
              ],
              "paddingAll": "13px",
              "backgroundColor": "#ffffff1A",
              "cornerRadius": "2px",
              "margin": "xl"
            }
          ]
        }
      ],
      "paddingAll": "20px",
      "backgroundColor": "#464F69"
    }
  }
};

let openFlexMsg = {
  "type": "flex",
  "altText": "Flex Message",
  "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://t4.ftcdn.net/jpg/04/17/87/83/360_F_417878342_a2J6ZrAT46YvZjUm5W9LPNXZVQYAeqs5.jpg",
      "size": "full",
      "aspectMode": "cover",
      "aspectRatio": "18:13"
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "10px",
      "contents": [
        {
          "type": "button",
          "style": "primary",
          "action": {
            "type": "uri",
            "label": "OPEN ISSUES CASE",
            "uri": "https://linecorp.com"
          },
          "color": "#97BC62",
          "height": "sm"
        },
        {
          "type": "button",
          "style": "primary",
          "height": "sm",
          "color": "#B85042",
          "action": {
            "type": "message",
            "label": "CANCEL",
            "text": "cancel"
          }
        }
      ],
      "flex": 0,
      "position": "relative",
      "backgroundColor": "#201E20"
    }
  }
};



app.post('/webhook', line.middleware(lineConfig), async (req,res) => {
    try {
        const events = req.body.events
        console.log('event =>>>>',events)
        return events.length>0? await events.map(item => handleEvent(item)) : res.status(200).send("OK")

    }catch (error ){
        res.status(500).end()
    }
});


const handleEvent = async(event) =>{
    const  texts = event.message.text;
    const replytoken = event.replyToken;
    if(event.message.type == 'text'){
        if(texts.includes('!@')){
            const arr = texts.split("!@");
            const issuetype = arr[0];
            const summary = arr[1];
            const contexts = arr[2];
            const datass = createData(issuetype,summary,contexts);
            const create = createIssue(datass);
        };
        if(texts.includes('เปิดเคส') || texts.includes('open case') || texts.includes('report a problem') ){
            const flexMessage = flexMsg(replytoken,testFlexMsg);
            console.log('======== test open case route===================')
            console.log(flexMessage);
            console.log('======== test open case route===================')
            console.log(env.ACCESSTOKEN_RUNA);
            console.log('===============accessToken ===============')
            await fetch('https://api.line.me/v2/bot/message/reply',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${env.ACCESSTOKEN_RUNA}`
              },
                body: flexMessage             
            }).then((res) => {
                console.log(res)
            }).catch((error) => {
                try{
                    console.log(JSON.stringify(error))
                } catch(err){
                    console.log(err)
                }
            });
          //   axios.post('https://api.line.me/v2/bot/message/reply', flexMessage, {
          //   headers: {
          //         'Content-Type': 'application/json',
          //         'Authorization': `Bearer ${env.ACCESSTOKEN_RUNA}`
          //     }
          // }).then((res) => {
          //     console.log(res)
          // }).catch((error) => {
          //     try{
          //         console.log(JSON.stringify(error))
          //     } catch(err){
          //         console.log(err)
          //     }
          // });
            return client.replyMessage(event.replyToken,{type:'text',text:'this open case route :)'});
            
        }

    }
    return client.replyMessage(event.replyToken,{type:'text',text:'Thank you :)'});

}


function flexMsg(tokenss,msg){
  return {
    "replyToken" : tokenss,
    "messages":[
        msg
      ],
  }
};