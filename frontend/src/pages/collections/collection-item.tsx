import { Link } from "react-router-dom";
import { Badge } from "~/components/ui/badge";
import { CollectionModel } from "~/db/models";

interface CollectionItemProps {
  collection: CollectionModel;
  toncoinPrice: number;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  toncoinPrice,
}) => {
  const getPriceInUsd = () => {
    const price = Number(collection.nftPrice);
    const usd_price = price * toncoinPrice;
    return usd_price.toFixed(2);
  };

  return (
    <Link
      to={`/collections/${collection._id}`}
      className="block p-3 border-b border-border last:border-none"
    >
      <div className="flex gap-4 items-center collection-item">
        <img
          src={collection.image}
          alt={collection.image}
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex-grow flex flex-col justify-between">
          <div className="text-lg font-semibold truncate max-w-full overflow-hidden">
            {collection.name}
          </div>
          <div className="flex gap-2 items-center">
            {collection.deployed && (
              <Badge>Deployed</Badge>
            )}
            <div className="text-sm text-gray-500">
              {collection.itemsLimit === 0 ? "∞" : collection.itemsLimit} items
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col justify-between">
          <div className="text-lg font-semibold truncate max-w-full overflow-hidden">
            {collection.nftPrice} TON
          </div>
          {toncoinPrice && (
            <div className="text-sm text-gray-500">≈ {getPriceInUsd()}$</div>
          )}
        </div>
      </div>
    </Link>
  );
};
