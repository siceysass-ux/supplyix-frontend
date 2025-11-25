import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'mail.kurumsaleposta.com',
    port: parseInt(process.env.MAIL_PORT || '465'),
    secure: true, // SSL for port 465
    auth: {
        user: process.env.MAIL_USERNAME || 'supplyix@supplyix.com',
        pass: process.env.MAIL_PASSWORD || '5470452BBmm..',
    },
    tls: {
        rejectUnauthorized: false,
        // Allow legacy SSL renegotiation for compatibility with older mail servers
        secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT
    }
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME || 'Supplyix'}" <${process.env.MAIL_FROM_ADDRESS || 'supplyix@supplyix.com'}>`,
            to,
            subject,
            text,
            html,
        });
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendSubscriptionExpiryEmail = async (to: string, userName: string, planName: string, endDate: string) => {
    const subject = '⚠️ Supplyix Aboneliğiniz Sona Erdi';
    const text = `Sayın ${userName},\n\nSupplyix ${planName} aboneliğinizin süresi ${endDate} tarihinde dolmuştur.\n\nHizmetlerimize kesintisiz devam etmek için lütfen aboneliğinizi yenileyiniz.\n\nSaygılarımızla,\nSupplyix Ekibi`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                    <div style="margin-bottom: 20px;">
                                        <table role="presentation" style="margin: 0 auto;">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); width: 50px; height: 50px; border-radius: 10px; text-align: center; vertical-align: middle; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; line-height: 50px;">S</span>
                                                </td>
                                                <td style="padding-left: 12px; vertical-align: middle;">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">upplyix</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">⚠️ Aboneliğiniz Sona Erdi</h1>
                                    <p style="color: #fee2e2; margin: 10px 0 0 0; font-size: 14px;">Hizmetlerinize devam etmek için yenileyin</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; line-height: 1.6;">
                                        Sayın <strong>${userName}</strong>,
                                    </p>
                                    <p style="font-size: 15px; color: #555555; margin: 0 0 30px 0; line-height: 1.6;">
                                        <strong>${planName}</strong> aboneliğinizin süresi <strong>${endDate}</strong> tarihinde dolmuştur. Supplyix hizmetlerine kesintisiz devam etmek için lütfen aboneliğinizi yenileyin.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="https://supplyix.com/dashboard/settings" style="display: inline-block; background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                                                    🔄 Aboneliği Yenile
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Warning Box -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #991b1b; font-weight: 600;">
                                                    ⚠️ Önemli Uyarı
                                                </p>
                                                <p style="margin: 0; font-size: 13px; color: #7f1d1d; line-height: 1.5;">
                                                    Aboneliğiniz sona erdiği için bazı özellikler kısıtlanmış olabilir. Hizmetlerimize tam erişim için lütfen en kısa sürede yenileyin.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #042d4d; font-weight: 600;">Supplyix Ekibi</p>
                                    <p style="margin: 0 0 15px 0; font-size: 12px; color: #64748b;">Profesyonel tedarik ve lojistik çözümleri</p>
                                    <div style="margin: 15px 0;">
                                        <a href="https://supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">🌐 Web Sitesi</a>
                                        <span style="color: #cbd5e1;">|</span>
                                        <a href="mailto:supplyix@supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">📧 Destek</a>
                                    </div>
                                    <p style="margin: 15px 0 0 0; font-size: 11px; color: #94a3b8;">© 2024 Supplyix. Tüm hakları saklıdır.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendSubscriptionReminderEmail = async (to: string, userName: string, planName: string, endDate: string, daysLeft: number) => {
    // Dynamic colors based on urgency
    const headerColor = daysLeft <= 3 ? '#dc2626' : '#f59e0b';
    const headerColorDark = daysLeft <= 3 ? '#b91c1c' : '#d97706';
    const boxBgColor = daysLeft <= 3 ? '#fef2f2' : '#fffbeb';
    const boxBorderColor = daysLeft <= 3 ? '#dc2626' : '#f59e0b';
    const boxTextColor = daysLeft <= 3 ? '#991b1b' : '#92400e';
    const boxTextColorDark = daysLeft <= 3 ? '#7f1d1d' : '#78350f';
    const urgencyIcon = daysLeft <= 3 ? '⚠️' : '⏰';

    const subject = `${urgencyIcon} Supplyix Aboneliğinizin Bitmesine ${daysLeft} Gün Kaldı`;
    const text = `Sayın ${userName},\n\nSupplyix ${planName} aboneliğinizin bitmesine ${daysLeft} gün kalmıştır.\n\nKesinti yaşamamak için lütfen ${endDate} tarihinden önce aboneliğinizi yenileyiniz.\n\nSaygılarımızla,\nSupplyix Ekibi`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, ${headerColor} 0%, ${headerColorDark} 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                    <div style="margin-bottom: 20px;">
                                        <table role="presentation" style="margin: 0 auto;">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); width: 50px; height: 50px; border-radius: 10px; text-align: center; vertical-align: middle; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; line-height: 50px;">S</span>
                                                </td>
                                                <td style="padding-left: 12px; vertical-align: middle;">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">upplyix</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">${urgencyIcon} Abonelik Hatırlatması</h1>
                                    <p style="color: #fee2e2; margin: 10px 0 0 0; font-size: 14px;">Aboneliğinizin bitmesine ${daysLeft} gün kaldı</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; line-height: 1.6;">
                                        Sayın <strong>${userName}</strong>,
                                    </p>
                                    <p style="font-size: 15px; color: #555555; margin: 0 0 30px 0; line-height: 1.6;">
                                        <strong>${planName}</strong> aboneliğinizin bitmesine <strong style="color: ${headerColor};">${daysLeft} gün</strong> kalmıştır. Hizmetlerimize kesintisiz devam etmek için lütfen <strong>${endDate}</strong> tarihinden önce aboneliğinizi yenileyin.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="https://supplyix.com/dashboard/settings" style="display: inline-block; background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                                                    🔄 Hemen Yenile
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Info Box -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0; background-color: ${boxBgColor}; border-left: 4px solid ${boxBorderColor}; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: ${boxTextColor}; font-weight: 600;">
                                                    ${urgencyIcon} ${daysLeft <= 3 ? 'Acil Hatırlatma' : 'Önemli Bilgi'}
                                                </p>
                                                <p style="margin: 0; font-size: 13px; color: ${boxTextColorDark}; line-height: 1.5;">
                                                    ${daysLeft <= 3
            ? 'Aboneliğinizin sona ermesine çok az süre kaldı! Hizmet kesintisi yaşamamak için lütfen bugün yenileyin.'
            : 'Aboneliğinizi zamanında yenileyerek kesintisiz hizmet alabilir ve tüm özelliklerden yararlanmaya devam edebilirsiniz.'}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Benefits Box -->
                                    <table role="presentation" style="width: 100%; margin: 20px 0; background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #166534; font-weight: 600;">
                                                    ✨ Abonelik Avantajlarınız
                                                </p>
                                                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #15803d; line-height: 1.8;">
                                                    <li>Sınırsız ürün erişimi</li>
                                                    <li>Öncelikli müşteri desteği</li>
                                                    <li>Özel fiyatlandırma avantajları</li>
                                                    <li>Gelişmiş raporlama araçları</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #042d4d; font-weight: 600;">Supplyix Ekibi</p>
                                    <p style="margin: 0 0 15px 0; font-size: 12px; color: #64748b;">Profesyonel tedarik ve lojistik çözümleri</p>
                                    <div style="margin: 15px 0;">
                                        <a href="https://supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">🌐 Web Sitesi</a>
                                        <span style="color: #cbd5e1;">|</span>
                                        <a href="mailto:supplyix@supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">📧 Destek</a>
                                    </div>
                                    <p style="margin: 15px 0 0 0; font-size: 11px; color: #94a3b8;">© 2024 Supplyix. Tüm hakları saklıdır.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendPasswordResetEmail = async (to: string, userName: string, resetToken: string) => {
    const resetLink = `http://localhost:5173/#/reset-password?token=${resetToken}`;
    const subject = 'Supplyix - Şifre Sıfırlama Talebi';
    const text = `Merhaba ${userName},\n\nŞifrenizi sıfırlamak için bir talepte bulundunuz. Aşağıdaki linke tıklayarak yeni şifrenizi belirleyebilirsiniz:\n${resetLink}\n\nBu link 1 saat geçerlidir.\n\nEğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz. Şifreniz değiştirilmeyecektir.\n\nSaygılarımızla,\nSupplyix Ekibi`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header with Logo -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #042d4d 0%, #0a4d7a 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                    <div style="margin-bottom: 20px;">
                                        <table role="presentation" style="margin: 0 auto;">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); width: 50px; height: 50px; border-radius: 10px; text-align: center; vertical-align: middle; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; line-height: 50px;">S</span>
                                                </td>
                                                <td style="padding-left: 12px; vertical-align: middle;">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">upplyix</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Şifre Sıfırlama</h1>
                                    <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 14px;">Güvenli hesap yönetimi</p>
                                </td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; line-height: 1.6;">
                                        Merhaba <strong>${userName}</strong>,
                                    </p>
                                    <p style="font-size: 15px; color: #555555; margin: 0 0 30px 0; line-height: 1.6;">
                                        Hesabınız için bir şifre sıfırlama talebi aldık. Aşağıdaki butona tıklayarak yeni şifrenizi güvenli bir şekilde belirleyebilirsiniz.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3); transition: all 0.3s ease;">
                                                    🔐 Şifremi Sıfırla
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Info Box -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #fff7ed; border-left: 4px solid #F97316; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #9a3412; font-weight: 600;">
                                                    ⏱️ Önemli Bilgi
                                                </p>
                                                <p style="margin: 0; font-size: 13px; color: #7c2d12; line-height: 1.5;">
                                                    Bu sıfırlama linki güvenlik nedeniyle <strong>1 saat</strong> geçerlidir. Süre sonunda yeni bir link talep etmeniz gerekecektir.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Security Notice -->
                                    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #166534; font-weight: 600;">
                                                    🔒 Güvenlik Uyarısı
                                                </p>
                                                <p style="margin: 0; font-size: 13px; color: #15803d; line-height: 1.5;">
                                                    Eğer bu işlemi siz yapmadıysanız, hesabınızın güvenliği için lütfen bizimle iletişime geçin. Bu e-postayı görmezden gelebilirsiniz, şifreniz değiştirilmeyecektir.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Alternative Link -->
                                    <p style="font-size: 13px; color: #888888; margin: 30px 0 0 0; line-height: 1.6; text-align: center;">
                                        Butona tıklayamıyorsanız, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:<br>
                                        <a href="${resetLink}" style="color: #F97316; word-break: break-all; text-decoration: none;">${resetLink}</a>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #042d4d; font-weight: 600;">
                                        Supplyix Ekibi
                                    </p>
                                    <p style="margin: 0 0 15px 0; font-size: 12px; color: #64748b;">
                                        Profesyonel tedarik ve lojistik çözümleri
                                    </p>
                                    <div style="margin: 15px 0;">
                                        <a href="https://supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">🌐 Web Sitesi</a>
                                        <span style="color: #cbd5e1;">|</span>
                                        <a href="mailto:supplyix@supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">📧 Destek</a>
                                    </div>
                                    <p style="margin: 15px 0 0 0; font-size: 11px; color: #94a3b8;">
                                        © 2024 Supplyix. Tüm hakları saklıdır.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
    return sendEmail(to, subject, text, html);
};

export const sendEmailVerification = async (to: string, userName: string, verificationToken: string) => {
    const verificationLink = `http://localhost:5173/#/verify-email?token=${verificationToken}`;
    const subject = '📧 Supplyix - Email Adresinizi Doğrulayın';
    const text = `Merhaba ${userName},\n\nSupplyix'e hoş geldiniz! Hesabınızı aktifleştirmek için email adresinizi doğrulamanız gerekmektedir.\n\nAşağıdaki linke tıklayarak email adresinizi doğrulayabilirsiniz:\n${verificationLink}\n\nBu link 24 saat geçerlidir.\n\nEğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.\n\nSaygılarımızla,\nSupplyix Ekibi`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                    <div style="margin-bottom: 20px;">
                                        <table role="presentation" style="margin: 0 auto;">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); width: 50px; height: 50px; border-radius: 10px; text-align: center; vertical-align: middle; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; line-height: 50px;">S</span>
                                                </td>
                                                <td style="padding-left: 12px; vertical-align: middle;">
                                                    <span style="font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 1px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">upplyix</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">📧 Email Adresinizi Doğrulayın</h1>
                                    <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 14px;">Hesabınızı aktifleştirmek için son adım</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; line-height: 1.6;">
                                        Merhaba <strong>${userName}</strong>,
                                    </p>
                                    <p style="font-size: 15px; color: #555555; margin: 0 0 10px 0; line-height: 1.6;">
                                        Supplyix'e hoş geldiniz! 🎉
                                    </p>
                                    <p style="font-size: 15px; color: #555555; margin: 0 0 30px 0; line-height: 1.6;">
                                        Hesabınızı aktifleştirmek ve tüm özelliklerden yararlanmaya başlamak için email adresinizi doğrulamanız gerekmektedir.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #F97316 0%, #ea580c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);">
                                                    ✅ Email Adresimi Doğrula
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Info Box -->
                                    <table role="presentation" style="width: 100%; margin: 30px 0; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #1e40af; font-weight: 600;">
                                                    💡 Neden Email Doğrulaması Gerekli?
                                                </p>
                                                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1e3a8a; line-height: 1.8;">
                                                    <li>Hesabınızın güvenliğini sağlamak için</li>
                                                    <li>Önemli bildirimleri alabilmeniz için</li>
                                                    <li>Şifre sıfırlama gibi işlemleri yapabilmeniz için</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Warning Box -->
                                    <table role="presentation" style="width: 100%; margin: 20px 0; background-color: #fff7ed; border-left: 4px solid #f59e0b; border-radius: 6px;">
                                        <tr>
                                            <td style="padding: 20px;">
                                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e; font-weight: 600;">
                                                    ⏱️ Önemli Bilgi
                                                </p>
                                                <p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.5;">
                                                    Bu doğrulama linki <strong>24 saat</strong> geçerlidir. Süre sonunda yeni bir doğrulama emaili talep edebilirsiniz.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Alternative Link -->
                                    <p style="font-size: 13px; color: #888888; margin: 30px 0 0 0; line-height: 1.6; text-align: center;">
                                        Butona tıklayamıyorsanız, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:<br>
                                        <a href="${verificationLink}" style="color: #F97316; word-break: break-all; text-decoration: none;">${verificationLink}</a>
                                    </p>
                                    
                                    <p style="font-size: 13px; color: #999999; margin: 20px 0 0 0; line-height: 1.6; text-align: center;">
                                        Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı güvenle görmezden gelebilirsiniz.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
                                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #042d4d; font-weight: 600;">Supplyix Ekibi</p>
                                    <p style="margin: 0 0 15px 0; font-size: 12px; color: #64748b;">Profesyonel tedarik ve lojistik çözümleri</p>
                                    <div style="margin: 15px 0;">
                                        <a href="https://supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">🌐 Web Sitesi</a>
                                        <span style="color: #cbd5e1;">|</span>
                                        <a href="mailto:supplyix@supplyix.com" style="color: #F97316; text-decoration: none; font-size: 12px; margin: 0 10px;">📧 Destek</a>
                                    </div>
                                    <p style="margin: 15px 0 0 0; font-size: 11px; color: #94a3b8;">© 2024 Supplyix. Tüm hakları saklıdır.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
    return sendEmail(to, subject, text, html);
};
