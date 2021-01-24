import React, { useState, useEffect } from 'react';

import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';

const ImageGridContainer = ({data}) => {
    const [imageData, setImageData] = useState([]);
    const [filterIndex, setFilterIndex] = useState(0);
    const [type, setType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showViewer, setShowViewer] = useState(false);
    const [viewerSrc, setViewerSrc] = useState({})
    const [viewerIndex, setViewerIndex] = useState(0);

    const filters = [
        {
            label: 'Home',
            value: 0    
        },
        {
            label: 'Top 50',
            value: 1,
            key: 'score'
        },
        {
            label: 'Latest 50',
            value: 2,
            key: 'date'
        }
    ]

    const handleFilterChange = (filter) => {
        setFilterIndex(filter.value);
    }

    const handleTypeChange = (type) => {
        setType(type);
    }

    const handleSearchChange = (keyword) => {
        setSearchTerm(keyword)
    }

    const handleImageClick = (image) => {
        const matchesIndex = (element) => element.id === image.id;
        const index = imageData.findIndex(matchesIndex)

        setViewerSrc(image);
        setShowViewer(true);
        setViewerIndex(index);
    }

    const handleClose = () => {
        setShowViewer(false);
    }

    const searchData = (data) => {
        if (searchTerm?.length < 3) {
            return data;
        }

        const results = data.filter((obj) => {
            return Object.keys(obj).reduce((acc, curr) => {
                return acc || obj[curr].toString().toLowerCase().includes(searchTerm);
            }, false);
        });

        return results;
    }

    const filterImages = (images) => {
        let results;

        const key = filters[filterIndex].key;
        const sortMethod = (a,b) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0)

        // apply filters
        if (filterIndex === 0) {
            results = images;
        } else {
            results = images.sort(sortMethod).slice(0, 50);
        } 

        if (type === 'Wide') {
            results = results.filter(item => item.width >= item.height);
        } else if (type === 'Portrait') {
            results = results.filter(item => item.width <= item.height);
        }

        // apply search

        return searchData(results);
    }

    useEffect(() => {
        if (data.length) {
            const images = filterImages(data.slice());

            setImageData(images)
        }
    }, [data, filterIndex, type, searchTerm])

    const container = document.querySelector('.image-grid');

    return (
        <div style={{ margin: '0 auto'}} className="home">
            <ImageNav 
                filters={filters}
                updateFilter={handleFilterChange} 
                updateType={handleTypeChange}
                updateSearch={handleSearchChange}
            />
            {imageData && container && (
                <ImageGrid images={imageData} rowTargetHeight={300} container={container} onClick={handleImageClick}/>
            )}
            <ImageViewer 
                image={viewerSrc} 
                show={showViewer} 
                onClose={handleClose} 
            />
        </div>
    );
}
export default ImageGridContainer;