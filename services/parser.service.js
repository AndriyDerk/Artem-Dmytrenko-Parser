const puppeteer = require('puppeteer-extra')
const { executablePath } = require("puppeteer");
let axios = require('axios');

class parserService{


        async callback(first_name, second_name, email, street, apartment_number, city, phone_number, post_code){


        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all',
            headers: { }
        };



        async function myProxies(){
            async function getProxies(config) {
                try {
                    const response = await axios(config);
                    return response.data;
                } catch (error) {
                    console.log(error);
                }
            }

            let proxies = await getProxies(config);
            proxies = proxies.split('\n')
            let proxiesList = []
            for (let proxiesKey in proxies) {
                try{

                    const ip = proxies[proxiesKey].split(':')[0]
                    const port = proxies[proxiesKey].split(':')[1].split('\r')[0]
                    proxiesList.push({
                        ip,
                        port
                    })
                }catch (e) {}
            }
            return proxiesList
        }

        const my_proxies= await myProxies()

        const browser = await puppeteer.launch({proxies: my_proxies, headless: false, slowMo: 100, devtools: true, executablePath: executablePath()})//init browser
        const page = await browser.newPage()
        await page.setViewport({width: 1400, height: 900})


        // PAGE 1 FILL DATA


        let Link = "https://www.amway.pl/login/aboregister1"
        await page.goto(Link, {waitUntil: 'domcontentloaded'})

        await page.waitForSelector('[class*=\'cookies\'] [class*=\'acceptAll\']').then(async ()=>{
            await page.click('[class*=\'cookies\'] [class*=\'acceptAll\']')
        }).catch(()=>{})


        await page.$eval('[name="registerFormList[0].firstName"]', (element,  first_name) => {
            element.value = first_name
        },  first_name)
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

        await page.click('[type="submit"]')


        // PAGE 2 FILL DATA

        const address = street + ' ' + apartment_number
        await page.waitForSelector('[name*=\'addressLine\']').catch(()=>{})
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

        await page.waitForTimeout(5000)
        await page.click('[type="submit"]')

        await page.waitForSelector('[class="btn amw-button"]').catch(()=>{})
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
        // PAGE 3 FILL DATA

        await page.waitForSelector('[name="phone"]')
        await page.$eval('[name="phone"]', (element, phone_number) => {
            element.value = phone_number
        }, phone_number)

        await page.waitForSelector('[class="btn-amway__spinner"]')
        await page.click('[class="btn-amway__spinner"]')
        await page.click('[class="btn-amway__spinner"]')

        // PAGE 4 FILL DATA

        await page.waitForSelector('[placeholder="Wpisz numer PA"]')
        await page.$eval('[placeholder="Wpisz numer PA"]', (element) => {
            element.value = '7018899231'

        })

        await page.waitForSelector('[type="submit"]')
        await page.click('[type="submit"]')

        await page.waitForSelector('[type="submit"]')
        await page.click('[type="submit"]')

    }

}
module.exports = new parserService()
