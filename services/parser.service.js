const puppeteer = require('puppeteer-extra');
const { executablePath } = require("puppeteer");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const useProxy = require('puppeteer-page-proxy');
const axios = require('axios');
const User_info = require('../models/user_info.model')

class parserService{

    async callback(first_name, second_name, email, street, apartment_number, city, phone_number, post_code){

        const pathToExtension = require('path').join(__dirname,'../', '2captcha-solver');
        console.log(pathToExtension)
        puppeteer.use(StealthPlugin())

        const proxies = await axios.get(`https://stableproxy.com/ajax/eapi/proxies/download/aead519d5d9ac6cd82d115e081d183f3/json/http/action`)
        const randomProxy = Math.floor(Math.random() * proxies.data.length);

        const browser = await puppeteer.launch({
            slowMo: 100,
            devtools: true,
            executablePath: executablePath(),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                `--proxy-server=${proxies.data[randomProxy].ip}:${proxies.data[randomProxy].port}`,
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`
            ],
            headless: false//'new'
        })//init browser
        const page = await browser.newPage()
        await page.setViewport({width: 1400, height: 900})

        await page.authenticate({
            username:proxies.data[randomProxy].username,
            password:proxies.data[randomProxy].password
        });
        let Link = "https://www.amway.pl/login/aboregister1"
        await page.goto(Link, {waitUntil: 'domcontentloaded'})
        let page_url = '', answer2Captcha

        let attempts = 0
        try {

            await fill1()
            await fill2()
            await fill3()
            await fill4()

            async function fill1() {

                try {
                    console.log("PAGE 1 FILL DATA")

                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})

                    await page.waitForSelector('[class*=\'cookies\'] [class*=\'acceptAll\']').then(async () => {
                        await page.click('[class*=\'cookies\'] [class*=\'acceptAll\']')
                    })

                    await page.$eval('[name="registerFormList[0].firstName"]', (element, first_name) => {
                        element.value = first_name
                    }, first_name)
                    await page.click('[name="registerFormList[0].firstName"]')

                    await page.$eval('[name="registerFormList[0].lastName"]', (element, second_name) => {
                        element.value = second_name
                    }, second_name)
                    await page.click('[name="registerFormList[0].lastName"]')

                    await page.$eval('[name="registerFormList[0].email"]', (element, email) => {
                        element.value = email
                    }, email)
                    await page.click('[name="registerFormList[0].email"]')

                    await page.$eval('[name="confirmationEmail"]', (element, email) => {
                        element.value = email
                    }, email)
                    await page.click('[name="confirmationEmail"]')

                    const day = Math.floor(Math.random() * 20) + 10;
                    await page.$eval('[placeholder="Dzień"]', (element, day) => {
                        element.value = day
                    }, day)
                    await page.click('[placeholder="Dzień"]')

                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const year = Math.floor(Math.random() * 30) + currentYear - 50;
                    await page.$eval('[placeholder="Rok"]', (element, year) => {
                        element.value = year
                    }, year)

                    await page.click('[class*=\'dateMonth\']')
                    await page.click(`[class*='dateMonth'] > :nth-child(2)  > :nth-child(${Math.floor(Math.random() * 11) + 1})`)
                    await page.click('.radio-input')
                }catch (e) {
                }

                for(let i = 0; i < 5; i++) {
                    page_url = page.url().toString()
                    if(page_url[page_url.length - 1] !== '1') {
                        break
                    }
                    await page.waitForTimeout(10000)
                    await page.click('[type="submit"]')
                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})
                }
                page_url = page.url().toString()
                if(page_url[page_url.length - 1] === '1' && attempts/5 < 1) {
                    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                    await fill1()
                }
            }

            async function fill2() {
                try {
                    // PAGE 2 FILL DATA
                    console.log("PAGE 2 FILL DATA")

                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})

                    const address = street + ' ' + apartment_number
                    await page.waitForSelector('[name*=\'addressLine\']')
                    await page.$eval('[name*=\'addressLine\']', (element, address) => {
                        element.value = address
                    }, address)
                    await page.click('[name*=\'addressLine\']')

                    await page.$eval('[name="citySelector"]', (element, city) => {
                        element.value = city
                    }, city)
                    await page.click('[name="citySelector"]')

                    await page.$eval('[name="postcodeInput"]', (element, post_code) => {
                        element.value = post_code
                    }, post_code)
                    await page.click('[name="postcodeInput"]')

                }catch (e){
                }

                for(let i = 0; i < 5; i++) {
                    page_url = page.url().toString()
                    if(page_url[page_url.length - 1] !== '2') {
                        break
                    }
                    await page.waitForTimeout(10000)
                    await page.click('[type="submit"]')
                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})
                }

                try {
                    await page.waitForSelector('[class="btn amw-button"]')
                    let value = await page.evaluate(async () => {
                        let container = await document.querySelectorAll('[class="btn amw-button"]')
                        for (let item of container) {
                            const val = item.innerText
                            if (val === ' Zapisz i kontynuuj' || val === 'Zapisz i kontynuuj') {
                                await item.click()
                                break;
                            }
                        }
                    })
                }catch (e) {
                }

                page_url = page.url().toString()
                if(page_url[page_url.length - 1] === '2' && attempts/5 < 2) {
                    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                    await fill2()
                }

            }

            async function fill3() {
                try{
                    console.log("PAGE 3 FILL DATA")

                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})

                    await page.waitForSelector('[name="phone"]')
                    await page.$eval('[name="phone"]', (element, phone_number) => {
                        element.value = phone_number
                    }, phone_number)
                }catch (e) {
                }

                for(let i = 0; i < 5; i++) {
                    page_url = page.url().toString()
                    if(page_url[page_url.length - 1] !== '3') {
                        break
                    }
                    await page.waitForTimeout(10000)
                    await page.click('[class="btn-amway__spinner"]')
                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})
                }
                page_url = page.url().toString()
                if(page_url[page_url.length - 1] === '3') {
                    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                    await fill1()
                }

            }

            async function fill4() {
                try {
                    // PAGE 4 FILL DATA
                    console.log("PAGE 4 FILL DATA")

                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})

                    await page.waitForSelector('[placeholder="Wpisz numer PA"]')
                    await page.$eval('[placeholder="Wpisz numer PA"]', (element) => {
                        element.value = '7018899231'

                    })
                }catch (e) {
                }

                for(let i = 0; i < 5; i++) {
                    page_url = page.url().toString()
                    if(page_url[page_url.length - 1] !== '4') {
                        break
                    }
                    await page.waitForTimeout(10000)
                    await page.click('[type="submit"]')
                    answer2Captcha = await solve2Captcha()
                    console.log({Captcha: answer2Captcha})
                }
                page_url = page.url().toString()
                if(page_url[page_url.length - 1] === '4' && attempts/5 < 1) {
                    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                    await fill1()
                }

            }
            console.log("PAGE 5 FILL DATA")
            for(let i = 0; i < 5; i++) {
                page_url = page.url().toString()
                if(page_url[page_url.length - 1] === '5') {
                    try{
                        let candidat = await User_info.findOne({
                            first_name,
                            second_name,
                            email,
                            street,
                            apartment_number,
                            city,
                            phone_number,
                            post_code
                        })
                        if(candidat === null){
                            const user_info = await User_info.create({
                                first_name,
                                second_name,
                                email,
                                street,
                                apartment_number,
                                city,
                                phone_number,
                                post_code,
                                registered: true
                            })
                        }else{
                            candidat.registered = true
                            await candidat.save()
                            console.log("END")
                            return true
                            await browser.close()
                        }
                    }catch (e) {
                    }
                }
                await page.waitForTimeout(10000)
                await page.click('[type="submit"]')
                answer2Captcha = await solve2Captcha()
                console.log({Captcha: answer2Captcha})
            }

            const user_info = await User_info.create({
                first_name,
                second_name,
                email,
                street,
                apartment_number,
                city,
                phone_number,
                post_code,
                registered: false
            })
            return false


            async function solve2Captcha(){

                try{
                    // Waiting for the element with the CSS selector ".captcha-solver" to be available
                    await page.waitForSelector('.captcha-solver')
                    // Click on the element with the specified selector
                    await page.click('.captcha-solver')
                    // By default, waitForSelector waits for 30 seconds, but this time is usually not enough, so we specify the timeout value manually with the second parameter. The timeout value is specified in "ms".
                    await page.waitForSelector(`.captcha-solver[data-state="solved"]`, {timeout: 180000})
                    return '+1'
                }catch (e) {
                    return '0'
                }

            }

        }catch (e) {
            console.log(e)
            const candidat = await User_info.findOne({
                first_name,
                second_name,
                email,
                street,
                apartment_number,
                city,
                phone_number,
                post_code
            })
            if(candidat === null){
                const user_info = await User_info.create({
                    first_name,
                    second_name,
                    email,
                    street,
                    apartment_number,
                    city,
                    phone_number,
                    post_code,
                    registered: false
                })
            }
            await browser.close()
            return false
        }

    }

    async reRegister(){
        try{
            const user_info = await User_info.find()
            for(let i = 0; i < Math.min(user_info.length, 3); i++){

                const res = await this.callback(
                    user_info[i].first_name,
                    user_info[i].second_name,
                    user_info[i].email,
                    user_info[i].street,
                    user_info[i].apartment_number,
                    user_info[i].city,
                    user_info[i].phone_number,
                    user_info[i].post_code)

            }

        }catch (e) {
            console.log("problem with reRegister!: ", e)
        }
    }


}
module.exports = new parserService()
