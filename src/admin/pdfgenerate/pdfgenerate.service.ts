import { Injectable } from '@nestjs/common';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';

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
    async generatePDF(
        title: string,
        date: string,
        notice: string,
        products: any[],
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });

            doc.fillColor('#444444')
                .fontSize(20)
                .text(title, 85, 40, { align: 'center' })
                .moveDown();

            // Add date and notice title
            doc.fontSize(10)
                .text('Dato:', 50, 100)
                .font('Helvetica-Bold')
                .text(date, 125, 100) // Replace with actual date
                .text('Notis:', 50, 120)
                .font('Helvetica-Bold')
                .text(notice, 125, 120) // Replace with actual notice title
                .moveDown();

            // Draw horizontal line
            doc.strokeColor('#aaaaaa')
                .lineWidth(1)
                .moveTo(50, 150)
                .lineTo(550, 150)
                .stroke()
                .moveDown();

            // Add table headers
            doc.fontSize(10)
                .text('Navn', 25, 200)
                .text('Produsent', 125, 200)
                .text('Ar', 225, 200)
                .text('Kostpris', 275, 200)
                .text('eks mva', 275, 215)
                .text('Pa Lager', 350, 200)
                .text('Telling', 400, 200)
                .text('Diff', 445, 200)
                .text('Sum', 500, 200)
                .text('Kostpris', 500, 215);
            // Draw horizontal line
            doc.strokeColor('#aaaaaa')
                .lineWidth(1)
                .moveTo(25, 230)
                .lineTo(550, 230)
                .stroke()
                .moveDown();

            // Add product data to the table
            products.forEach((product, index) => {
                const y = 250 + index * 30; // Calculate y position based on index
                const nameWidth = 100; // Width of the column for product name
                const manufacturerWidth = 100;
                doc.fontSize(10)
                    .text(product?.name, 25, y, { width: nameWidth })
                    .text(product?.manufacturer?.name, 125, y, {
                        width: manufacturerWidth,
                    })
                    .text(product?.year, 225, y)
                    .text(
                        convertNumberToNorweigenFormat(
                            product?.costPriceExcludingVat,
                        ),
                        275,
                        y,
                    )
                    .text(product?.previousStockBalance, 350, y)
                    .text(product?.stockBalance, 400, y)
                    .text(
                        String(
                            product?.stockBalance -
                                product?.previousStockBalance,
                        ),
                        445,
                        y,
                    )
                    .text(
                        convertNumberToNorweigenFormat(
                            product?.costPriceExcludingVat *
                                product?.stockBalance,
                        ),
                        500,
                        y,
                    );
            });
            // End the PDF document and pipe to file stream
            doc.end();
            // Create a buffer to store the PDF content
            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);

                // Upload the PDF buffer to Cloudinary
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: 'Vine System',
                            resource_type: 'raw',
                            format: 'pdf',
                        },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url); // Resolve with the URL of the uploaded PDF
                            }
                        },
                    )
                    .end(pdfBuffer);
            });
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
        return new Promise<string>((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50 });

            doc.fillColor('#444444')
                .fontSize(20)
                .text(title, 85, 40, { align: 'center' })
                .moveDown();

            // Add date and notice title
            doc.fontSize(10)
                .text('Dato:', 50, 100)
                .font('Helvetica-Bold')
                .text(date, 125, 100) // Replace with actual date
                .text('Notis:', 50, 120)
                .font('Helvetica-Bold')
                .text(notice, 125, 120) // Replace with actual notice title
                .moveDown();

            // Draw horizontal line
            doc.strokeColor('#aaaaaa')
                .lineWidth(1)
                .moveTo(50, 150)
                .lineTo(550, 150)
                .stroke()
                .moveDown();

            // Add table headers
            doc.fontSize(10)
                .text('Navn', 25, 200)
                .text('Produsent', 225, 200)
                .text('Mengde', 400, 200);

            // Draw horizontal line
            doc.strokeColor('#aaaaaa')
                .lineWidth(1)
                .moveTo(25, 230)
                .lineTo(550, 230)
                .stroke()
                .moveDown();

            // Add product data to the table

            const y = 250; // Calculate y position based on index
            const nameWidth = 100; // Width of the column for product name
            const manufacturerWidth = 100;
            doc.fontSize(10)
                .text(productName, 25, y, { width: nameWidth })
                .text(manufacturerName, 225, y, {
                    width: manufacturerWidth,
                })

                .text(quantity.toString(), 400, y);

            // End the PDF document and pipe to file stream
            doc.end();
            // Create a buffer to store the PDF content
            const buffers: Buffer[] = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);

                // Upload the PDF buffer to Cloudinary
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
                                resolve(result.secure_url); // Resolve with the URL of the uploaded PDF
                            }
                        },
                    )
                    .end(pdfBuffer);
            });
        });
    }
}
