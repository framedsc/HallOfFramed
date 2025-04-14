import React from 'react';
import { useViewport } from '../utils/hooks';

const ImageGrid = ({
  className,
  images,
  rowTargetHeight = 400,
  borderOffset = 5,
  profileMode = false,
  onClick,
}) => {
  const { width } = useViewport();
  const maxWidth = width - borderOffset * 2;

  const processImages = () => {
    const processedImages = [];

    for (let i = 0; i < images.length; i++) {
      let width = parseInt(images[i].width);
      const height = parseInt(images[i].height);
      width = width * (rowTargetHeight / height);

      const image = {
        id: images[i].id,
        author: images[i].author,
        authorid: images[i].authorid,
        authorsAvatarUrl: images[i].authorsAvatarUrl,
        epochtime: images[i].epochtime,
        game: images[i].game,
        score: images[i].score,
        shotUrl: images[i].shotUrl,
        spoiler: images[i].spoiler,
        thumbnailUrl: images[i].thumbnailUrl,
        width: width,
        height: rowTargetHeight,
        aspectRatio: images[i].width/images[i].height,
      };

      processedImages.push(image);
    }

    return processedImages;
  };

  const makeSmaller = (image, amount) => {
    amount = amount || 1;

    const newHeight = image.height - amount;
    image.width = image.width * (newHeight / image.height);
    image.height = newHeight;

    return image;
  };

  const getCumulativeWidth = (images) => {
    let width = 0;

    for (let i = 0; i < images.length; i++) {
      width += images[i].width;
    }

    width += (images.length - 1) * borderOffset;

    return width;
  };

  const buildRows = () => {
    let currentRow = 0;
    let currentWidth = 0;
    let imageCounter = 0;
    const rows = [];
    const processedImages = processImages();

    while (processedImages[imageCounter]) {
      if (currentWidth >= maxWidth) {
        currentRow++;
        currentWidth = 0;
      }
      if (!rows[currentRow]) {
        rows[currentRow] = [];
      }

      rows[currentRow].push(processedImages[imageCounter]);
      currentWidth += processedImages[imageCounter].width;

      imageCounter++;
    }

    return rows;
  };

  const normalizeImage = (image) => {
    image.width = parseInt(image.width);
    image.height = parseInt(image.height);

    return image;
  };

  const normalizeImages = (images) => {
    for (let i = 0; i < images.length; i++) {
      normalizeImage(images[i]);
    }

    return images;
  };

  const fitImagesInRow = (images) => {
    while (getCumulativeWidth(images) > maxWidth) {
      for (let i = 0; i < images.length; i++) {
        images[i] = makeSmaller(images[i]);
      }
    }

    return images;
  };

  const renderGrid = (rows) => {
    return (
      <div
        className={className}
        style={{
          paddingLeft: borderOffset,
          paddingTop: profileMode ? borderOffset : 50 + borderOffset,
        }}
      >
        {rows.map((row, index) => {
          return (
            <div key={index} className="image-row">
              {row.map((image, imageIndex) => {
                return (
                  <div
                    className="thumbnail-container"
                    style={{
                      marginRight: borderOffset,
                      marginBottom: borderOffset,
                    }}
                    key={`thumbnail-container-${image.id}`}
                  >
                    <img
                      className={image.spoiler ? 'spoiler' : undefined}
                      alt={image.gameName}
                      key={imageIndex}
                      id={`img-${image.epochtime}`}
                      src={image.thumbnailUrl}
                      style={{
                        width: Math.ceil(image.width),
                        height: image.height,
                        cursor: 'pointer',
                      }}
                      onClick={() => onClick(image)}
                    />
                    {image.spoiler && (
                      <div
                        className="spoiler"
                        onClick={(event) => {
                          event.target.style.display = 'none';
                          const imageElement=document.getElementById(`img-${image.epochtime}`);
                          imageElement.classList.remove('spoiler');
                        }}
                      >
                        <span>NSFW / Spoiler</span>
                      </div>
                    )}
                    <div className="image-info">
                      <div className="game">{image.game}</div>
                      <div>
                        <span className="by">by</span>{' '}
                        <span className="author">{image.author}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const buildGrid = () => {
    const rows = buildRows();

    for (let i = 0; i < rows.length; i++) {
      rows[i] = fitImagesInRow(rows[i]);

      rows[i] = normalizeImages(rows[i]);

      const difference = maxWidth - getCumulativeWidth(rows[i]);
      const amountOfImages = rows[i].length;

      if (amountOfImages > 1 && difference < 10) {
        const addToEach = difference / amountOfImages;
        for (let n = 0; n < rows[i].length; n++) {
          rows[i][n].width += addToEach;
        }

        rows[i] = normalizeImages(rows[i]);

        rows[i][rows[i].length - 1].width += maxWidth - getCumulativeWidth(rows[i]);
      }
    }

    return renderGrid(rows);
  };

  return buildGrid();
};

export default ImageGrid;
