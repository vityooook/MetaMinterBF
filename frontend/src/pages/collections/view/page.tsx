import React from "react";
import { useParams } from "react-router-dom";
import SocialLogo from "~/components/socia-logo";
import { useCollectionStore } from "~/db/collectionStore";

export const CollectionView: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const collection = useCollectionStore((state) => state.getCollection(hash!));

  return (
    <>
      {collection && collection.deployed ? (
        <section className="mint-main-bg">
          {/* <img
            src={imgSrc(collection.image)}
            className="collection-img"
            alt={collection.image}
          /> */}
          <h1>{collection.name}</h1>
          <div className="description muted">{collection.description}</div>
          {collection.links.length > 0 && (
            <div className="links-container">
              {collection.links.map((url, index) => (
                <a
                  key={index}
                  className="link"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialLogo className="link-img" url={url} />
                  {url}
                </a>
              ))}
            </div>
          )}
        </section>
      ) : collection && !collection.deployed ? (
        <div className="centered-block">
          <img
            src="/public/pleading-face-emoji.png"
            className="not-deployed__emoji"
            alt="Not deployed"
          />
          <div>
            Sorry, but the collection you're looking for is not deployed yet
          </div>
        </div>
      ) : (
        <div className="centered-block muted">Loading...</div>
      )}

      {collection && (
        <div className="card">
          {/* {collection.address && (
            <div className="card-row">
              <div className="card-row__left">Address</div>
              <div className="card-row__right">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://tonscan.org/address/${parseAddress(collection.address)}`}
                >
                  {minifyAddress(collection.address)}
                </a>
              </div>
            </div>
          )} */}
          <div className="card-row">
            <div className="card-row__left">Items</div>
            <div className="card-row__right">
              {collection.itemsLimit === 0 ? "∞" : collection.itemsLimit}
            </div>
          </div>
          <div className="card-row">
            <div className="card-row__left">Price</div>
            <div className="card-row__right">
              {collection.items[0].price} TON
            </div>
          </div>
        </div>
      )}

      {collection && collection?.items?.length > 0 && (
        <>
          <div className="card-subtitle">Your NFT Item preview</div>

          <div className="card nft-preview">
            {/* <img
            src={imgSrc(collection.items[0].image)}
            className="nft-preview__img"
            alt={collection.items[0].title}
          /> */}
            <div className="nft-preview__text">
              <h3>{collection.items[0].name}</h3>
              <p className="muted" style={{ marginTop: ".5rem" }}>
                {collection.items[0].description}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
