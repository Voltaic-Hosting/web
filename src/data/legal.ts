import type { LegalContent } from './types';

export const legal: LegalContent = {
    effectiveDate: 'August 5, 2026',
    operator: 'Voltaic Hosting',
    privacy: {
        intro: 'This policy covers the public website at voltaic.host. We do not run ads, sell personal data, or use analytics beacons or product telemetry on this site.',
        sections: [
            {
                title: 'Information we collect',
                paragraphs: [],
                list: [
                    'Standard web server logs (IP address, browser user agent, requested URL, and timestamp) kept only as long as operations require.',
                    'Information you send by email, such as your address, message content, and any attachments you choose to include.',
                    'Account and billing records if you become a customer. Used for service delivery, invoicing, and support.',
                ],
            },
            {
                title: 'Cookies',
                paragraphs: [
                    'Cookies on this site are functional only. They support session management, CSRF protection, and other features required to operate the website securely.',
                    'We do not use advertising cookies or third-party tracking cookies on this site.',
                ],
                list: [],
            },
            {
                title: 'How we use information',
                paragraphs: [
                    'We use collected information to operate the website, respond to inquiries, provide contracted services, and maintain security.',
                    'We do not build marketing profiles from site visits and we do not share customer data for advertising purposes.',
                ],
                list: [],
            },
            {
                title: 'Third parties',
                paragraphs: [],
                list: [
                    'Infrastructure providers involved in hosting this website and customer systems under contract.',
                    'Payment processors if and when online billing is enabled. Details will be listed here before charges go live.',
                ],
            },
            {
                title: 'Your choices',
                paragraphs: [
                    'You may request access to, correction of, or deletion of personal data tied to a customer relationship by emailing team@voltaic.host.',
                ],
                list: [],
            },
            {
                title: 'Changes',
                paragraphs: [
                    'If this policy changes, we will update the effective date on this page.',
                ],
                list: [],
            },
        ],
    },
    terms: {
        intro: 'These terms apply to the Voltaic Hosting public website and to services we provide under a written agreement or invoice.',
        sections: [
            {
                title: 'Website use',
                paragraphs: [
                    'You may browse this site for lawful purposes. Do not attempt to disrupt the site, probe systems without authorization, or misuse contact channels.',
                ],
                list: [],
            },
            {
                title: 'Services',
                paragraphs: [
                    'Hosting, colocation, and infrastructure work are provided under separate statements of work, order forms, or invoices that define scope, price, and term.',
                    'Information on this website is general and does not by itself create a binding service commitment.',
                ],
                list: [],
            },
            {
                title: 'Fees and refunds',
                paragraphs: [
                    'Charges match the line items on the order or invoice you accepted. Fees that were omitted from that document are not added later.',
                    'New service includes a 30-day refund window if it does not fit. Fiat payments are processed through Stripe in USD or EUR. Monero is also accepted.',
                ],
                list: [],
            },
            {
                title: 'Cancellation and migration',
                paragraphs: [
                    'You may cancel monthly service at any time. Cancellation ends future billing for that service. There is no exit fee for ending service.',
                    'On request, Voltaic Hosting will help you migrate workloads off the platform onto servers you control. Migration scope and timing are agreed in writing for that request.',
                ],
                list: [],
            },
            {
                title: 'Acceptable use on Voltaic servers',
                paragraphs: [
                    'Voltaic-owned servers may not be used for illegal sites, gambling, email servers, or pornography. DMCA takedown requests are enforced on those systems.',
                    'Bring-your-own servers that you operate yourself are not under those content rules. You remain responsible for lawful use of hardware you control.',
                ],
                list: [],
            },
            {
                title: 'Customer responsibilities',
                paragraphs: [],
                list: [
                    'Provide accurate contact and billing information.',
                    'Maintain credentials and access controls for systems you administer.',
                    'Use allocated resources lawfully and in line with acceptable use requirements stated in your agreement.',
                ],
            },
            {
                title: 'Availability and changes',
                paragraphs: [
                    'Voltaic Hosting works to keep this site available but does not guarantee uninterrupted access. Site content may change without notice.',
                    'Service may be suspended or terminated for non-payment, abuse, or material breach of an agreement.',
                ],
                list: [],
            },
            {
                title: 'Limitation of liability',
                paragraphs: [
                    'To the extent permitted by law, Voltaic Hosting is not liable for indirect or consequential damages arising from use of this website. Service liability limits, if any, are defined in your service agreement.',
                ],
                list: [],
            },
            {
                title: 'Contact',
                paragraphs: ['Questions about these terms may be sent to team@voltaic.host.'],
                list: [],
            },
        ],
    },
};
