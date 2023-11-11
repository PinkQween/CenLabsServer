import React, { useEffect, useState } from 'react';

const TextViewer = ({ path }) => {
    const [textContent, setTextContent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(path);
                const text = await response.text();
                setTextContent(text);
            } catch (error) {
                console.error('Error fetching text content:', error);
            }
        };

        fetchData();
    }, [path]);

    return (
        <pre>
            {textContent !== null ? (
                textContent
            ) : (
                'Loading text content...' // You can show a loading message while fetching
            )}
        </pre>
    );
};

export default TextViewer;
