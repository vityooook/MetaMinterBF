import { Link } from "react-router-dom";
import catImg from "~/assets/images/cat.jpg";

interface CollectionListProps {
  collection: {
    hash: string;
    title: string;
    items_limit: number;
    items: { price: number }[];
  };
  toncoin_price: number;
}

export const CollectionList: React.FC<CollectionListProps> = ({
  collection,
  toncoin_price,
}) => {
  const getPriceInUsd = () => {
    const price = Number(collection.items[0].price);
    const usd_price = price * toncoin_price;
    return usd_price.toFixed(2);
  };

  return (
    <Link to={`/mint/${collection.hash}`} className="router-link-no-style">
      <div className="flex gap-4 items-center collection-item">
        <img
          src={catImg}
          alt={collection.title}
          className="w-10 h-10 rounded-lg"
        />
        <div className="flex-grow flex flex-col justify-between">
          <div className="text-lg font-semibold">{collection.title}</div>
          <div className="text-sm text-gray-500">
            {collection.items_limit === 0 ? "∞" : collection.items_limit} items
          </div>
        </div>
        <div className="text-right flex flex-col justify-between">
          <div className="text-lg font-semibold">
            {collection.items[0].price} TON
          </div>
          {toncoin_price && (
            <div className="text-sm text-gray-500">≈ {getPriceInUsd()}$</div>
          )}
        </div>
      </div>
    </Link>
  );
};
