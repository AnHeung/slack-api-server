require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});

const Axios = require('axios');

const sendSlackMsg = async (type, crawlerData) => {

    let WEBHOOK_URL = process.env.NODE_ENV === 'prod' ? makeSlackUrl(type) : process.env.SLACK_TEST_URL
    let messageBody = configMessageBody(type, crawlerData) || {}

    return await Axios.post(WEBHOOK_URL, JSON.stringify(messageBody))
        .catch(err => {
            console.error(`slackSend Message 오류 : ${err}`)
            return false
        })
}

function makeSlackUrl(type) {
    let WEBHOOK_URL = SLACK_TEST_URL
    switch (type) {
        case 'hotdeal':
            WEBHOOK_URL = process.env.HOT_DEAL_SLACK_URL
            break;
        case 'manatoki':
            WEBHOOK_URL = process.env.MANATOKI_SLACK_URL
            break;
        case 'torrent_update':
            WEBHOOK_URL = process.env.TORRENT_CRWALING_URL
            break;
    }
    return WEBHOOK_URL
}

function makeAttachment(type, data) {
    let attachment = [];
    switch (type) {
        case 'hotdeal':
            attachment = makeHotDealAttachment(data)
            break;
        case 'manatoki':
            attachment = makeMangaAttachment(data)
            break;
        case 'torrent_update':
            attachment = makeTorrentUpdateAttachment(data)
            break;
    }
    return attachment;
}

function makeHotDealAttachment(crawlerData) {

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

function makeTorrentUpdateAttachment(crawlerData) {

    return crawlerData.reduce((acc, data) => {

        const { category, title, size , submitter, torrentLink, date } = data

        const attchment =  // attachments, here we also use long attachment to use more space
        {
            "color": "#2eb886",
            "fields": [
                { "title": "사이트", "value": category , "short": false },
                { "title": "제목", "value": title , "short": false },
                { "title": "업데이트 날짜", "value": date, "short": false },
                { "title": "자막자", "value": submitter, "short": false },
                { "title": "파일 사이즈", "value": size, "short": false },
            ],
            "actions": [ // Slack supports many kind of different types, we'll use buttons here
                {
                    "type": "button",
                    "text": "다운로드 링크", // text on the button 
                    "style": "danger",
                    "url": torrentLink // url the button will take the user if clicked
                }
            ]
        }

        acc.push(attchment)
        return acc;
    }, [])
}

function configMessageBody(type, crawlerData) {

    const attchment = makeAttachment(type, crawlerData)
    const title = crawlerData.length > 0 ? crawlerData[0].title : "푸쉬알림"

    return {
        "text": title,
        "attachments": attchment
    }
}

function makeMangaAttachment(mangaData) {

    return mangaData.reduce((acc, data) => {

        const { title, link, date, thumbnail, comicLink } = data

        const attchment =  // attachments, here we also use long attachment to use more space
        {
            "color": "#2eb886",
            "title_link": link,
            "fields": [
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
            "thumb_url": thumbnail,
            "actions": [ // Slack supports many kind of different types, we'll use buttons here
                {
                    "type": "button",
                    "text": "보러가기", // text on the button 
                    "url": link // url the button will take the user if clicked
                },
                {
                    "type": "button",
                    "text": "전편보기", // text on the button 
                    "style": "danger",
                    "url": comicLink // url the button will take the user if clicked
                },
                {
                    "type": "button",
                    "text": "다운로드", // text on the button 
                    "style": "primary",
                    "url": link // url the button will take the user if clicked
                },
            ]
        }

        acc.push(attchment)
        return acc;
    }, [])
}


module.exports = {
    sendSlackMsg: sendSlackMsg
}