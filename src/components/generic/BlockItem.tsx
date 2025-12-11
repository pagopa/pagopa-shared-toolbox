import React from 'react';

interface BlockItemProps {
    logoUrl: string;
    altText: string;
    title: string;
    description: string;
    href: string;
}

const BlockItem: React.FC<BlockItemProps> = ({
                                                 logoUrl,
                                                 altText,
                                                 title,
                                                 description,
                                                 href
                                             }) => {
    return (
        <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm"> {/* h-100 per carte della stessa altezza */}
                <div className="card-body d-flex flex-column">

                    <div className="d-flex align-items-center mb-3">
                        <img
                            src={logoUrl}
                            alt={altText}
                            className="me-3" // 'me-3' è la classe Bootstrap per 'margin-end: 3' (margine a destra)
                            style={{ width: '32px', height: '32px' }}
                        />
                        <h5 className="card-title ml-3 mb-0">{title}</h5>
                    </div>

                    <p className="card-text flex-grow-1">{description}</p>

                    <div className="mt-auto d-flex justify-content-end">
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm"
                        >
                            Approfondisci
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockItem;