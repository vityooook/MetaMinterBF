import React from "react";
import { Link, useParams } from "react-router-dom";
import SocialLogo from "~/components/socia-logo";
import catImg from "~/assets/images/cat.jpg";
import { useCollectionStore } from "~/db/collectionStore";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { minifyAddress } from "~/lib/utils";

export const CollectionView: React.FC = () => {
  const { hash } = useParams<{ hash: string }>();
  const collection = useCollectionStore((state) => state.getCollection(hash!));

  return (
    <div className="-mt-4">
      {collection && collection.deployed ? (
        <header className="bg-card space-y-2 flex flex-col items-center pb-4 py-8">
          <img
            src={catImg}
            className="rounded-2xl w-32 h-32"
            alt={collection.image}
          />
          <h1 className="text-2xl font-semibold">{collection.name}</h1>
          <div className="text-muted-foreground">{collection.description}</div>
          {collection.links.length > 0 && (
            <div className="flex">
              {collection.links.map((url, index) => (
                <Link to={url} target="_blank" key={index}>
                  <Badge className="flex gap-1" variant="secondary">
                    <SocialLogo className="w-4 h-4" url={url} />
                    {url}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </header>
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
        <Card className="mt-6">
          {collection.address && (
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="text-muted-foreground">Address</div>
              <div>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`https://tonscan.org/address/${collection.address}`}
                >
                  {minifyAddress(collection.address)}
                </Link>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="text-muted-foreground">Items</div>
            <div>
              {collection.itemsLimit === 0 ? "∞" : collection.itemsLimit}
            </div>
          </div>
          <div className="flex items-center justify-between p-3">
            <div className="text-muted-foreground">Price</div>
            <div>{collection.items[0].price} TON</div>
          </div>
        </Card>
      )}

      {collection && collection?.items?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-2">Your NFT Item preview</h2>

          <Card className="card flex flex-col items-center py-4">
            <img
              src={catImg}
              className="rounded-2xl w-32 h-32"
              alt={collection.items[0].image}
            />
            <h1 className="text-2xl font-semibold">
              {collection.items[0].name}
            </h1>
            <div className="text-muted-foreground">
              {collection.items[0].description}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};
