require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});

const Axios = require('axios');

const sendSlackMsg = async (type, crawlerData) => {

    let WEBHOOK_URL = process.env.SLAKC_TEST_URL

    if (process.env.NODE_ENV == 'prod') {
        switch (type) {
            case 'hotdeal':
                WEBHOOK_URL = process.env.HOT_DEAL_SLACK_URL
                break;
            case 'manatoki':
                WEBHOOK_URL = MANATOKI_SLACK_URL
                break;
        }
    }

    const result = await Axios.post(WEBHOOK_URL, JSON.stringify(configMessageBody(crawlerData)))
        .catch(err => {
            console.error(err)
        })
    if (result) {
        console.log(`업데이트 완료 :${crawlerData}`)
    }
}

function makeAttachment(crawlerData) {

    return crawlerData.reduce((acc, data) => {

        const { category, title, url, date } = data

        const attchment =  // attachments, here we also use long attachment to use more space
        {
            "color": "#2eb886",
            "title_link": url,
            "fields": [
                {
                    "title": "사이트",
                    "value": category,
                    "short": false,
                },
                {
                    "title": "제목",
                    "value": title,
                    "short": false,
                },
                {
                    "title": "업데이트 날짜",
                    "value": date,
                    "short": false,
                },
            ],
            "actions": [ // Slack supports many kind of different types, we'll use buttons here
                {
                    "type": "button",
                    "text": "보러가기", // text on the button 
                    "style": "danger",
                    "url": url // url the button will take the user if clicked
                }
            ]
        }

        acc.push(attchment)
        return acc;
    }, [])
}

function configMessageBody(crawlerData) {

    const attchment = makeAttachment(crawlerData)
    const title = crawlerData.length > 0 ? crawlerData[0].title : "푸쉬알림"

    return {
        "text": title,
        "attachments": attchment
    }
}

module.exports = {
    sendSlackMsg: sendSlackMsg
}