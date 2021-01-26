import React, { useState, useEffect } from 'react';

import ImageGrid from '../components/ImageGrid';
import ImageNav from '../components/ImageNav';
import ImageViewer from '../components/ImageViewer';

const ImageGridContainer = ({data}) => {
    const sortOptions = [
        {
            label: 'Date',
            key: 'date',
        },
        {
            label: 'Popularity',
            key: 'score',
        }
    ]

    const [imageData, setImageData] = useState([]);
    const [sortOption, setSortOption] = useState(sortOptions[0]);
    const [type, setType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showViewer, setShowViewer] = useState(false);
    const [viewerSrc, setViewerSrc] = useState({})
    const [isReverse, setIsReverse] = useState(false);

    const handleSortChange = (option) => {
        if (option.key === sortOption.key) {
            setIsReverse((current) => !current);
        } else {
            setIsReverse(false);
            setSortOption(option)
        }
    }

    const handleTypeChange = (type) => {
        setType(type);
    }

    const handleSearchChange = (keyword) => {
        setSearchTerm(keyword)
    }

    const handleImageClick = (image) => {
        setViewerSrc(image);
        setShowViewer(true);
    }

    const handleClose = () => {
        setViewerSrc({});
        setShowViewer(false);
    }

    const searchData = (data) => {
        if (searchTerm?.length < 3) {
            return data;
        }

        const results = data.filter((obj) => {
            return Object.keys(obj).reduce((acc, curr) => {
                return acc || obj[curr].toString().toLowerCase().includes(searchTerm.toLowerCase());
            }, false);
        });

        return results;
    }

    const filterImages = (images) => {
        let results = images;
        const key = sortOption.key;

        let sortMethod = (a,b) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0)
        if (isReverse) {
            sortMethod = (a,b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0)
        } 
        results = images.sort(sortMethod);

        if (type === 'Wide') {
            results = results.filter(item => item.width >= item.height);
        } else if (type === 'Portrait') {
            results = results.filter(item => item.width <= item.height);
        }

        // apply search

        return searchData(results);
    }

    const selectPreviousImage = () => {
        const index = imageData.findIndex((e) => e.id === viewerSrc.id);
        if (index - 1 >= 0) {
            setViewerSrc(imageData[index-1]);
        }
    }

    const selectNextImage = () => {
        const index = imageData.findIndex((e) => e.id === viewerSrc.id);
        if (index + 1 <= imageData.length) {
            setViewerSrc(imageData[index+1]);
        }
    }

    useEffect(() => {
        if (data.length) {
            const images = filterImages(data.slice());

            setImageData(images)
        }
    }, [data, sortOption, type, searchTerm, isReverse])

    const container = document.querySelector('.image-grid');

    return (
        <div style={{ margin: '0 auto'}} className="home">
            <ImageNav 
                className={showViewer ? 'hidden' : ''}
                options={sortOptions}
                reverseSort={isReverse}
                updateSort={handleSortChange} 
                updateType={handleTypeChange}
                updateSearch={handleSearchChange}
            />
            {imageData && container && (
                <ImageGrid 
                    className='image-rows'
                    images={imageData} 
                    rowTargetHeight={400} 
                    container={container} 
                    onClick={handleImageClick}
                />
            )}
            <ImageViewer 
                image={viewerSrc} 
                show={showViewer} 
                onClose={handleClose} 
                data={imageData}
                onPrev={selectPreviousImage}
                onNext={selectNextImage}
            />
        </div>
    );
}
export default ImageGridContainer;