import React from 'react';
import { FaLock } from 'react-icons/fa';

interface BlockItemButtonProps {
    href: string;
    text: string;
    locked?: boolean;
}

interface BlockItemProps {
    logoUrl: string;
    altText: string;
    title: string;
    description: string;
    buttons: Array<BlockItemButtonProps>;
}

const BlockItem: React.FC<BlockItemProps> = ({
                                                 logoUrl,
                                                 altText,
                                                 title,
                                                 description,
                                                 buttons
                                             }) => {
    return (
        <div className="col-12 col-md-4 col-lg-3 mb-4">
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

                    <div
                        className="card-text flex-grow-1"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />

                    <div className={`mt-2 d-flex gap-2 ${buttons.length === 1 ? 'justify-content-end' : ''}`}>
                        {buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`btn btn-outline-primary btn-sm ${buttons.length > 1 ? 'flex-fill' : ''} ${index !== buttons.length - 1 ? 'mr-2' : ''}`}
                            >
                                {button.locked ? <><FaLock className="me-1 ms-0" />{button.text}</> : button.text}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlockItem;