/*
 * @Author: ecitlm 
 * @Date: 2017-12-07 19:56:26 
 * @Last Modified by: ecitlm
 * @Last Modified time: 2017-12-09 18:28:06
 */
const express = require('express')
const http = require('http')
const cheerio = require('cheerio')
const app = express()
const request = require('request')
const fs = require('fs')
const Iconv = require('iconv-lite')
const async = require('async')

const jandan = require('../../../utils/jandan_decrypt');

function list(req, res) {
    var res = res
    var req = req
    var page = parseInt(req.params.page)
    var url = `http://jandan.net/ooxx/page-${page}#comments`;
    var headers = {
        'connection': 'keep-alive',
        'Cookie': "__cfduid=d34c02daf3555deb8443c4202ca0ca7d41511794384; gif-click-load=off; _ga=GA1.2.498763940.1511794387; _gid=GA1.2.1281594283.1512647401",
        'accept': 'text/html, application/xhtml+xml, application/xml; q=0.9, image/webp,image/apng, */*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    }
    request({
            url: url,
            encoding: null,
            headers: headers,
            timeout: 5000

        },
        function(error, response, body) {

            var links = []
            if (response) {
                var body = Iconv.decode(body, 'utf-8')
                $ = cheerio.load(body)
                $('.img-hash').each(function(index, item) {
                    links.push("http:" + jandan.getSrc($(this).text()));
                })
                console.log(links)
                console.log('------------------------success----------------------')
                res.send({
                    code: 200,
                    data: links,
                    msg: ''
                })
            } else {
                res.send({
                    code: 404,
                    msg: '网络好像有，点问题'
                })
            }
        }
    )
}
app.get('/:page', function(req, res) {
    if (isNaN(req.params.page)) {
        res.send({
            msg: '请正确填写page参数 int类型',
            code: 2
        })
        return false
    }
    list(req, res)
})
module.exports = app