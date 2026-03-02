/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { Artifact } from '../types';
import { HeartIcon, HeartFilledIcon, InfoIcon, XIcon, CopyIcon, CheckIcon } from './Icons';

interface ArtifactCardProps {
    artifact: Artifact;
    isFocused: boolean;
    onClick: () => void;
}

const ArtifactCard = React.memo(({ 
    artifact, 
    isFocused, 
    onClick 
}: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Auto-scroll logic for this specific card
    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [artifact.html]);

    const isBlurring = artifact.status === 'streaming';

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
    };

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDetails(!showDetails);
    };

    const handleCopyClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!artifact.html) return;
        
        try {
            await navigator.clipboard.writeText(artifact.html);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div 
            className={`artifact-card ${isFocused ? 'focused' : ''} ${isBlurring ? 'generating' : ''}`}
            onClick={onClick}
        >
            <div className="artifact-header">
                <span className="artifact-style-tag">{artifact.styleName}</span>
                <div className="artifact-actions">
                    <button 
                        className={`action-btn ${isFavorited ? 'favorited' : ''}`} 
                        onClick={handleFavoriteClick}
                        title={isFavorited ? "Unfavorite" : "Favorite"}
                    >
                        {isFavorited ? <HeartFilledIcon /> : <HeartIcon />}
                    </button>
                    <button 
                        className={`action-btn ${isCopied ? 'copied' : ''}`} 
                        onClick={handleCopyClick}
                        title={isCopied ? "Copied!" : "Copy Code"}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <button 
                        className="action-btn" 
                        onClick={handleInfoClick}
                        title="Session Details"
                    >
                        {showDetails ? <XIcon /> : <InfoIcon />}
                    </button>
                </div>
            </div>
            <div className="artifact-card-inner">
                {isBlurring && (
                    <div className="generating-overlay">
                        <div className="skeleton-ui">
                            <div className="skeleton-header"></div>
                            <div className="skeleton-body">
                                <div className="skeleton-line" style={{ width: '75%' }}></div>
                                <div className="skeleton-line" style={{ width: '100%' }}></div>
                                <div className="skeleton-line" style={{ width: '83%' }}></div>
                                <div className="skeleton-line" style={{ width: '50%' }}></div>
                            </div>
                        </div>
                        <pre ref={codeRef} className="code-stream-preview">
                            {artifact.html}
                        </pre>
                    </div>
                )}
                <iframe 
                    srcDoc={artifact.html} 
                    title={artifact.id} 
                    sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
                    className="artifact-iframe"
                />
                {showDetails && (
                    <div className="artifact-details-overlay" onClick={(e) => e.stopPropagation()}>
                        <div className="details-content">
                            <div className="details-header">
                                <h3>Session Details</h3>
                                <button className="close-details-btn" onClick={handleInfoClick}>
                                    <XIcon />
                                </button>
                            </div>
                            <div className="details-body">
                                <div className="detail-item">
                                    <span className="detail-label">Style:</span>
                                    <span className="detail-value">{artifact.styleName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status:</span>
                                    <span className="detail-value">{artifact.status}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">ID:</span>
                                    <span className="detail-value">{artifact.id}</span>
                                </div>
                                {artifact.tags && artifact.tags.length > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">Tags:</span>
                                        <div className="detail-tags">
                                            {artifact.tags.map(tag => (
                                                <span key={tag} className="detail-tag">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ArtifactCard;