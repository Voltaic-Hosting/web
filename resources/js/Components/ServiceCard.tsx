import type { Service } from '@/types';

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <article className="service-card">
            {service.badge ? <span className="service-card__badge">{service.badge}</span> : null}
            <h3 className="service-card__title">{service.title}</h3>
            <p className="service-card__summary">{service.summary}</p>
        </article>
    );
}
