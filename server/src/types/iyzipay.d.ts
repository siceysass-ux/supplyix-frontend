declare module 'iyzipay' {
    export interface IyzipayConfig {
        apiKey: string;
        secretKey: string;
        uri: string;
    }

    export interface PaymentCard {
        cardHolderName: string;
        cardNumber: string;
        expireMonth: string;
        expireYear: string;
        cvc: string;
        registerCard: string;
    }

    export interface Buyer {
        id: string;
        name: string;
        surname: string;
        gsmNumber: string;
        email: string;
        identityNumber: string;
        lastLoginDate: string;
        registrationDate: string;
        registrationAddress: string;
        ip: string;
        city: string;
        country: string;
        zipCode: string;
    }

    export interface Address {
        contactName: string;
        city: string;
        country: string;
        address: string;
        zipCode: string;
    }

    export interface BasketItem {
        id: string;
        name: string;
        category1: string;
        category2: string;
        itemType: string;
        price: string;
    }

    export interface PaymentRequest {
        locale: string;
        conversationId: string;
        price: string;
        paidPrice: string;
        currency: string;
        installment: string;
        basketId: string;
        paymentChannel: string;
        paymentGroup: string;
        callbackUrl?: string;
        paymentCard: PaymentCard;
        buyer: Buyer;
        shippingAddress: Address;
        billingAddress: Address;
        basketItems: BasketItem[];
    }

    export interface PaymentResult {
        status: string;
        locale: string;
        systemTime: number;
        conversationId: string;
        paymentId?: string;
        threeDSHtmlContent?: string;
        errorCode?: string;
        errorMessage?: string;
        errorGroup?: string;
        paidPrice?: string;
        currency?: string;
        paymentStatus?: string;
    }

    export class Iyzipay {
        constructor(config: IyzipayConfig);

        static LOCALE: {
            TR: string;
            EN: string;
        };

        static CURRENCY: {
            TRY: string;
            EUR: string;
            USD: string;
            GBP: string;
        };

        static PAYMENT_CHANNEL: {
            WEB: string;
            MOBILE: string;
            MOBILE_WEB: string;
            MOBILE_IOS: string;
            MOBILE_ANDROID: string;
            MOBILE_WINDOWS: string;
            MOBILE_TABLET: string;
            MOBILE_PHONE: string;
        };

        static PAYMENT_GROUP: {
            PRODUCT: string;
            LISTING: string;
            SUBSCRIPTION: string;
        };

        static BASKET_ITEM_TYPE: {
            PHYSICAL: string;
            VIRTUAL: string;
        };

        payment: {
            create(request: PaymentRequest, callback: (err: any, result: PaymentResult) => void): void;
            retrieve(request: any, callback: (err: any, result: PaymentResult) => void): void;
        };

        threedsInitialize: {
            create(request: PaymentRequest, callback: (err: any, result: PaymentResult) => void): void;
        };

        threedsPayment: {
            create(request: any, callback: (err: any, result: PaymentResult) => void): void;
        };
    }

    export default Iyzipay;
}
