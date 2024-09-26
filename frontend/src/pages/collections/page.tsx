import { UserInfo } from "~/components/user-info";
import { CollectionList } from "~/components/collection-list";

export const CollectionPage: React.FC = () => {

  return (
    <>
      <UserInfo />
      {collections && collections.length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-220px)] text-gray-500">
          No collections found
        </div>
      ) : (
        <>
          <div className="text-lg font-semibold mb-4">Created Collections</div>
          <div className="grid gap-4">
            {collections?.map((collection, index) => (
              <CollectionList
                key={index}
                collection={collection}
                toncoin_price={toncoinPrice || 0}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};
