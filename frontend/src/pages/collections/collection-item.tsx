import { Link } from "react-router-dom";
import catImg from "~/assets/images/cat.jpg";
import { NftCollection } from "~/db/models";

interface CollectionItemProps {
  collection: NftCollection;
  toncoinPrice: number;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  toncoinPrice,
}) => {
  const getPriceInUsd = () => {
    const price = Number(collection.items[0].price);
    const usd_price = price * toncoinPrice;
    return usd_price.toFixed(2);
  };

  return (
    <Link
      to={`/collections/${collection.hash}`}
      className="block p-3 border-b border-border last:border-none"
    >
      <div className="flex gap-4 items-center collection-item">
        <img
          src={catImg}
          alt={collection.image}
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex-grow flex flex-col justify-between">
          <div className="text-lg font-semibold">{collection.name}</div>
          <div className="text-sm text-gray-500">
            {collection.itemsLimit === 0 ? "∞" : collection.itemsLimit} items
          </div>
        </div>
        <div className="text-right flex flex-col justify-between">
          <div className="text-lg font-semibold">
            {collection.items[0].price} TON
          </div>
          {toncoinPrice && (
            <div className="text-sm text-gray-500">≈ {getPriceInUsd()}$</div>
          )}
        </div>
      </div>
    </Link>
  );
};
