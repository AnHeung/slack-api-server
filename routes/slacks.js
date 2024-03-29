const router = require('express').Router()
const errorHandle = require('../errorHandle')
const {sendSlackMsg} = require('../slack');

router.post('/send', async (req, res) => {
    try {
        const keywordData = req.body.data;
        const type = req.body.type

        if (keywordData) {
            const result = await sendSlackMsg(type, keywordData)
            return result ? res.status(200).send(errorHandle.successMsg('슬렉 메시지 전송 성공')) : res.status(404).send(errorHandle.errMsg('슬렉 메시지 전송 실패'))
        }
        res.status(200).send(errorHandle.errMsg('슬렉 메시지 전송 실패 키워드를 입력해주세요'))
    } catch (err) {
        console.error(err)
        res.status(404).send(errorHandle.errMsg('슬렉 메시지 전송 실패'))
    }
});

router.get('/', async (req,res)=>{
    return res.status(200).send('test')
})

module.exports = router;

