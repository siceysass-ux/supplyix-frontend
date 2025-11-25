import express, { Request, Response } from 'express';
import Iyzipay from 'iyzipay';

const router = express.Router();

// iyzico client initialization (conditional)
const iyzipay = process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY
    ? new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
    })
    : null;

// Payment initialization endpoint
router.post('/initialize', async (req: Request, res: Response) => {
    try {
        if (!iyzipay) {
            return res.status(503).json({ error: 'Payment service not configured' });
        }

        const { item, buyer, card } = req.body;

        // Validate required fields
        if (!item || !buyer || !card) {
            return res.status(400).json({
                success: false,
                error: 'Eksik ödeme bilgileri'
            });
        }

        // Prepare payment request
        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: `conv_${Date.now()}`,
            price: item.price.toString(),
            paidPrice: item.price.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            installment: '1',
            basketId: `basket_${Date.now()}`,
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: process.env.PAYMENT_CALLBACK_URL,
            paymentCard: {
                cardHolderName: card.cardHolderName,
                cardNumber: card.cardNumber.replace(/\s/g, ''),
                expireMonth: card.expireMonth,
                expireYear: card.expireYear,
                cvc: card.cvc,
                registerCard: '0'
            },
            buyer: {
                id: buyer.id,
                name: buyer.name,
                surname: buyer.surname,
                gsmNumber: buyer.gsmNumber,
                email: buyer.email,
                identityNumber: buyer.identityNumber && buyer.identityNumber.length >= 11
                    ? buyer.identityNumber
                    : '11111111111',
                lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
                registrationDate: buyer.registrationDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
                registrationAddress: buyer.address || 'Adres bilgisi',
                ip: req.ip || '85.34.78.112',
                city: buyer.city || 'Istanbul',
                country: buyer.country || 'Turkey',
                zipCode: buyer.zipCode || '34732'
            },
            shippingAddress: {
                contactName: `${buyer.name} ${buyer.surname}`,
                city: buyer.city || 'Istanbul',
                country: buyer.country || 'Turkey',
                address: buyer.address || 'Adres bilgisi',
                zipCode: buyer.zipCode || '34732'
            },
            billingAddress: {
                contactName: `${buyer.name} ${buyer.surname}`,
                city: buyer.city || 'Istanbul',
                country: buyer.country || 'Turkey',
                address: buyer.address || 'Adres bilgisi',
                zipCode: buyer.zipCode || '34732'
            },
            basketItems: [
                {
                    id: item.id || 'item1',
                    name: item.name,
                    category1: item.category || 'Subscription',
                    category2: item.subcategory || 'Membership',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: item.price.toString()
                }
            ]
        };

        console.log('🚀 Iyzico Request:', JSON.stringify(request, null, 2));

        // Create 3D Secure payment
        iyzipay.threedsInitialize.create(request, (err: any, result: any) => {
            if (err) {
                console.error('❌ Iyzico Error:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Ödeme başlatılamadı',
                    details: err
                });
            }

            console.log('✅ Iyzico Result:', JSON.stringify(result, null, 2));

            if (result.status === 'success') {
                // Return 3D Secure HTML content
                res.json({
                    success: true,
                    threeDSHtmlContent: result.threeDSHtmlContent,
                    paymentId: result.paymentId,
                    conversationId: result.conversationId
                });
            } else {
                console.error('❌ Iyzico Failure:', result.errorMessage);
                res.status(400).json({
                    success: false,
                    error: result.errorMessage || 'Ödeme başlatılamadı',
                    errorCode: result.errorCode
                });
            }
        });

    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası'
        });
    }
});

// Payment callback endpoint (after 3D Secure)
router.post('/callback', async (req: Request, res: Response) => {
    try {
        const { paymentId, conversationId, mdStatus, conversationData } = req.body;

        if (!iyzipay) {
            console.error('Iyzico client is not initialized');
            return res.status(500).send('Ödeme sistemi hatası');
        }

        // Verify 3D Secure authentication
        if (mdStatus !== '1') {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Ödeme Başarısız</title>
                    <script>
                        window.parent.postMessage({ type: 'PAYMENT_FAILED', message: '3D Secure doğrulaması başarısız.' }, '*');
                    </script>
                </head>
                <body>
                    <h1>Ödeme Başarısız</h1>
                    <p>3D Secure doğrulaması tamamlanamadı.</p>
                </body>
                </html>
            `);
        }

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: conversationId,
            paymentId: paymentId,
            conversationData: conversationData || null
        };

        iyzipay.threedsPayment.create(request, (err: any, result: any) => {
            if (err) {
                console.error('3D Secure Payment Error:', err);
                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script>
                            window.parent.postMessage({ type: 'PAYMENT_FAILED', message: 'Ödeme tamamlanamadı.' }, '*');
                        </script>
                    </head>
                    <body><h1>Ödeme Başarısız</h1></body>
                    </html>
                `);
            }

            if (result.status === 'success') {
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script>
                            window.parent.postMessage({ type: 'PAYMENT_SUCCESS', paymentId: '${result.paymentId || conversationId}' }, '*');
                        </script>
                    </head>
                    <body><h1>Ödeme Başarılı</h1></body>
                    </html>
                `);
            } else {
                res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <script>
                            window.parent.postMessage({ type: 'PAYMENT_FAILED', message: '${result.errorMessage}' }, '*');
                        </script>
                    </head>
                    <body><h1>Ödeme Başarısız</h1><p>${result.errorMessage}</p></body>
                    </html>
                `);
            }
        });

    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).send('Sunucu hatası');
    }
});

export default router;
