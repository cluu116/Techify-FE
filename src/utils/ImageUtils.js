const getImageUrl = (imageData) => {
    if (typeof imageData === 'string') {
        try {
            const parsed = JSON.parse(imageData);
            return parsed.url;
        } catch (error) {
            console.error("Error parsing image JSON:", error);
            return imageData;
        }
    } else if (typeof imageData === 'object' && imageData !== null) {
        return imageData.url;
    }
    return '';
};

export default getImageUrl;