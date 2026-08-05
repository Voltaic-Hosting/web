import { useState } from 'react';
import type { BrandingAsset, BrandingFormat } from '@/types';

const formatLabels: Record<BrandingFormat, string> = {
    png: 'PNG',
    jpg: 'JPG',
    webp: 'WEBP',
};

const formats: BrandingFormat[] = ['png', 'jpg', 'webp'];

interface BrandingAssetCardProps {
    asset: BrandingAsset;
}

export default function BrandingAssetCard({ asset }: BrandingAssetCardProps) {
    const [format, setFormat] = useState<BrandingFormat>('png');
    const downloadPath = asset.formats[format];

    return (
        <article className="branding-card">
            <div className={`branding-card__preview branding-card__preview--${asset.preview}`}>
                <img
                    src={asset.formats.png}
                    alt=""
                    className="branding-card__image"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="branding-card__body">
                <h2 className="branding-card__title">{asset.label}</h2>
                <p className="branding-card__description">{asset.description}</p>
                <p className="branding-card__meta">
                    {formatLabels[format]} · {asset.dimensions}
                </p>
                <div className="branding-format" role="group" aria-label={`${asset.label} format`}>
                    {formats.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`branding-format__btn${format === option ? ' is-active' : ''}`}
                            aria-pressed={format === option}
                            onClick={() => setFormat(option)}
                        >
                            {formatLabels[option]}
                        </button>
                    ))}
                </div>
                <a href={downloadPath} className="btn btn--ghost branding-card__download" download>
                    Download {formatLabels[format]}
                </a>
            </div>
        </article>
    );
}
