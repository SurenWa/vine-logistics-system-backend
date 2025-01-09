import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import puppeteer from 'puppeteer';

function convertNumberToNorweigenFormat(number) {
    // Round to two decimal places
    const roundedNumber = Math.round(number * 100) / 100;

    // Convert dot to comma
    const formattedNumber = roundedNumber.toString().replace('.', ',');

    return formattedNumber;
}

@Injectable()
export class PdfgenerateService {
    constructor() {
        // Configure Cloudinary with your credentials
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async generateStockUpdatePDF(
        title: string,
        date: string,
        notice: string,
        products: any[],
    ): Promise<string> {
        // Logger.log(products);
        // return;
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document Template</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --font-color: #333;
                    --highlight-color: #030c1d;
                    --background-color: #f8f9fa;
                }

                body {
                    font-family: 'Montserrat', sans-serif;
                    color: var(--font-color);
                    margin: 0;
                    padding: 0;
                    background-color: var(--background-color);
                }

                header {
                    background-color: var(--highlight-color);
                    color: #fff;
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logoAndName {
                    display: flex;
                    align-items: center;
                }

                .logo {
                    width: 50px;
                    height: 50px;
                    background-color: #fff;
                    border-radius: 50%;
                    margin-right: 15px;
                }

                .logoAndName.center {
                flex: 1; /* Take up remaining space */
                justify-content: center; /* Center the content */
                text-align: center; /* Ensure the text is centered */
            }

                .estimation-details {
                    text-align: right;
                }

                main {
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background-color: var(--highlight-color);
                    color: #fff;
                }

                tfoot td {
                    font-weight: bold;
                }

                footer {
                    background-color: var(--highlight-color);
                    color: #fff;
                    padding: 10px 20px;
                    text-align: center;
                    position: fixed;
                    width: 100%;
                    bottom: 0;
                }

                aside {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <header>
                <div class="logoAndName">            
                    <h1>Vin Link</h1>
                </div>
                <div class="logoAndName center">            
                <h3>${title}</h3>
            </div>       
            </header>

            <main>
            <p><strong>Dato:</strong>${date}</p>
            <p><strong>Notis:</strong> ${notice}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Produsent</th>
                            <th>År</th>
                            <th>Kostpris eks mva</th>
                            <th>På Lager</th>
                            <th>Telling</th>
                            <th>Diff</th>
                            <th>Sum
                            Kostpris</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products
                            .map((product) => {
                                return `<tr>
                                <td>${product?.name}</td>
                                <td>${product?.manufacturer?.name}</td>
                                <td>${product?.year}</td>
                                <td>${convertNumberToNorweigenFormat(
                                    product?.costPriceExcludingVat,
                                )}</td>
                                <td>${product?.previousStockBalance}</td>
                                <td>${product?.stockBalance}</td>
                                <td>${String(
                                    product?.stockBalance -
                                        product?.previousStockBalance,
                                )}</td>
                                <td>${convertNumberToNorweigenFormat(
                                    product?.costPriceExcludingVat *
                                        product?.stockBalance,
                                )}</td>
                            </tr>`;
                            })
                            .join('')}                       
                        
                    </tbody>
                    
                </table>        
            </main>

            <footer>
                <p>Logistikk levert av Codeium AS</p>
            </footer>
        </body>
        </html>
        `;

        // Generate the PDF using puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: false, // Set the orientation to landscape
            printBackground: true, // Ensure background is printed
        });

        await browser.close();

        return new Promise<string>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'Vine System Order Proposal',
                        resource_type: 'raw',
                        format: 'pdf',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url); // Return the Cloudinary URL
                        }
                    },
                )
                .end(pdfBuffer);
        });
    }

    async generateOrderProposalPDF(
        title: string,
        date: string,
        notice: string,
        productName: string,
        manufacturerName: string,
        quantity: number,
    ): Promise<string> {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document Template</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
            <style>
                :root {
                    --font-color: #333;
                    --highlight-color: #030c1d;
                    --background-color: #f8f9fa;
                }

                body {
                    font-family: 'Montserrat', sans-serif;
                    color: var(--font-color);
                    margin: 0;
                    padding: 0;
                    background-color: var(--background-color);
                }

                header {
                    background-color: var(--highlight-color);
                    color: #fff;
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logoAndName {
                    display: flex;
                    align-items: center;
                }

                .logo {
                    width: 50px;
                    height: 50px;
                    background-color: #fff;
                    border-radius: 50%;
                    margin-right: 15px;
                }

                .logoAndName.center {
                flex: 1; /* Take up remaining space */
                justify-content: center; /* Center the content */
                text-align: center; /* Ensure the text is centered */
            }

                .estimation-details {
                    text-align: right;
                }

                main {
                    padding: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 10px;
                    text-align: left;
                }

                th {
                    background-color: var(--highlight-color);
                    color: #fff;
                }

                tfoot td {
                    font-weight: bold;
                }

                footer {
                    background-color: var(--highlight-color);
                    color: #fff;
                    padding: 10px 20px;
                    text-align: center;
                    position: fixed;
                    width: 100%;
                    bottom: 0;
                }

                aside {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <header>
                <div class="logoAndName">            
                    <h1>Vin Link</h1>
                </div>
                <div class="logoAndName center">            
                <h3>${title}</h3>
            </div>       
            </header>

            <main>
            <p><strong>Dato:</strong>${date}</p>
            <p><strong>Notis:</strong>${notice}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Produsent</th>
                            <th>Mengde</th>                    
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${productName}</td>
                            <td>${manufacturerName}</td>
                            <td>${quantity}</td>                    
                        </tr>
                        
                    </tbody>
                    
                </table>        
            </main>

            <footer>
                <p>Logistikk levert av Codeium AS</p>
            </footer>
        </body>
        </html>
        `;

        // Generate the PDF using puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: false, // Set the orientation to landscape
            printBackground: true, // Ensure background is printed
        });

        await browser.close();

        return new Promise<string>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: 'Vine System Order Proposal',
                        resource_type: 'raw',
                        format: 'pdf',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url); // Return the Cloudinary URL
                        }
                    },
                )
                .end(pdfBuffer);
        });
    }
}
